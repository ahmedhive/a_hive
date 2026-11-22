import { TSpeechEvent } from "../hive.interface";
import { geminiHeaders, geminiUrl } from "./ask-hive.gemini";

// Hive's spoken voice, streamed with the same Gemini key as its answers.
// Free-tier limits are per model, so a spent model falls through to the next.
const MODELS = [
  process.env.GEMINI_TTS_MODEL,
  "gemini-3.8-flash-lite-tts",
  "gemini-3.8-flash-tts",
  "gemini-3.1-flash-tts-preview",
].filter((m): m is string => !!m);
// Other deep options: Orus, Iapetus, Algieba, Rasalgethi.
const VOICE = process.env.GEMINI_TTS_VOICE || "Charon";
// This notes-then-transcript layout directs the delivery. A plain "Say it
// like this:" prefix gets read out loud by the newer models.
const DIRECTION = `### DIRECTOR'S NOTES
Style: a highly advanced artificial intelligence and refined butler. Low, smooth, even and precise. Courteous, with minimal emotion.
Accent: English Received Pronunciation from London, never American, with crisp consonants.
Pace: steady and unhurried.
### TRANSCRIPT
`;
const FIRST_AUDIO_TIMEOUT_MS = 7_000;
const MAX_CHARS = 700;
const DEFAULT_RATE = 24_000;
// Audio is forwarded in pieces of at least this long.
const SEND_SECONDS = 0.2;
// Some models occasionally say everything twice. Audio is generated several
// times faster than it plays, so the full length is known well before
// playback could reach a repeat, and it can be cut off in time.
const MAX_SECONDS_BASE = 1.2;
const MAX_SECONDS_PER_CHAR = 0.12;
const TYPICAL_SECONDS_PER_CHAR = 0.085;
const MAX_PASSES = 3;
const QUIET_LEVEL = 350;
const MIN_PAUSE_SECONDS = 0.2;

interface IInlineAudio {
  data?: string;
  mimeType?: string;
}

// Where the first reading ends: the longest pause near the expected point.
function findRepeatStart(pcm: Buffer, around: number, rate: number) {
  const from = Math.max(0, Math.floor(around * 0.82));
  const to = Math.min(Math.floor(pcm.length / 2), Math.ceil(around * 1.18));
  const minRun = Math.floor(rate * MIN_PAUSE_SECONDS);
  let bestStart = -1;
  let bestLength = 0;
  let runStart = -1;
  for (let i = from; i < to; i++) {
    const quiet = Math.abs(pcm.readInt16LE(i * 2)) < QUIET_LEVEL;
    if (quiet && runStart < 0) runStart = i;
    if ((!quiet || i === to - 1) && runStart >= 0) {
      const length = i - runStart;
      if (length >= minRun && length > bestLength) {
        bestStart = runStart;
        bestLength = length;
      }
      runStart = -1;
    }
  }
  return bestStart < 0
    ? Math.floor(around)
    : bestStart + Math.floor(Math.min(bestLength / 2, rate * 0.12));
}

// The sample where a repeated reading begins, or null for a normal clip.
function repeatCut(pcm: Buffer, chars: number, limit: number, rate: number) {
  const samples = Math.floor(pcm.length / 2);
  if (samples <= limit) return null;
  const typical = Math.max(1, chars * TYPICAL_SECONDS_PER_CHAR * rate);
  const passes = Math.min(
    MAX_PASSES,
    Math.max(2, Math.round(samples / typical)),
  );
  return findRepeatStart(pcm, samples / passes, rate);
}

async function* readAudioParts(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      text += decoder.decode(value, { stream: true });
      let newline = text.indexOf("\n");
      while (newline >= 0) {
        const line = text.slice(0, newline).trim();
        text = text.slice(newline + 1);
        newline = text.indexOf("\n");
        if (!line.startsWith("data:")) continue;
        const data = JSON.parse(line.slice(5)) as {
          candidates?: {
            content?: { parts?: { inlineData?: IInlineAudio }[] };
          }[];
        };
        for (const part of data.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) yield part.inlineData;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function* streamModel(
  model: string,
  transcript: string,
  key: string,
  signal: AbortSignal,
): AsyncGenerator<TSpeechEvent, boolean> {
  const local = new AbortController();
  const firstAudio = setTimeout(() => local.abort(), FIRST_AUDIO_TIMEOUT_MS);
  let sent = false;
  try {
    const res = await fetch(geminiUrl(model, "streamGenerateContent?alt=sse"), {
      method: "POST",
      headers: geminiHeaders(key),
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${DIRECTION}${transcript}` }] },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
          },
        },
      }),
      signal: AbortSignal.any([signal, local.signal]),
    });
    if (!res.ok || !res.body) {
      if (process.env.NODE_ENV === "development") {
        console.info(`[hive] speech model ${model} failed: ${res.status}`);
      }
      return false;
    }

    let rate = DEFAULT_RATE;
    let limit = 0;
    let all: Buffer = Buffer.alloc(0);
    let forwarded = 0;
    let first = true;

    for await (const part of readAudioParts(res.body)) {
      let bytes: Buffer = Buffer.from(part.data ?? "", "base64");
      if (first) {
        first = false;
        clearTimeout(firstAudio);
        if (bytes.subarray(0, 4).toString() === "RIFF") {
          rate = bytes.readUInt32LE(24);
          bytes = bytes.subarray(44);
        } else {
          rate = Number(part.mimeType?.match(/rate=(\d+)/)?.[1] ?? rate);
        }
        limit = Math.ceil(
          (MAX_SECONDS_BASE + transcript.length * MAX_SECONDS_PER_CHAR) * rate,
        );
      }
      all = Buffer.concat([all, bytes]);

      const samples = Math.floor(all.length / 2);
      if (samples > limit * MAX_PASSES) {
        local.abort();
        break;
      }

      const ready = samples * 2 - forwarded;
      if (ready >= rate * 2 * SEND_SECONDS) {
        const end = samples * 2;
        sent = true;
        yield {
          t: "audio",
          rate,
          pcm: all.subarray(forwarded, end).toString("base64"),
        };
        forwarded = end;
      }
    }

    const end = Math.floor(all.length / 2) * 2;
    if (end > forwarded) {
      sent = true;
      yield {
        t: "audio",
        rate,
        pcm: all.subarray(forwarded, end).toString("base64"),
      };
    }
    const cut = repeatCut(all, transcript.length, limit, rate);
    if (cut !== null) yield { t: "cut", sample: cut };
    return sent;
  } catch {
    // Audio already on its way can't be restarted on another model.
    return sent;
  } finally {
    clearTimeout(firstAudio);
  }
}

// Streams audio as it's generated. If nothing can be produced, it simply
// yields nothing and the browser's voice takes over, so a spent quota never
// silences the assistant.
export async function* streamSpeech(
  text: string,
  key: string,
  signal: AbortSignal,
): AsyncGenerator<TSpeechEvent> {
  if (text.length > MAX_CHARS) return;
  const transcript = text.replace(/#/g, "");
  for (const model of MODELS) {
    if (signal.aborted) return;
    const stream = streamModel(model, transcript, key, signal);
    let next = await stream.next();
    while (!next.done) {
      yield next.value;
      next = await stream.next();
    }
    if (next.value) return;
  }
}
