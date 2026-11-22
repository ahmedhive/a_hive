import { RefObject, useEffect, useRef } from "react";
import { IHiveInput } from "../../hive.interface";
import { createAudioContext } from "./hive-modal.voice";

// One "lub-dub" every 0.86s, about 70 beats a minute.
const BEAT_PERIOD_S = 0.86;
const DUB_DELAY_S = 0.26;
// A quick re-pinch answers at once, but never stacks on the last beat.
const MIN_GAP_S = 0.5;
const POLL_MS = 40;
// Sits under Hive's voice while it's talking.
const LEVEL = 1;
const LEVEL_UNDER_VOICE = 0.45;

function addThump(
  ctx: AudioContext,
  out: AudioNode,
  at: number,
  startHz: number,
  endHz: number,
  peak: number,
  length: number,
) {
  // The body of the beat, plus a soft overtone so that laptop and phone
  // speakers, which can't reproduce deep bass, still carry it.
  for (const [ratio, level] of [
    [1, 1],
    [2.1, 0.38],
  ]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(startHz * ratio, at);
    osc.frequency.exponentialRampToValueAtTime(endHz * ratio, at + length);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak * level, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    osc.connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + length + 0.01);
  }
}

function addBeat(ctx: AudioContext, out: AudioNode, at: number) {
  addThump(ctx, out, at, 74, 42, 0.62, 0.19);
  addThump(ctx, out, at + DUB_DELAY_S, 92, 50, 0.42, 0.14);
}

// A synthesized heartbeat that plays for as long as the fingers are pinched.
export default function useHeartbeat(
  inputRef: RefObject<IHiveInput>,
  enabled: boolean,
  underVoice: boolean,
) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const levelRef = useRef(LEVEL);

  useEffect(() => {
    levelRef.current = underVoice ? LEVEL_UNDER_VOICE : LEVEL;
    const ctx = ctxRef.current;
    if (ctx && masterRef.current) {
      masterRef.current.gain.setTargetAtTime(
        levelRef.current,
        ctx.currentTime,
        0.08,
      );
    }
  }, [underVoice]);

  useEffect(() => {
    if (!enabled) return;
    const input = inputRef.current;
    const running = ctxRef.current;
    if (running && masterRef.current) {
      masterRef.current.gain.setTargetAtTime(
        levelRef.current,
        running.currentTime,
        0.02,
      );
    }

    let wasPinching = false;
    let nextBeat = 0;
    let lastBeat = -Infinity;

    const id = window.setInterval(() => {
      const pinching = input.pinching;
      if (pinching) {
        let ctx = ctxRef.current;
        if (!ctx) {
          ctx = createAudioContext();
          if (!ctx) return;
          const tone = ctx.createBiquadFilter();
          tone.type = "lowpass";
          tone.frequency.value = 320;
          const limiter = ctx.createDynamicsCompressor();
          limiter.threshold.value = -8;
          limiter.ratio.value = 10;
          const master = ctx.createGain();
          master.gain.value = levelRef.current;
          master.connect(tone).connect(limiter).connect(ctx.destination);
          ctxRef.current = ctx;
          masterRef.current = master;
        }
        void ctx.resume().catch(() => {});
        const now = ctx.currentTime;
        if (!wasPinching) nextBeat = Math.max(now + 0.01, lastBeat + MIN_GAP_S);
        if (nextBeat <= now + 0.12 && masterRef.current) {
          const at = Math.max(nextBeat, now + 0.01);
          addBeat(ctx, masterRef.current, at);
          lastBeat = at;
          nextBeat = at + BEAT_PERIOD_S;
        }
      }
      wasPinching = pinching;
    }, POLL_MS);

    return () => {
      window.clearInterval(id);
      // Sound off, FX off or a replay cuts any beat already queued.
      const ctx = ctxRef.current;
      if (ctx && masterRef.current) {
        masterRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
      }
    };
  }, [enabled, inputRef]);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
      masterRef.current = null;
    },
    [],
  );
}
