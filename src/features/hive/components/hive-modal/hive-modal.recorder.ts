import { MAX_RECORDING_S, RECORDING_RATE } from "../../hive.data";
import { addWorklet, createAudioContext, rmsLevel } from "./hive-modal.voice";

// Listens for the end of a sentence, so the visitor doesn't have to press stop.
const CALIBRATE_S = 0.3;
const MIN_LEVEL = 0.012;
const NOISE_MULTIPLE = 3;
// The noise floor can't rise past this, so a visitor who starts talking while
// it's being measured can't set the bar above their own voice.
const MAX_NOISE = 0.016;
const RESUME_TIMEOUT_MS = 1000;
const MIN_SPEECH_S = 0.15;
const END_SILENCE_S = 1.2;
const GIVE_UP_S = 7;
// A manual stop shorter than this can't hold a question.
const MIN_MANUAL_S = 0.4;

export interface IVoiceRecorder {
  // Stops and delivers what was recorded.
  finish: () => void;
  // Stops and throws the recording away.
  cancel: () => void;
}

// Sends audio in blocks, off the main thread, so the 3D scene can't drop any.
const WORKLET = `
class HiveMicCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.block = new Float32Array(2048);
    this.filled = 0;
    this.stopped = false;
    this.port.onmessage = () => { this.stopped = true; };
  }

  process(inputs) {
    if (this.stopped) return false;
    const channel = inputs[0][0];
    if (!channel) return true;
    for (let i = 0; i < channel.length; i++) {
      this.block[this.filled++] = channel[i];
      if (this.filled === this.block.length) {
        this.port.postMessage(this.block, [this.block.buffer]);
        this.block = new Float32Array(2048);
        this.filled = 0;
      }
    }
    return true;
  }
}
registerProcessor("hive-mic-capture", HiveMicCapture);
`;

export const canRecord = () =>
  !!navigator.mediaDevices?.getUserMedia && "AudioWorkletNode" in window;

// Averages down to 16-bit mono at RECORDING_RATE, in a WAV every model reads.
function encodeWav(blocks: Float32Array[], sourceRate: number) {
  const total = blocks.reduce((sum, block) => sum + block.length, 0);
  const ratio = sourceRate / RECORDING_RATE;
  const samples = Math.min(
    Math.floor(total / ratio),
    MAX_RECORDING_S * RECORDING_RATE,
  );
  const view = new DataView(new ArrayBuffer(44 + samples * 2));
  const text = (at: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(at + i, value.charCodeAt(i));
    }
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, RECORDING_RATE, true);
  view.setUint32(28, RECORDING_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, samples * 2, true);

  let block = 0;
  let inBlock = 0;
  let consumed = 0;
  for (let i = 0; i < samples; i++) {
    const until = Math.round((i + 1) * ratio);
    let sum = 0;
    let count = 0;
    while (consumed < until && block < blocks.length) {
      sum += blocks[block][inBlock++];
      count++;
      consumed++;
      if (inBlock === blocks[block].length) {
        block++;
        inBlock = 0;
      }
    }
    const value = Math.max(-1, Math.min(1, count ? sum / count : 0));
    view.setInt16(44 + i * 2, value * 0x7fff, true);
  }
  return new Blob([view.buffer], { type: "audio/wav" });
}

// Records one spoken question. `onDone` gets the audio, or null if nobody spoke.
export async function startRecorder(
  onDone: (wav: Blob | null) => void,
): Promise<IVoiceRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
  const stopTracks = () => stream.getTracks().forEach((t) => t.stop());
  const ctx = createAudioContext();
  if (!ctx) {
    stopTracks();
    throw new Error("no audio engine");
  }

  let source: MediaStreamAudioSourceNode;
  let capture: AudioWorkletNode;
  let mute: GainNode;
  // Any failure here has to release the mic, because no recorder is returned
  // for the caller to cancel.
  try {
    let timer = 0;
    await Promise.race([
      ctx.resume(),
      new Promise((resolve) => {
        timer = window.setTimeout(resolve, RESUME_TIMEOUT_MS);
      }),
    ]).finally(() => window.clearTimeout(timer));
    if (ctx.state !== "running") throw new Error("audio engine stalled");
    await addWorklet(ctx, WORKLET);

    source = ctx.createMediaStreamSource(stream);
    capture = new AudioWorkletNode(ctx, "hive-mic-capture", {
      numberOfOutputs: 1,
    });
    // Silent, but a node has to reach the output for every browser to run it.
    mute = ctx.createGain();
    mute.gain.value = 0;
    source.connect(capture).connect(mute).connect(ctx.destination);
  } catch (e) {
    stopTracks();
    void ctx.close().catch(() => {});
    throw e;
  }

  const rate = ctx.sampleRate;
  const blocks: Float32Array[] = [];
  let seconds = 0;
  let noise = 0;
  let noiseBlocks = 0;
  let speech = 0;
  let quiet = 0;
  let closed = false;

  const close = () => {
    closed = true;
    capture.port.onmessage = null;
    capture.port.postMessage("stop");
    source.disconnect();
    capture.disconnect();
    mute.disconnect();
    stopTracks();
    void ctx.close().catch(() => {});
  };

  const deliver = (keep: boolean) => {
    if (closed) return;
    close();
    onDone(keep ? encodeWav(blocks, rate) : null);
  };

  capture.port.onmessage = ({ data }: MessageEvent<Float32Array>) => {
    if (closed) return;
    blocks.push(data);
    const length = data.length / rate;
    seconds += length;

    const level = rmsLevel(data);

    if (seconds <= CALIBRATE_S) {
      // The quietest block, since speech only ever adds to the room's level.
      noise = noiseBlocks ? Math.min(noise, level) : level;
      noiseBlocks++;
    }
    const floor = Math.min(noise, MAX_NOISE);
    const talking = level > Math.max(MIN_LEVEL, floor * NOISE_MULTIPLE);
    if (talking) {
      speech += length;
      quiet = 0;
    } else {
      quiet += length;
    }

    const spoke = speech >= MIN_SPEECH_S;
    if (seconds >= MAX_RECORDING_S) deliver(spoke);
    else if (spoke && quiet >= END_SILENCE_S) deliver(true);
    else if (!spoke && seconds >= GIVE_UP_S) deliver(false);
  };

  return {
    // Pressed by hand, so it's sent even if the level meter heard nothing.
    finish: () => deliver(seconds >= MIN_MANUAL_S),
    cancel: () => {
      if (!closed) close();
    },
  };
}
