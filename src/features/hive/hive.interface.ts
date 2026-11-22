export type THiveState = "idle" | "listening" | "thinking" | "speaking";
export type THandStatus = "idle" | "loading" | "active" | "denied" | "error";

// Mutable input the render loop reads every frame. Pointer values are canvas
// CSS pixels; hand values are 0..1 of the canvas (already mirrored).
export interface IHiveInput {
  pointerX: number;
  pointerY: number;
  pointerActive: boolean;
  handX: number;
  handY: number;
  handActive: boolean;
  pinching: boolean;
  visible: boolean;
  state: THiveState;
  // Bumped to restart the assembly animation (REPLAY).
  replay: number;
  // Bumped to jump straight to the finished figure (SKIP).
  skip: number;
  // Bumped on a tap, for a ripple from the core.
  tap: number;
  // False shows the plain artwork: no motion, highlights or assembly.
  effects: boolean;
  // Measured loudness of Hive's voice (0..1), or -1 when it can't be measured.
  voiceLevel: number;
}

export interface IHiveStats {
  particles: number;
  grid: number;
  pixelRatio: number;
  tilePx: number;
}

export interface IChatMessage {
  role: "user" | "assistant";
  text: string;
}

export type TSpeechEvent =
  { t: "audio"; rate: number; pcm: string } | { t: "cut"; sample: number };

// What /api/hive streams, one JSON event per line.
export type THiveStreamEvent =
  { t: "reply"; text: string } | TSpeechEvent | { t: "end"; audio: boolean };

// The slice of the Web Speech recognition API used here; it isn't in the
// TypeScript DOM lib under its prefixed name.
export interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
