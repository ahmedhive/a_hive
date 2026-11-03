export const INTRO_VIDEO_SRC = "/videos/services-vid.mp4";
export const INTRO_VIDEO_POSTER = "/videos/services-poster.jpg";
export const INTRO_VIDEO_LABEL = "Working session";

// Full width and edge to edge: a wide strip from `md` up, 3:2 below. The
// strip crops the 16:9 footage, so the crop is pinned a little above centre to
// keep heads in frame.
export const INTRO_VIDEO_CLASS = "aspect-3/2 md:aspect-192/65";
export const INTRO_VIDEO_FOOTAGE_CLASS = "object-[center_35%]";
export const INTRO_VIDEO_BUTTON_CLASS = "right-5 bottom-5";

// Desktop only (`lg`+): the video grows in as the page scrolls, scrubbed with
// 1.2s of lag. It starts tiny (scale 0.1), transparent and a full height above
// its slot, slides down into the slot while fading in (1 unit), then scales up
// to full width (0.8 units, after a 0.05 gap). Below `lg` it is just a block.
// Must equal the `lg:` breakpoint: matchMedia can't read it from the classes.
export const INTRO_VIDEO_GROW_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const INTRO_VIDEO_SCRUB_S = 1.2;
export const INTRO_VIDEO_EASE = "none";
export const INTRO_VIDEO_FROM_SCALE = 0.1;
export const INTRO_VIDEO_FROM_Y_PERCENT = -100;
export const INTRO_VIDEO_SLIDE_DURATION = 1;
export const INTRO_VIDEO_GROW_START = 1.05;
export const INTRO_VIDEO_GROW_DURATION = 0.8;
// Growth starts as soon as the section is in reach (clamped to the top of the
// page) and ends when the section's top reaches this far down the screen: just
// under half its own height plus a tenth of the viewport. That is where the
// reference's shrunken box lands its bottom edge 10% from the top.
export const INTRO_VIDEO_SCROLL_START = "clamp(top bottom)";
export const INTRO_VIDEO_END_HEIGHT_RATIO = 0.45;
export const INTRO_VIDEO_END_VIEWPORT_RATIO = 0.1;
