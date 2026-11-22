import { THiveState } from "./hive.interface";

/* ── Launcher and HUD copy ───────────────────────────────────── */

export const HIVE_NAME = "Hive";
export const MODAL_ARIA = "Hive, the portfolio assistant";
export const EXIT_LABEL = "EXIT";
export const EXIT_ARIA = "Exit Hive";

export const HAND_BUTTON_LABELS = {
  idle: "Open hand gesture",
  loading: "Starting camera…",
  active: "Close hand gesture",
  denied: "Camera blocked",
  error: "Camera failed",
} as const;
export const HAND_ACTIVE_HINT = "pinch thumb + index to pulse the core";
export const HAND_PRIVACY_NOTE = "video stays on this device";
export const MIC_PRIVACY_NOTE =
  "mic audio is sent to a speech service, such as google, to turn it into text";
export const MIC_STARTING_TEXT = "opening mic…";

export const HIVE_STATES: THiveState[] = [
  "idle",
  "listening",
  "thinking",
  "speaking",
];
export const MIC_LABELS = { on: "🎙 MIC ON", off: "🎙 MIC OFF" } as const;
export const REPLAY_LABEL = "↻ REPLAY";
export const SKIP_LABEL = "⏭ SKIP";
export const STOP_LABEL = "■ STOP";
export const EFFECTS_LABELS = { on: "✦ FX ON", off: "✦ FX OFF" } as const;
export const LOADING_TEXT = "LOADING ARTWORK...";
export const TECH_LABEL = "technical details";
export const SOUND_LABELS = { on: "♪ SOUND ON", off: "♪ SOUND OFF" } as const;
export const INPUT_PLACEHOLDER = "ask hive about the work";
export const LISTENING_TEXT = "listening… go ahead and ask";
export const THINKING_TEXT = "thinking…";

/* ── Assistant ───────────────────────────────────────────────── */

export const ASSISTANT_ENDPOINT = "/api/hive";
export const TRANSCRIBE_ENDPOINT = "/api/hive/transcribe";
const GREETING_BODY =
  "I am Hive. Ahmed Hive helps founders turn ideas into real products, from the first sketch to launch. How may I assist you today?";

// Pre-recorded, so greeting a visitor never uses speech quota. Chosen from
// the visitor's own clock. "Good night" means goodbye, so late hours get a
// plain hello.
export const HIVE_GREETINGS = [
  {
    from: 5,
    to: 12,
    text: `Good morning. ${GREETING_BODY}`,
    audio: "/hive/hive-greeting-morning.mp3",
  },
  {
    from: 12,
    to: 17,
    text: `Good afternoon. ${GREETING_BODY}`,
    audio: "/hive/hive-greeting-afternoon.mp3",
  },
  {
    from: 17,
    to: 22,
    text: `Good evening. ${GREETING_BODY}`,
    audio: "/hive/hive-greeting-evening.mp3",
  },
] as const;
export const HIVE_LATE_GREETING = {
  text: `Hello. ${GREETING_BODY}`,
  audio: "/hive/hive-greeting-night.mp3",
} as const;

export function greetingFor(hour: number) {
  return (
    HIVE_GREETINGS.find((g) => hour >= g.from && hour < g.to) ??
    HIVE_LATE_GREETING
  );
}
// Lets the shockwave horn ring out before Hive speaks.
export const GREETING_DELAY_MS = 2400;
export const ASSISTANT_SUGGESTIONS = [
  "What do you do?",
  "Best project?",
  "How do we work together?",
] as const;
export const ASSISTANT_ERRORS = {
  not_configured: "my brain isn't plugged in yet. please use the contact page.",
  rate_limited: "too many questions too fast. give me a moment.",
  busy: "i'm a bit overloaded right now. try again shortly.",
  generic: "something went wrong. please try again.",
} as const;
export const MAX_QUESTION_LENGTH = 400;
export const MAX_HISTORY = 6;
export const SPEECH_LANG = "en-US";
// Spoken questions recorded for browsers without a speech engine.
export const RECORDING_RATE = 16_000;
export const MAX_RECORDING_S = 15;

// Speech recognition error codes, in words a visitor can act on.
export const MIC_ERRORS: Record<string, string> = {
  "not-allowed":
    "microphone access is blocked. allow it from the icon in your address bar, or type instead.",
  "service-not-allowed":
    "speech recognition is off in this browser. on safari, turn on dictation in system settings, or type instead.",
  "service-blocked":
    "this browser blocks voice input even with the mic allowed. please type instead.",
  "no-engine": "voice input isn't available in this browser. please type.",
  "audio-capture":
    "no microphone found. check it's connected, or type instead.",
  "in-use":
    "your microphone is busy in another app. close it there and try again.",
  network: "this browser can't reach its speech service. please type.",
  "no-speech": "i didn't catch anything. tap mic and try again.",
  "language-not-supported": "voice input isn't available here. please type.",
};
export const MIC_ERROR_FALLBACK =
  "voice input didn't start. please type instead.";

// Hive's main voice is generated on the server (ask-hive/ask-hive.speech.ts). These
// are the fallback when that isn't available: the visitor's own browser
// voices, which differ per device. The first name found wins (matched as a
// prefix), favouring deep British male voices.
export const VOICE_PREFERENCES = [
  "Google UK English Male",
  "Microsoft Ryan Online (Natural)",
  "Daniel",
  "Microsoft George",
  "Microsoft Guy Online (Natural)",
  "Google US English",
] as const;
// 0.1 to 10, 1 is normal speed.
export const VOICE_RATE = 0.96;
// 0 to 2, 1 is the voice's normal pitch.
export const VOICE_PITCH = 0.86;

/* ── Hand tracking (MediaPipe, loaded only on opt-in) ────────── */

export const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm";
export const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
export const LM_WRIST = 0;
export const LM_THUMB_TIP = 4;
export const LM_INDEX_TIP = 8;
export const LM_MIDDLE_MCP = 9;
export const PINCH_ON_RATIO = 0.3;
export const PINCH_OFF_RATIO = 0.45;
export const HAND_RANGE_MIN = 0.15;
export const HAND_RANGE_MAX = 0.85;
export const HAND_SMOOTHING = 0.35;

/* ── Scene ───────────────────────────────────────────────────── */

// The approved artwork. The six figure images share one framing.
export const HIVE_ART = {
  idle: "/hive/hive-idle.webp",
  listening: "/hive/hive-listening.webp",
  thinking: "/hive/hive-thinking.webp",
  speaking: "/hive/hive-speaking.webp",
  early: "/hive/hive-assembly-early.webp",
  late: "/hive/hive-assembly-late.webp",
  backdrop: "/hive/hive-backdrop.webp",
  // The figure's silhouette, which hides the world behind the body.
  mask: "/hive/hive-mask.webp",
} as const;

// Image-space landmarks (0..1, y up).
export const ART_FACE = { x: 0.497, y: 0.635 };
export const ART_SOURCE = { x: 0.5, y: 0.02 };
// The head's width as a share of the artwork, plus a little margin.
export const ART_HEAD_WIDTH = 0.42;
// The head as a rounded form in image space; rz is its depth toward you.
export const ART_HEAD = { x: 0.497, y: 0.655, rx: 0.19, ry: 0.275, rz: 0.13 };
// How far the head turns, in radians. It tears if pushed much further.
export const HEAD_MAX_YAW = 0.36;
export const HEAD_MAX_PITCH = 0.1;

// Source pixels per particle tile. Lower is denser and heavier.
export const TILE_CELL_DESKTOP = 2;
export const TILE_CELL_MOBILE = 4;
// Cells darker than this (0-255) are background and get no particle.
export const TILE_MIN_LEVEL = 11;
// The mountains are particles too, a little coarser: the tiles still show
// full-resolution artwork at rest.
export const WORLD_CELL_DESKTOP = 3;
export const WORLD_CELL_MOBILE = 5;
export const WORLD_MIN_LEVEL = 7;
export const MOBILE_MAX_WIDTH = 768;
export const MAX_PIXEL_RATIO = 2;

// Seconds for the figure to build, and for a mood to bloom from the face.
export const ASSEMBLY_S = 6;
export const BLOOM_S = 1;
// The ring that spreads from the face when the figure completes.
export const WAVE_S = 2.5;
// The chest's slow swell: seconds per breath, and how far it expands.
export const BREATH_S = 5.2;
export const BREATH_AMOUNT = 0.007;
