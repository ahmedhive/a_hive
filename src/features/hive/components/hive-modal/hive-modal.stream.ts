import { addWorklet, IVoiceChain } from "./hive-modal.voice";

// Seconds of speech to hold before starting, so a slow network doesn't stutter.
const PREBUFFER_SECONDS = 0.3;

export interface IPcmPlayer {
  push: (pcm: Float32Array) => void;
  // Ends playback at this sample of the source audio.
  cut: (sample: number) => void;
  // No more audio is coming.
  finish: () => void;
  stop: () => void;
}

interface IPcmCallbacks {
  onStart: () => void;
  onEnd: () => void;
}

// One continuous audio stream, resampled here, so chunks join with no clicks.
const WORKLET = `
class HivePcmPlayer extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const { ratio, prebuffer } = options.processorOptions;
    this.ratio = ratio;
    this.prebuffer = prebuffer;
    this.queue = [];
    this.chunk = null;
    this.at = 0;
    this.pushed = 0;
    this.read = 0;
    this.limit = Infinity;
    this.done = false;
    this.stopped = false;
    this.started = false;
    this.s0 = 0;
    this.s1 = 0;
    this.frac = 1;
    this.level = 0;
    this.port.onmessage = ({ data }) => {
      if (data.pcm) {
        this.queue.push(data.pcm);
        this.pushed += data.pcm.length;
      }
      if (data.cut !== undefined) this.limit = data.cut;
      if (data.done) this.done = true;
      if (data.stop) this.stopped = true;
    };
  }

  pull() {
    if (this.read >= this.limit) return null;
    while (!this.chunk || this.at >= this.chunk.length) {
      this.chunk = this.queue.shift() ?? null;
      this.at = 0;
      if (!this.chunk) return null;
    }
    this.read++;
    return this.chunk[this.at++];
  }

  process(_inputs, outputs) {
    if (this.stopped) {
      this.port.postMessage({ ended: true });
      return false;
    }
    if (!this.started) {
      const buffered = Math.min(this.pushed, this.limit);
      if (buffered < this.prebuffer && !this.done && this.limit === Infinity) {
        return true;
      }
      this.started = true;
      this.port.postMessage({ started: true });
    }
    const output = outputs[0][0];
    let starved = false;
    for (let i = 0; i < output.length; i++) {
      while (!starved && this.frac >= 1) {
        const next = this.pull();
        if (next === null) {
          starved = true;
          break;
        }
        this.s0 = this.s1;
        this.s1 = next;
        this.frac -= 1;
      }
      // A short fade whenever audio runs out, so an edge never clicks.
      this.level += ((starved ? 0 : 1) - this.level) * 0.02;
      const value = this.s0 + (this.s1 - this.s0) * Math.min(this.frac, 1);
      output[i] = value * this.level;
      if (!starved) this.frac += this.ratio;
    }
    const finished = this.done || this.read >= this.limit;
    if (starved && finished && this.level < 0.01) {
      this.port.postMessage({ ended: true });
      return false;
    }
    return true;
  }
}
registerProcessor("hive-pcm-player", HivePcmPlayer);
`;

const loaded = new WeakMap<BaseAudioContext, Promise<void>>();

function loadWorklet(ctx: AudioContext) {
  let ready = loaded.get(ctx);
  if (!ready) {
    ready = addWorklet(ctx, WORKLET);
    loaded.set(ctx, ready);
  }
  return ready;
}

// Browsers without AudioWorklet play the whole clip once it has arrived.
function bufferedPlayer(
  chain: IVoiceChain,
  rate: number,
  detune: number,
  { onStart, onEnd }: IPcmCallbacks,
): IPcmPlayer {
  const parts: Float32Array[] = [];
  let limit = Infinity;
  let source: AudioBufferSourceNode | null = null;
  let stopped = false;
  return {
    push: (pcm) => parts.push(pcm),
    cut: (sample) => {
      limit = sample;
    },
    finish: () => {
      if (stopped || source) return;
      const total = parts.reduce((sum, part) => sum + part.length, 0);
      const length = Math.min(total, limit);
      if (!length) {
        onEnd();
        return;
      }
      const buffer = chain.ctx.createBuffer(1, length, rate);
      const channel = buffer.getChannelData(0);
      let at = 0;
      for (const part of parts) {
        if (at >= length) break;
        channel.set(part.subarray(0, length - at), at);
        at += part.length;
      }
      source = chain.ctx.createBufferSource();
      source.buffer = buffer;
      source.detune.value = detune;
      source.connect(chain.input);
      source.onended = onEnd;
      onStart();
      source.start();
    },
    stop: () => {
      stopped = true;
      if (!source) {
        onEnd();
        return;
      }
      try {
        source.stop();
      } catch {
        // Already finished.
      }
    },
  };
}

export async function createPcmPlayer(
  chain: IVoiceChain,
  rate: number,
  detune: number,
  callbacks: IPcmCallbacks,
): Promise<IPcmPlayer> {
  if (!chain.ctx.audioWorklet) {
    return bufferedPlayer(chain, rate, detune, callbacks);
  }
  await loadWorklet(chain.ctx);
  const node = new AudioWorkletNode(chain.ctx, "hive-pcm-player", {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [1],
    processorOptions: {
      ratio: (rate / chain.ctx.sampleRate) * Math.pow(2, detune / 1200),
      prebuffer: Math.floor(rate * PREBUFFER_SECONDS),
    },
  });
  node.port.onmessage = ({ data }) => {
    if (data.started) callbacks.onStart();
    if (data.ended) {
      node.disconnect();
      node.port.close();
      callbacks.onEnd();
    }
  };
  node.connect(chain.input);
  const post = (message: object, transfer: Transferable[] = []) => {
    try {
      node.port.postMessage(message, transfer);
    } catch {
      // The player has already finished.
    }
  };
  return {
    push: (pcm) => post({ pcm }, [pcm.buffer as ArrayBuffer]),
    cut: (sample) => post({ cut: sample }),
    finish: () => post({ done: true }),
    stop: () => post({ stop: true }),
  };
}

export function pcmFromBase64(data: string) {
  const bytes = atob(data);
  const samples = new Float32Array(Math.floor(bytes.length / 2));
  for (let i = 0; i < samples.length; i++) {
    const low = bytes.charCodeAt(i * 2);
    const high = bytes.charCodeAt(i * 2 + 1);
    const value = (high << 8) | low;
    samples[i] = (value >= 0x8000 ? value - 0x10000 : value) / 32768;
  }
  return samples;
}
