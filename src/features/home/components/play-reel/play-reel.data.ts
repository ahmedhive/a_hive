export const REEL_LABEL = "Play reel";
export const REEL_WORDS = ["Play", "Reel"] as const;

// The reel and its poster frame, served from public/videos because Turbopack
// can't import .mp4 files. Replace both files to change the reel.
export const REEL_VIDEO_SRC = "/videos/play-reel-vid.mp4";
export const REEL_POSTER_SRC = "/videos/play-reel-poster.jpg";

// The pinned, scroll-driven layout only exists from 1024px up with motion
// allowed (the reference drops it just below). Must equal the
// `motion-safe:lg:` classes in index.tsx: matchMedia can't read the
// breakpoint from them.
export const REEL_SCROLL_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

// The reference's scroll timeline runs on a 250vh track and plays from
// 32% to 60% of the track's travel through the viewport, which works out to
// its top sitting 12vh above the viewport top until 110vh above it.
export const REEL_SCROLL_START = "top top-=12%";
export const REEL_SCROLL_END = "top top-=110%";
export const REEL_SCRUB_S = 0.9;

// The video box grows from a framed 50vw x 40vh to full screen as its
// corners square off; the words fade in over the first part of the growth
// (the reference's 32%-42% keyframes) while closing in from the screen
// edges to 34vw from each side.
export const REEL_BOX_FROM = { width: "50vw", height: "40vh", radius: 40 };
export const REEL_BOX_TO = { width: "100vw", height: "100vh", radius: 0 };
export const REEL_WORD_OFFSET_VW = 34;
export const REEL_WORD_FADE_FRACTION = 10 / 28;
