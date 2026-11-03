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

// The band of shrinking lines under the strip (the reference's `.border`):
// 12px down to 3px with 4px gaps, thinner below 1024px and 768px. The
// component's inline heights can't express that, so these classes override
// the heights per breakpoint.
export const TICKER_LINE_HEIGHTS_PX = [12, 9, 6, 4, 3];
export const TICKER_LINE_GAP_PX = 4;
export const TICKER_LINE_RESPONSIVE_HEIGHTS =
  "max-lg:[&>:nth-child(1)]:h-2! max-lg:[&>:nth-child(2)]:h-1.5! max-md:[&>:nth-child(1)]:h-1.25! max-md:[&>:nth-child(2)]:h-1! max-md:[&>:nth-child(3)]:h-0.75! max-md:[&>:nth-child(4)]:h-0.5! max-md:[&>:nth-child(5)]:h-px!";
