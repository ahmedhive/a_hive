export const TICKER_WORDS = ["Strategy", "Design", "Build"];

// Identical groups side by side: each slides left by exactly its own width,
// which lands the row back on a frame identical to the start, so the loop has
// no seam. All but the first must still cover the viewport mid-slide, which
// four groups do up to roughly 3500px wide.
export const TICKER_GROUP_COUNT = 4;
export const TICKER_GROUPS = Array.from({ length: TICKER_GROUP_COUNT });

// One slide (and one full turn of every star) takes this long, at any width,
// as in the reference: the speed in px/s scales with the row's width.
export const TICKER_LOOP_DURATION_S = 15;
export const TICKER_EASE = "none";
