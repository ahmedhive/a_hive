import { TCursorShape } from "./custom-cursor.interface";

export const DOT_FOLLOW_DURATION_S = 0.12;
export const DOT_FOLLOW_EASE = "power3.out";

export const RING_FOLLOW_DURATION_S = 0.5;
export const RING_FOLLOW_EASE = "power3.out";

export const LIGHT_LUMA_THRESHOLD = 150;
export const LUMA_SAMPLE_EVERY_N_MOVES = 4;

export const SHAPE_ATTRIBUTE = "data-cursor-shape";
export const SHAPE_MORPH_DURATION_S = 0.25;
export const SHAPE_MORPH_EASE = "power2.out";

export const CURSOR_SHAPES: readonly TCursorShape[] = [
  "circle",
  "square",
  "diamond",
];

// Interactive elements override the current section's shape while hovered:
// links read as flat/navigational (square), buttons as an action (diamond).
export const HOVER_SELECTOR = "a, button";
export const HOVER_TAG_SHAPES: Record<string, TCursorShape> = {
  A: "square",
  BUTTON: "diamond",
};
export const HOVER_RING_SCALE = 1.5;

export const SHAPE_STYLES: Record<
  TCursorShape,
  { borderRadius: string; rotate: number }
> = {
  circle: { borderRadius: "50%", rotate: 0 },
  square: { borderRadius: "24%", rotate: 0 },
  diamond: { borderRadius: "24%", rotate: 45 },
};
