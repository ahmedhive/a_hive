// The reference scrubs one timeline over the quote: it starts when the
// section's top reaches 70% of the viewport and lasts about the section's own
// height of scrolling (measured, not stated by the reference). Each line's
// cover then slides off to the right, one line after another, each taking just
// over one step so neighbours overlap a little.
export const QUOTE_SCROLL_START = "top 70%";
export const QUOTE_SCROLL_DISTANCE_RATIO = 1.03;
export const QUOTE_LINE_STEP = 1;
export const QUOTE_LINE_DURATION = 1.04;
export const QUOTE_EASE = "none";
