"use client";

import { Share_Tech_Mono } from "next/font/google";
import { FormEvent, useEffect, useRef, useState } from "react";
import { cn, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import {
  ASSISTANT_SUGGESTIONS,
  EXIT_ARIA,
  EFFECTS_LABELS,
  EXIT_LABEL,
  GREETING_DELAY_MS,
  HAND_ACTIVE_HINT,
  HAND_BUTTON_LABELS,
  HAND_PRIVACY_NOTE,
  HIVE_NAME,
  HIVE_STATES,
  INPUT_PLACEHOLDER,
  LISTENING_TEXT,
  LOADING_TEXT,
  MAX_QUESTION_LENGTH,
  MIC_LABELS,
  MIC_PRIVACY_NOTE,
  MIC_STARTING_TEXT,
  MODAL_ARIA,
  REPLAY_LABEL,
  SKIP_LABEL,
  SOUND_LABELS,
  STOP_LABEL,
  TECH_LABEL,
  THINKING_TEXT,
} from "../../hive.data";
import { IHiveInput, THiveState } from "../../hive.interface";
import useAssistant from "./use-assistant";
import useBirthSound from "./use-birth-sound";
import useHandTracking from "./use-hand-tracking";
import useHeartbeat from "./use-heartbeat";
import useHiveScene from "./use-hive-scene";
import { SpokenSubtitle } from "./hive-modal.subtitle";
import {
  HUD_BUTTON,
  HUD_CAPTION,
  HUD_INPUT,
  HUD_PILL,
  HUD_PILL_ACTIVE,
  HUD_ROW,
  HUD_ROW_INNER,
  LOCKED_PLACEHOLDER,
  NO_WEBGL_TEXT,
} from "./hive-modal.data";
import { IHiveModalProps } from "./hive-modal.interface";

// Only this lazily loaded chunk uses the font, so it isn't preloaded on
// every page.
const mono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const FOCUSABLE = "button:not([disabled]), input:not([disabled])";

export default function HiveModal(props: IHiveModalProps) {
  const { onClose } = props;
  const dialogRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const skippedRef = useRef(false);
  const inputRef = useRef<IHiveInput>({
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    handX: 0,
    handY: 0,
    handActive: false,
    pinching: false,
    visible: true,
    state: "idle",
    replay: 0,
    skip: 0,
    tap: 0,
    effects: true,
    voiceLevel: -1,
  });

  const [soundOn, setSoundOn] = useState(true);
  // Reduced motion starts on the plain artwork.
  const [effects, setEffects] = useState(() => !prefersReducedMotion());
  // A state picked from the pills, shown until the assistant does something.
  const [preview, setPreview] = useState<THiveState>("idle");
  const [draft, setDraft] = useState("");

  const assistant = useAssistant(!soundOn, inputRef);
  const hand = useHandTracking(inputRef);
  const { canvasRef, handRingRef, progress, ready, failed, stats } =
    useHiveScene(inputRef);
  const birth = useBirthSound(!soundOn);

  const state = assistant.status !== "idle" ? assistant.status : preview;
  const assembling = ready && effects && progress < 100;
  // While the scene builds, the conversation controls wait and the subtitle
  // stays out of the way. Exit, Skip, FX and Sound always work.
  const locked = !failed && (!ready || assembling);
  const busy = assistant.status === "thinking";
  const listening = assistant.status === "listening";
  // Held back during the assembly, so it never muddies the horn.
  useHeartbeat(
    inputRef,
    soundOn && effects && ready && !assembling,
    assistant.status === "speaking",
  );

  // Before the scene's first frame, so it starts in the right mode.
  useIsomorphicLayoutEffect(() => {
    inputRef.current.state = state;
    inputRef.current.effects = effects;
  }, [state, effects]);

  // The sound starts with the assembly, once the artwork has loaded.
  useEffect(() => {
    if (ready && inputRef.current.effects) birth.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    exitRef.current?.focus();
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = overflow;
    };
  }, []);

  // Hive greets the visitor once it's ready: after the horn has rung out, or
  // straight away if the assembly was skipped or effects are off.
  const { playGreeting } = assistant;
  useEffect(() => {
    if (!ready || assembling) return;
    const wait =
      skippedRef.current || !inputRef.current.effects ? 250 : GREETING_DELAY_MS;
    skippedRef.current = false;
    const id = window.setTimeout(() => void playGreeting(), wait);
    return () => window.clearTimeout(id);
  }, [ready, assembling, playGreeting]);

  // Escape closes; Tab stays inside the dialog. On the document, because
  // clicking the scene or disabling a focused button moves focus to the body.
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  const askQuestion = (text: string) => {
    setPreview("idle");
    void assistant.ask(text);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    askQuestion(draft);
    setDraft("");
  };

  const toggleMic = () => {
    setPreview("idle");
    void assistant.toggleListen();
  };

  const replay = () => {
    if (!effects) return;
    assistant.rearmGreeting();
    inputRef.current.replay += 1;
    birth.play();
  };

  const skip = () => {
    skippedRef.current = true;
    inputRef.current.skip += 1;
    birth.stop();
  };

  const toggleEffects = () => {
    if (effects) birth.stop();
    setEffects((on) => !on);
  };

  const listeningText = assistant.micStarting
    ? MIC_STARTING_TEXT
    : LISTENING_TEXT;

  let caption = "";
  if (!locked) {
    if (assistant.error) caption = assistant.error;
    else if (listening) caption = listeningText;
    else if (busy) caption = THINKING_TEXT;
    else if (assistant.replyVisible) caption = assistant.reply;
  }

  // While Hive speaks, its reply appears a phrase at a time with the voice.
  const spoken =
    !!caption && caption === assistant.reply && assistant.status === "speaking";

  let placeholder = INPUT_PLACEHOLDER;
  if (locked) placeholder = LOCKED_PLACEHOLDER;
  else if (listening) placeholder = listeningText;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={MODAL_ARIA}
      data-lenis-prevent
      data-bg-luma="dark"
      className={cn(
        mono.className,
        "fixed inset-0 z-200 overflow-hidden bg-black text-[#19ddff] motion-safe:animate-[hive-fade_0.5s_ease-out]",
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 size-full touch-none"
      />
      <div
        ref={handRingRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 size-10 rounded-full border-2 border-rose opacity-0 shadow-[0_0_18px_rgba(212,140,158,0.65)] transition-[opacity,scale]"
      />

      {stats && (
        <details className="absolute right-[18px] bottom-[10px] text-[10px] text-[#9fd8e8]/70 max-lg:hidden">
          <summary className="cursor-pointer">{TECH_LABEL}</summary>
          <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-3">
            <dt>particles</dt>
            <dd>{stats.particles.toLocaleString("en-US")}</dd>
            <dt>grid</dt>
            <dd>{stats.grid}</dd>
            <dt>pixel ratio</dt>
            <dd>{stats.pixelRatio}</dd>
            <dt>tile px</dt>
            <dd>{stats.tilePx}</dd>
          </dl>
        </details>
      )}

      {failed && (
        <p className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-sm text-[#9fd8e8]">
          {NO_WEBGL_TEXT}
        </p>
      )}

      <div className="absolute top-[18px] left-[18px] flex flex-col items-start gap-2">
        <div className="flex gap-2.5">
          <button
            ref={exitRef}
            type="button"
            onClick={onClose}
            aria-label={EXIT_ARIA}
            className={cn(HUD_BUTTON, "tracking-[0.08em]")}
          >
            {EXIT_LABEL}
          </button>
          <button
            type="button"
            onClick={hand.toggle}
            aria-pressed={hand.status === "active"}
            disabled={hand.status === "loading"}
            className={cn(HUD_BUTTON, "max-md:hidden")}
          >
            {HAND_BUTTON_LABELS[hand.status]}
          </button>
        </div>
        <p className="text-[10px] tracking-[0.12em] text-[#19ddff]/55 max-md:hidden">
          {hand.status === "active" ? HAND_ACTIVE_HINT : HAND_PRIVACY_NOTE}
        </p>
      </div>

      <p className="absolute top-[21%] left-[72%] text-[9.45px] tracking-[0.16em] whitespace-nowrap uppercase max-md:top-8 max-md:right-[18px] max-md:left-auto">
        {!ready && !failed
          ? LOADING_TEXT
          : assembling
            ? `ASSEMBLING... ${progress}%`
            : `STATUS: ${state.toUpperCase()}`}
      </p>

      <div className="absolute inset-x-3 bottom-[10px] mx-auto flex max-w-[780px] flex-col items-center gap-2.5">
        <p
          aria-live="polite"
          className={cn(
            HUD_CAPTION,
            "max-w-[560px] rounded-md text-center",
            caption && "bg-[rgba(0,10,14,0.82)] px-3 py-1",
          )}
        >
          <span className="sr-only">{HIVE_NAME}: </span>
          {spoken ? (
            <>
              <SpokenSubtitle
                key={assistant.reply}
                text={assistant.reply}
                progress={assistant.speechProgress}
              />
              <span className="sr-only">{assistant.reply}</span>
            </>
          ) : (
            caption
          )}
          {!locked && !caption && !busy && !listening && (
            // Spoken aloud, so hidden on screen but still announced.
            <span className="sr-only">{assistant.reply}</span>
          )}
        </p>

        {!assistant.asked && (
          <div className={HUD_ROW}>
            <div className={HUD_ROW_INNER}>
              {ASSISTANT_SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={busy || locked}
                  onClick={() => askQuestion(q)}
                  className={cn(HUD_PILL, "shrink-0 whitespace-nowrap")}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={submit} className="flex w-full max-w-[560px] gap-1.5">
          <label htmlFor="hive-question" className="sr-only">
            Ask {HIVE_NAME} a question
          </label>
          <input
            id="hive-question"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MAX_QUESTION_LENGTH}
            placeholder={placeholder}
            autoComplete="off"
            disabled={locked}
            className={HUD_INPUT}
          />
          <button
            type="submit"
            disabled={busy || locked || !draft.trim()}
            aria-label="Send question"
            className={cn(HUD_PILL, "h-9 px-3.5")}
          >
            ↵
          </button>
        </form>

        <div className={HUD_ROW}>
          <div className={cn(HUD_ROW_INNER, "*:shrink-0 *:whitespace-nowrap")}>
            {HIVE_STATES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreview(s)}
                disabled={locked}
                aria-pressed={state === s}
                aria-label={`Preview ${s} state`}
                className={cn(
                  HUD_PILL,
                  state === s && !locked && HUD_PILL_ACTIVE,
                )}
              >
                {s}
              </button>
            ))}
            {assistant.canListen && (
              <button
                type="button"
                onClick={toggleMic}
                // Stays usable if it's already listening, so it can be stopped.
                disabled={busy || (locked && !listening)}
                aria-pressed={listening}
                aria-describedby="hive-mic-note"
                className={cn(HUD_PILL, listening && HUD_PILL_ACTIVE)}
              >
                {listening ? MIC_LABELS.on : MIC_LABELS.off}
              </button>
            )}
            {(busy || assistant.status === "speaking") && (
              <button
                type="button"
                onClick={assistant.stopReply}
                className={HUD_PILL}
              >
                {STOP_LABEL}
              </button>
            )}
            {/* One button, so keyboard focus survives the Replay/Skip swap. */}
            <button
              type="button"
              onClick={assembling ? skip : replay}
              disabled={!ready || !effects}
              className={HUD_PILL}
            >
              {assembling ? SKIP_LABEL : REPLAY_LABEL}
            </button>
            <button
              type="button"
              onClick={toggleEffects}
              aria-pressed={effects}
              className={HUD_PILL}
            >
              {effects ? EFFECTS_LABELS.on : EFFECTS_LABELS.off}
            </button>
            <button
              type="button"
              onClick={() => setSoundOn((on) => !on)}
              aria-pressed={soundOn}
              className={HUD_PILL}
            >
              {soundOn ? SOUND_LABELS.on : SOUND_LABELS.off}
            </button>
          </div>
        </div>

        {assistant.canListen && (
          <p
            id="hive-mic-note"
            className="text-center text-[10px] leading-3.5 tracking-[0.04em] text-[#9fd8e8]/70"
          >
            {MIC_PRIVACY_NOTE}
          </p>
        )}
      </div>
    </div>
  );
}
