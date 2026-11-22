import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ASSISTANT_ENDPOINT,
  ASSISTANT_ERRORS,
  greetingFor,
  MAX_HISTORY,
  MAX_QUESTION_LENGTH,
  MIC_ERROR_FALLBACK,
  MIC_ERRORS,
  SPEECH_LANG,
  TRANSCRIBE_ENDPOINT,
  VOICE_PITCH,
  VOICE_PREFERENCES,
  VOICE_RATE,
} from "../../hive.data";
import {
  IChatMessage,
  IHiveInput,
  ISpeechRecognition,
  THiveState,
  THiveStreamEvent,
} from "../../hive.interface";
import {
  createPcmPlayer,
  IPcmPlayer,
  pcmFromBase64,
} from "./hive-modal.stream";
import {
  canRecord,
  IVoiceRecorder,
  startRecorder,
} from "./hive-modal.recorder";
import {
  buildVoiceChain,
  IVoiceChain,
  rmsLevel,
  VOICE,
} from "./hive-modal.voice";

type TRecognitionCtor = new () => ISpeechRecognition;

function getRecognitionCtor(): TRecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: TRecognitionCtor;
    webkitSpeechRecognition?: TRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const subscribeNever = () => () => {};

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  for (const name of VOICE_PREFERENCES) {
    const match = voices.find((v) => v.name.startsWith(name));
    if (match) return match;
  }
  const lang = SPEECH_LANG.split("-")[0];
  return (
    voices.find((v) => v.lang === SPEECH_LANG && v.default) ??
    voices.find((v) => v.lang === SPEECH_LANG) ??
    voices.find((v) => v.lang.startsWith(lang))
  );
}

const MIC_PERMISSION_ERRORS: Record<string, string> = {
  NotAllowedError: "not-allowed",
  SecurityError: "not-allowed",
  NotFoundError: "audio-capture",
  OverconstrainedError: "audio-capture",
  NotReadableError: "in-use",
};

// A working engine reports "start" within moments of being asked.
const RECOGNITION_START_TIMEOUT_MS = 1500;
// These mean the browser's speech engine can't work here, whatever is said.
const ENGINE_FAILURES = new Set([
  "network",
  "not-allowed",
  "service-not-allowed",
  "language-not-supported",
]);

// Opera, Vivaldi and Brave expose the speech API without a working engine, so
// they go straight to recording. Any other browser is found out on first use.
let nativeSpeechFailed = false;
function shouldUseNativeSpeech() {
  if (nativeSpeechFailed || !getRecognitionCtor()) return false;
  const brave = "brave" in navigator;
  return !brave && !/\bOPR\/|\bVivaldi\//.test(navigator.userAgent);
}

function micErrorText(e: unknown) {
  const name = e instanceof DOMException ? e.name : "";
  return MIC_ERRORS[MIC_PERMISSION_ERRORS[name]] ?? MIC_ERROR_FALLBACK;
}

function assistantErrorText(code?: string) {
  const key = (code ?? "generic") as keyof typeof ASSISTANT_ERRORS;
  return ASSISTANT_ERRORS[key] ?? ASSISTANT_ERRORS.generic;
}

function detachRecognition(recognition: ISpeechRecognition) {
  recognition.onresult = null;
  recognition.onerror = null;
  recognition.onend = null;
  recognition.abort();
}

const isAbort = (e: unknown) =>
  e instanceof DOMException && e.name === "AbortError";

export default function useAssistant(
  muted: boolean,
  inputRef: RefObject<IHiveInput>,
) {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [status, setStatusState] = useState<THiveState>("idle");
  const [error, setError] = useState("");
  // The voice couldn't be heard, so the subtitle has to carry the reply.
  const [voiceFailed, setVoiceFailed] = useState(false);
  // The recorder is still opening, so anything said now wouldn't be captured.
  const [micStarting, setMicStarting] = useState(false);
  // False on the server and during hydration, then the real answer.
  const canListen = useSyncExternalStore(
    subscribeNever,
    () => !!getRecognitionCtor() || canRecord(),
    () => false,
  );
  const canSpeak = useSyncExternalStore(
    subscribeNever,
    () => "speechSynthesis" in window,
    () => true,
  );
  // Async callbacks read the live status here, never a render's snapshot.
  const statusRef = useRef<THiveState>("idle");
  const disposedRef = useRef(false);
  const messagesRef = useRef<IChatMessage[]>([]);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const recorderRef = useRef<IVoiceRecorder | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestingRef = useRef(false);
  const mutedRef = useRef(muted);
  const chainRef = useRef<IVoiceChain | null>(null);
  const greetedRef = useRef(false);
  // Picked from the visitor's clock each time Hive greets them.
  const [greeting, setGreeting] = useState(() =>
    greetingFor(new Date().getHours()),
  );
  const sourceRef = useRef<{ stop: () => void } | null>(null);
  // Identifies the current turn. Whatever a turn started checks it after each
  // wait, and stops if a newer turn (or closing Hive) has replaced it.
  const voiceTokenRef = useRef(0);
  const levelRafRef = useRef(0);

  const setStatus = useCallback((next: THiveState) => {
    statusRef.current = next;
    setStatusState(next);
  }, []);

  const stopSource = useCallback(() => {
    try {
      sourceRef.current?.stop();
    } catch {
      // Already finished.
    }
  }, []);

  // Called during a click or key press, while the browser allows audio to start.
  const unlockAudio = useCallback(() => {
    if (mutedRef.current) return;
    chainRef.current ??= buildVoiceChain();
    void chainRef.current?.ctx.resume().catch(() => {});
  }, []);

  // Ends the current turn: its request, microphone and voice. The status is
  // left alone, because callers decide that.
  const silence = useCallback(() => {
    voiceTokenRef.current += 1;
    abortRef.current?.abort();
    const recognition = recognitionRef.current;
    if (recognition) {
      detachRecognition(recognition);
      recognitionRef.current = null;
    }
    recorderRef.current?.cancel();
    recorderRef.current = null;
    setVoiceFailed(false);
    cancelAnimationFrame(levelRafRef.current);
    inputRef.current.voiceLevel = -1;
    stopSource();
    sourceRef.current = null;
    window.speechSynthesis?.cancel();
  }, [inputRef, stopSource]);

  useEffect(() => {
    mutedRef.current = muted;
    if (!muted) return;
    // Stopping fires the voice's end handler, which sets idle.
    stopSource();
    window.speechSynthesis?.cancel();
  }, [muted, stopSource]);

  useEffect(() => {
    disposedRef.current = false;
    // Chrome loads its voice list late; asking for it here starts the load.
    const synth = window.speechSynthesis;
    const loadVoices = () => synth?.getVoices();
    loadVoices();
    synth?.addEventListener("voiceschanged", loadVoices);
    return () => {
      synth?.removeEventListener("voiceschanged", loadVoices);
      disposedRef.current = true;
      silence();
      void chainRef.current?.ctx.close();
      chainRef.current = null;
    };
  }, [silence]);

  const endVoice = useCallback(
    (token: number) => {
      if (token !== voiceTokenRef.current) return;
      cancelAnimationFrame(levelRafRef.current);
      inputRef.current.voiceLevel = -1;
      sourceRef.current = null;
      setStatus("idle");
    },
    [inputRef, setStatus],
  );

  const speak = useCallback(
    (text: string) => {
      const synth = window.speechSynthesis;
      if (mutedRef.current || !synth) {
        setStatus("idle");
        return;
      }
      synth.cancel();
      const token = voiceTokenRef.current;
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang ?? SPEECH_LANG;
      utterance.rate = VOICE_RATE;
      utterance.pitch = VOICE_PITCH;
      utterance.onend = () => endVoice(token);
      utterance.onerror = (e) => {
        const stopped = e.error === "canceled" || e.error === "interrupted";
        if (!stopped && token === voiceTokenRef.current) setVoiceFailed(true);
        endVoice(token);
      };
      setStatus("speaking");
      synth.speak(utterance);
    },
    [endVoice, setStatus],
  );

  // Drives the face from the real loudness of the voice.
  const startMeter = useCallback(
    (chain: IVoiceChain) => {
      const samples = new Float32Array(chain.analyser.fftSize);
      const meter = () => {
        chain.analyser.getFloatTimeDomainData(samples);
        inputRef.current.voiceLevel = Math.min(1, rmsLevel(samples) * 5);
        levelRafRef.current = requestAnimationFrame(meter);
      };
      meter();
    },
    [inputRef],
  );

  // Plays a whole clip (the greeting) through the current effects.
  const startBuffer = useCallback(
    (chain: IVoiceChain, buffer: AudioBuffer, token: number) => {
      const source = chain.ctx.createBufferSource();
      source.buffer = buffer;
      source.detune.value = VOICE.detune;
      source.connect(chain.input);
      source.onended = () => endVoice(token);
      sourceRef.current = source;
      setStatus("speaking");
      source.start();
      startMeter(chain);
    },
    [endVoice, setStatus, startMeter],
  );

  // A running sound engine. Opening the mic can pause it (macOS switching
  // audio devices, AirPods especially), so wake it, or replace it if stuck.
  const readyChain = useCallback(async () => {
    const wake = async (chain: IVoiceChain) => {
      let timer = 0;
      await Promise.race([
        chain.ctx.resume().catch(() => {}),
        new Promise((resolve) => {
          timer = window.setTimeout(resolve, 500);
        }),
      ]);
      window.clearTimeout(timer);
      return chain.ctx.state === "running";
    };
    if (disposedRef.current) return null;
    chainRef.current ??= buildVoiceChain();
    const current = chainRef.current;
    if (!current) return null;
    const awake = await wake(current);
    if (disposedRef.current) return null;
    if (awake) return current;
    void current.ctx.close().catch(() => {});
    const fresh = buildVoiceChain();
    chainRef.current = fresh;
    if (!fresh || !(await wake(fresh))) return null;
    return disposedRef.current ? null : fresh;
  }, []);

  // Hive introduces itself once it's ready, unless a conversation has begun.
  const playGreeting = useCallback(async () => {
    if (
      greetedRef.current ||
      mutedRef.current ||
      messagesRef.current.length > 0 ||
      statusRef.current !== "idle"
    ) {
      return;
    }
    greetedRef.current = true;
    const current = greetingFor(new Date().getHours());
    setGreeting(current);
    const token = voiceTokenRef.current;
    try {
      const chain = await readyChain();
      if (!chain) throw new Error("sound engine unavailable");
      const data = await (await fetch(current.audio)).arrayBuffer();
      const buffer = await chain.ctx.decodeAudioData(data);
      if (token === voiceTokenRef.current && !mutedRef.current) {
        startBuffer(chain, buffer, token);
      }
    } catch {
      if (token === voiceTokenRef.current) speak(current.text);
    }
  }, [readyChain, speak, startBuffer]);

  // Replay: the greeting comes again, unless a conversation has begun.
  const rearmGreeting = useCallback(() => {
    if (messagesRef.current.length > 0) return;
    silence();
    setStatus("idle");
    greetedRef.current = false;
  }, [setStatus, silence]);

  const ask = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_QUESTION_LENGTH);
      if (!text || disposedRef.current || statusRef.current === "thinking") {
        return;
      }

      silence();
      const token = voiceTokenRef.current;
      setError("");
      unlockAudio();
      const next = [
        ...messagesRef.current,
        { role: "user" as const, text },
      ].slice(-MAX_HISTORY);
      messagesRef.current = next;
      setMessages(next);
      setStatus("thinking");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(ASSISTANT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next,
            speak: !mutedRef.current,
          }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          if (token !== voiceTokenRef.current) return;
          setError(assistantErrorText(data.error));
          setStatus("idle");
          return;
        }

        let reply = "";
        let player: IPcmPlayer | null = null;
        let audioFailed = false;
        let ended = false;

        const handle = async (event: THiveStreamEvent) => {
          if (token !== voiceTokenRef.current) return;
          if (event.t === "reply") {
            reply = event.text;
            const withReply = [
              ...next,
              { role: "assistant" as const, text: reply },
            ].slice(-MAX_HISTORY);
            messagesRef.current = withReply;
            setMessages(withReply);
          } else if (event.t === "audio") {
            if (audioFailed || mutedRef.current) return;
            if (!player) {
              try {
                const chain = await readyChain();
                if (token !== voiceTokenRef.current) return;
                if (!chain) throw new Error("sound engine unavailable");
                player = await createPcmPlayer(
                  chain,
                  event.rate,
                  VOICE.detune,
                  {
                    onStart: () => {
                      if (token !== voiceTokenRef.current) return;
                      setStatus("speaking");
                      startMeter(chain);
                    },
                    onEnd: () => endVoice(token),
                  },
                );
                if (token !== voiceTokenRef.current) {
                  player.stop();
                  return;
                }
                sourceRef.current = player;
              } catch (e) {
                audioFailed = true;
                if (process.env.NODE_ENV === "development") {
                  console.info("[hive] browser voice fallback:", e);
                }
                return;
              }
            }
            player.push(pcmFromBase64(event.pcm));
          } else if (event.t === "cut") {
            player?.cut(event.sample);
          } else {
            ended = true;
          }
        };

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffered = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffered += decoder.decode(value, { stream: true });
            let newline = buffered.indexOf("\n");
            while (newline >= 0) {
              const line = buffered.slice(0, newline);
              buffered = buffered.slice(newline + 1);
              newline = buffered.indexOf("\n");
              if (line) await handle(JSON.parse(line) as THiveStreamEvent);
            }
          }
        } catch (e) {
          // With the reply in hand, a dropped stream still finishes the turn:
          // what audio arrived plays out, or the browser voice reads it.
          if (!reply || isAbort(e)) throw e;
        }

        if (token !== voiceTokenRef.current) return;
        if (!reply) {
          setError(ASSISTANT_ERRORS.generic);
          setStatus("idle");
          return;
        }
        const finalPlayer = player as IPcmPlayer | null;
        if (finalPlayer) {
          finalPlayer.finish();
        } else {
          if (process.env.NODE_ENV === "development") {
            console.info(
              `[hive] browser voice fallback: ${ended ? "no audio from server" : "stream ended early"}`,
            );
          }
          speak(reply);
        }
      } catch (e) {
        if (isAbort(e) || token !== voiceTokenRef.current) return;
        setError(ASSISTANT_ERRORS.generic);
        setStatus("idle");
      }
    },
    [endVoice, readyChain, setStatus, silence, speak, startMeter, unlockAudio],
  );

  // Ends a pending or spoken reply at once; the face follows the status.
  const stopReply = useCallback(() => {
    silence();
    setStatus("idle");
  }, [setStatus, silence]);

  // Sends a recorded question to be written out, then asks it.
  const transcribe = useCallback(
    async (wav: Blob, token: number) => {
      setStatus("thinking");
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(TRANSCRIBE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "audio/wav" },
          body: wav,
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => ({}))) as {
          text?: string;
          error?: string;
        };
        if (token !== voiceTokenRef.current) return;
        // Back to idle first: ask() won't start over a "thinking" status.
        setStatus("idle");
        if (!res.ok) {
          setError(assistantErrorText(data.error));
          return;
        }
        const text = data.text?.trim();
        if (text) void ask(text);
        else setError(MIC_ERRORS["no-speech"]);
      } catch (e) {
        if (isAbort(e) || token !== voiceTokenRef.current) return;
        setError(ASSISTANT_ERRORS.generic);
        setStatus("idle");
      }
    },
    [ask, setStatus],
  );

  // The path for browsers whose own speech engine doesn't work.
  const startRecording = useCallback(
    async (token: number) => {
      requestingRef.current = true;
      setMicStarting(true);
      setStatus("listening");
      try {
        const recorder = await startRecorder((wav) => {
          recorderRef.current = null;
          if (token !== voiceTokenRef.current) return;
          if (wav) {
            void transcribe(wav, token);
          } else {
            setError(MIC_ERRORS["no-speech"]);
            setStatus("idle");
          }
        });
        if (token !== voiceTokenRef.current) recorder.cancel();
        else recorderRef.current = recorder;
      } catch (e) {
        if (token !== voiceTokenRef.current) return;
        setError(micErrorText(e));
        setStatus("idle");
      } finally {
        requestingRef.current = false;
        setMicStarting(false);
      }
    },
    [setStatus, transcribe],
  );

  const toggleListen = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    if (recorderRef.current) {
      recorderRef.current.finish();
      return;
    }
    const Ctor = shouldUseNativeSpeech() ? getRecognitionCtor() : undefined;
    if (
      (!Ctor && !canRecord()) ||
      requestingRef.current ||
      disposedRef.current ||
      statusRef.current === "thinking"
    ) {
      return;
    }
    silence();
    const token = voiceTokenRef.current;
    unlockAudio();
    setError("");
    if (!Ctor) {
      await startRecording(token);
      return;
    }

    // Ask for the mic directly first. Some Chromium browsers (Brave, Arc)
    // fail speech recognition without ever showing a permission prompt;
    // getUserMedia always prompts and names the real problem. The stream is
    // closed at once: recognition opens its own.
    requestingRef.current = true;
    setStatus("listening");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      if (token !== voiceTokenRef.current) return;
      setError(micErrorText(e));
      setStatus("idle");
      return;
    } finally {
      requestingRef.current = false;
    }
    // Hive closed, or a typed question took over, during the prompt.
    if (token !== voiceTokenRef.current) return;

    const recognition = new Ctor();
    recognition.lang = SPEECH_LANG;
    recognition.interimResults = false;
    let heard = "";
    let failure = "";
    let engineFailed = false;
    recognition.onresult = (e) => {
      heard = e.results[0]?.[0]?.transcript ?? "";
    };
    // Fires before onend; "aborted" is the visitor pressing the mic again.
    recognition.onerror = (e) => {
      heard = "";
      if (e.error === "aborted") return;
      engineFailed = ENGINE_FAILURES.has(e.error);
      // The mic is already granted, so "not-allowed" here means the browser
      // itself blocks its speech service.
      const code = e.error === "not-allowed" ? "service-blocked" : e.error;
      failure = MIC_ERRORS[code] ?? MIC_ERROR_FALLBACK;
    };
    // Some browsers ship the API with no engine behind it: start() succeeds,
    // then no event ever fires. Recording takes over from them.
    const fallBackToRecording = () => {
      nativeSpeechFailed = true;
      if (canRecord()) {
        void startRecording(token);
        return true;
      }
      return false;
    };
    let startWatch = 0;
    recognition.onstart = () => window.clearTimeout(startWatch);
    recognition.onend = () => {
      window.clearTimeout(startWatch);
      recognitionRef.current = null;
      if (heard) {
        void ask(heard);
        return;
      }
      if (engineFailed && fallBackToRecording()) return;
      if (failure) setError(failure);
      setStatus("idle");
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setError(MIC_ERROR_FALLBACK);
      setStatus("idle");
      return;
    }
    startWatch = window.setTimeout(() => {
      if (recognitionRef.current !== recognition) return;
      detachRecognition(recognition);
      recognitionRef.current = null;
      if (fallBackToRecording()) return;
      setError(MIC_ERRORS["no-engine"]);
      setStatus("idle");
    }, RECOGNITION_START_TIMEOUT_MS);
  }, [ask, setStatus, silence, startRecording, unlockAudio]);

  // A stopped question has no answer, so the last one Hive gave still stands.
  const lastAnswer = messages.filter((m) => m.role === "assistant").at(-1);
  const reply = messages.length ? (lastAnswer?.text ?? "") : greeting.text;
  // Subtitles follow the voice, and stay up when it can't be heard.
  const replyVisible =
    status === "speaking" || muted || !canSpeak || voiceFailed;

  return {
    reply,
    replyVisible,
    asked: messages.length > 0,
    status,
    error,
    canListen,
    micStarting,
    ask,
    stopReply,
    toggleListen,
    playGreeting,
    rearmGreeting,
  };
}
