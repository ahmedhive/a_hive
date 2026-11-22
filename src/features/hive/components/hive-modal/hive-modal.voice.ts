// Hive's machine voice: the generated speech run through a small effects rack.
export const VOICE = {
  // Lowers the voice, in cents (100 = one semitone). Also slows it slightly.
  detune: -110,
  // The untouched signal. Keeps every word clear.
  dry: 0.5,
  // The vocoder: the words re-sung by a fixed-pitch synth. The robot sound.
  vocoder: 0.7,
  vocoderLift: 9,
  vocoderNoise: 0.16,
  // Ring modulation: the classic synthetic "machine" edge.
  ring: 0.34,
  ringHz: 88,
  // Two tuned short echoes that make the voice ring like a metal chamber.
  metal: 0.42,
  // A second, slowly drifting copy, for the layered AI sound.
  double: 0.3,
  // A short, hard reflection, like speaking inside a suit or a console.
  room: 0.14,
  // Gentle saturation that glues the layers together.
  drive: 1.5,
  output: 0.82,
};

const VOCODER_HZ = 73.4;

export interface IVoiceChain {
  ctx: AudioContext;
  input: AudioNode;
  analyser: AnalyserNode;
}

export function createAudioContext() {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  return Ctor ? new Ctor() : null;
}

// Loads an AudioWorklet from source text, with no separate file to serve.
export function addWorklet(ctx: AudioContext, source: string) {
  const url = URL.createObjectURL(
    new Blob([source], { type: "text/javascript" }),
  );
  return ctx.audioWorklet.addModule(url).finally(() => {
    URL.revokeObjectURL(url);
  });
}

export function rmsLevel(samples: Float32Array) {
  let sum = 0;
  for (const v of samples) sum += v * v;
  return Math.sqrt(sum / samples.length);
}

export function saturation(amount: number) {
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * amount) / Math.tanh(amount);
  }
  return curve;
}

// A half-second burst of decaying noise, used as a tight metallic room.
function roomImpulse(ctx: AudioContext) {
  const length = Math.floor(ctx.sampleRate * 0.5);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 5);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return buffer;
}

function addComb(
  ctx: AudioContext,
  from: AudioNode,
  to: AudioNode,
  seconds: number,
  feedbackLevel: number,
  wetLevel: number,
) {
  const delay = ctx.createDelay(0.05);
  delay.delayTime.value = seconds;
  const feedback = ctx.createGain();
  feedback.gain.value = feedbackLevel;
  const wet = ctx.createGain();
  wet.gain.value = wetLevel;
  from.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(to);
}

// A channel vocoder: each band of the voice controls the volume of the same
// band of a steady synth tone, so the synth "speaks" the words.
function addVocoder(ctx: AudioContext, from: AudioNode, to: AudioNode) {
  const carrier = ctx.createGain();
  for (const [ratio, level] of [
    [1, 0.5],
    [1.006, 0.5],
    [2, 0.28],
  ]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = VOCODER_HZ * ratio;
    gain.gain.value = level;
    osc.connect(gain).connect(carrier);
    osc.start();
  }
  // A little noise so s, t and k still come through.
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = VOICE.vocoderNoise;
  noise.connect(noiseGain).connect(carrier);
  noise.start();

  const rectifier = new Float32Array(1025);
  for (let i = 0; i < rectifier.length; i++) {
    rectifier[i] = Math.abs(i / 512 - 1);
  }
  const output = ctx.createGain();
  output.gain.value = VOICE.vocoder;
  output.connect(to);

  const bands = 16;
  for (let b = 0; b < bands; b++) {
    const freq = 150 * Math.pow(5600 / 150, b / (bands - 1));
    // Follows how loud this band of the voice is.
    const listen = ctx.createBiquadFilter();
    listen.type = "bandpass";
    listen.frequency.value = freq;
    listen.Q.value = 6;
    const rectify = ctx.createWaveShaper();
    rectify.curve = rectifier;
    const follow = ctx.createBiquadFilter();
    follow.type = "lowpass";
    follow.frequency.value = 45;
    const boost = ctx.createGain();
    // Band envelopes are tiny, so they need a big lift to open the synth.
    boost.gain.value = VOICE.vocoderLift;
    // Opens the matching band of the synth by that amount.
    const synth = ctx.createBiquadFilter();
    synth.type = "bandpass";
    synth.frequency.value = freq;
    synth.Q.value = 6;
    const amp = ctx.createGain();
    amp.gain.value = 0;
    from.connect(listen).connect(rectify).connect(follow).connect(boost);
    boost.connect(amp.gain);
    carrier.connect(synth).connect(amp).connect(output);
  }
}

export function buildVoiceChain(): IVoiceChain | null {
  const ctx = createAudioContext();
  if (!ctx) return null;

  // Shape: thin out the rumble, add chest and a crisp, forward presence.
  const high = ctx.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 90;
  const body = ctx.createBiquadFilter();
  body.type = "lowshelf";
  body.frequency.value = 210;
  body.gain.value = 4;
  const boxy = ctx.createBiquadFilter();
  boxy.type = "peaking";
  boxy.frequency.value = 620;
  boxy.Q.value = 1;
  boxy.gain.value = -2.5;
  const presence = ctx.createBiquadFilter();
  presence.type = "peaking";
  presence.frequency.value = 2600;
  presence.Q.value = 0.8;
  presence.gain.value = 4.5;
  high.connect(body).connect(boxy).connect(presence);

  const mix = ctx.createGain();
  const dry = ctx.createGain();
  dry.gain.value = VOICE.dry;
  presence.connect(dry).connect(mix);

  // Ring modulator: an oscillator drives the gain of a copy of the voice.
  const ringAmp = ctx.createGain();
  ringAmp.gain.value = 0;
  const ringOsc = ctx.createOscillator();
  ringOsc.type = "sine";
  ringOsc.frequency.value = VOICE.ringHz;
  ringOsc.connect(ringAmp.gain);
  ringOsc.start();
  const ringWet = ctx.createGain();
  ringWet.gain.value = VOICE.ring;
  presence.connect(ringAmp).connect(ringWet).connect(mix);

  addVocoder(ctx, presence, mix);

  addComb(ctx, presence, mix, 0.0046, 0.56, VOICE.metal);
  addComb(ctx, presence, mix, 0.0073, 0.44, VOICE.metal * 0.65);

  // The drifting double: a short delay whose time slowly wanders.
  const doubler = ctx.createDelay(0.05);
  doubler.delayTime.value = 0.015;
  const drift = ctx.createOscillator();
  drift.frequency.value = 0.37;
  const driftDepth = ctx.createGain();
  driftDepth.gain.value = 0.0016;
  drift.connect(driftDepth).connect(doubler.delayTime);
  drift.start();
  const doubleWet = ctx.createGain();
  doubleWet.gain.value = VOICE.double;
  presence.connect(doubler).connect(doubleWet).connect(mix);

  const room = ctx.createConvolver();
  room.buffer = roomImpulse(ctx);
  const roomTone = ctx.createBiquadFilter();
  roomTone.type = "bandpass";
  roomTone.frequency.value = 1500;
  roomTone.Q.value = 0.7;
  const roomWet = ctx.createGain();
  roomWet.gain.value = VOICE.room;
  presence.connect(room).connect(roomTone).connect(roomWet).connect(mix);

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -22;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.14;
  const shaper = ctx.createWaveShaper();
  shaper.curve = saturation(VOICE.drive);
  shaper.oversample = "2x";
  const air = ctx.createBiquadFilter();
  air.type = "lowpass";
  air.frequency.value = 7200;
  mix.connect(shaper).connect(air).connect(compressor);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  const output = ctx.createGain();
  output.gain.value = VOICE.output;
  compressor.connect(output).connect(analyser);
  analyser.connect(ctx.destination);

  return { ctx, input: high, analyser };
}
