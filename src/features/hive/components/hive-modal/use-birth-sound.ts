import { useCallback, useEffect, useRef } from "react";
import { ASSEMBLY_S } from "../../hive.data";
import { createAudioContext, saturation } from "./hive-modal.voice";

// How sharply the sound builds: higher stays quiet longer, then surges.
const SWELL_CURVE = 2.2;
const HORN_PEAK = 0.2;
const TICK_PITCHES = [620, 930, 1240, 1480];

// A slow crescendo from silence to `peak`, as a gain automation curve.
function swell(peak: number) {
  const curve = new Float32Array(96);
  for (let i = 0; i < curve.length; i++) {
    curve[i] = peak * Math.pow(i / (curve.length - 1), SWELL_CURVE);
  }
  return curve;
}

// The servo: a thin whine, chopped so it stutters like a stepper motor.
function addServo(ctx: AudioContext, out: AudioNode, t: number, cut: number) {
  const osc = ctx.createOscillator();
  const band = ctx.createBiquadFilter();
  const chop = ctx.createGain();
  const lfo = ctx.createOscillator();
  const depth = ctx.createGain();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(170, t + 0.3);
  osc.frequency.exponentialRampToValueAtTime(760, cut);
  band.type = "bandpass";
  band.Q.value = 7;
  band.frequency.setValueAtTime(420, t + 0.3);
  band.frequency.exponentialRampToValueAtTime(2300, cut);
  lfo.type = "square";
  lfo.frequency.setValueAtTime(9, t + 0.3);
  lfo.frequency.exponentialRampToValueAtTime(34, cut);
  chop.gain.value = 0.5;
  depth.gain.value = 0.5;
  lfo.connect(depth).connect(chop.gain);
  gain.gain.setValueAtTime(0.0001, t + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.05, cut - 0.1);
  gain.gain.linearRampToValueAtTime(0, cut);
  osc.connect(band).connect(chop).connect(gain).connect(out);
  osc.start(t + 0.3);
  lfo.start(t + 0.3);
  osc.stop(cut + 0.02);
  lfo.stop(cut + 0.02);
}

// Mechanical ticks that accelerate toward the finish, like parts locking in.
function addTicks(ctx: AudioContext, out: AudioNode, t: number, cut: number) {
  const first = t + 0.15;
  const span = cut - first;
  let at = first;
  let count = 0;
  while (at < cut - 0.02) {
    const p = (at - first) / span;
    const peak = 0.012 + p * p * 0.1;
    const pitch = TICK_PITCHES[count % TICK_PITCHES.length];
    for (const [ratio, level] of [
      [1, 1],
      [2.76, 0.45],
    ]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = pitch * ratio;
      gain.gain.setValueAtTime(peak * level, at);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
      osc.connect(gain).connect(out);
      osc.start(at);
      osc.stop(at + 0.05);
    }
    // Every fourth tick has a low clunk under it.
    if (count % 4 === 0) {
      const clunk = ctx.createOscillator();
      const gain = ctx.createGain();
      clunk.type = "sine";
      clunk.frequency.setValueAtTime(190, at);
      clunk.frequency.exponentialRampToValueAtTime(70, at + 0.07);
      gain.gain.setValueAtTime(peak * 1.5, at);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
      clunk.connect(gain).connect(out);
      clunk.start(at);
      clunk.stop(at + 0.1);
    }
    at += 0.045 + 0.215 * Math.pow(1 - p, 1.5);
    count += 1;
  }
}

// The horn runs through the whole assembly: distorted sawtooths and a sub,
// rising in pitch and opening up from a distant rumble to full force on the
// shockwave, then closing down.
function addHorn(ctx: AudioContext, out: AudioNode, t: number, finish: number) {
  const build = finish - t;
  const end = finish + 2.7;
  const shaper = ctx.createWaveShaper();
  shaper.curve = saturation(3);
  shaper.oversample = "2x";
  const low = ctx.createBiquadFilter();
  low.type = "lowpass";
  low.Q.value = 1.2;
  low.frequency.setValueAtTime(170, t);
  low.frequency.exponentialRampToValueAtTime(4200, finish);
  low.frequency.exponentialRampToValueAtTime(420, end);
  const gain = ctx.createGain();
  gain.gain.setValueCurveAtTime(swell(HORN_PEAK), t, build);
  gain.gain.setValueAtTime(HORN_PEAK, finish + 0.75);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  shaper.connect(low).connect(gain).connect(out);

  for (const freq of [55, 55.5, 82.6]) {
    const osc = ctx.createOscillator();
    const level = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq * 0.78, t);
    osc.frequency.exponentialRampToValueAtTime(freq, finish);
    level.gain.value = 0.42;
    osc.connect(level).connect(shaper);
    osc.start(t);
    osc.stop(end + 0.02);
  }

  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(32, t);
  sub.frequency.exponentialRampToValueAtTime(41, finish);
  subGain.gain.setValueCurveAtTime(swell(HORN_PEAK), t, build);
  subGain.gain.setValueAtTime(HORN_PEAK, finish + 0.2);
  subGain.gain.exponentialRampToValueAtTime(0.0001, end);
  sub.connect(subGain).connect(out);
  sub.start(t);
  sub.stop(end + 0.02);
}

// The assembly's sound, all synthesized: no audio files to download.
export default function useBirthSound(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const mutedRef = useRef(muted);
  const groupRef = useRef<GainNode | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.08);
    }
  }, [muted]);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  // Fades out and detaches whatever is playing (Skip, Replay).
  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const group = groupRef.current;
    if (!ctx || !group) return;
    group.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    window.setTimeout(() => group.disconnect(), 250);
    groupRef.current = null;
  }, []);

  const play = useCallback(() => {
    stop();
    if (mutedRef.current) return;
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = createAudioContext();
      if (!ctx) return;
      // Keeps the horn and the stacked ticks from clipping.
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -10;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.2;
      const master = ctx.createGain();
      master.connect(limiter).connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    void ctx.resume();
    const group = ctx.createGain();
    group.connect(masterRef.current!);
    groupRef.current = group;

    const t = ctx.currentTime + 0.02;
    const finish = t + ASSEMBLY_S;
    addHorn(ctx, group, t, finish);
    addServo(ctx, group, t, finish);
    addTicks(ctx, group, t, finish);
  }, [stop]);

  return { play, stop };
}
