import { WHATSAPP_LINK } from "@/constants";

export const ABOUT_CAPTION_PREFIX = "Currently ";
export const ABOUT_CAPTION_EMPHASIS = "(Taking)";
export const ABOUT_CAPTION_SUFFIX = " New Projects";

export const ABOUT_TITLE =
  "IF YOU HAVE A PRODUCT THAT NEEDS A ROADMAP AND SOMEONE TO DESIGN IT, LET'S TALK";
export const ABOUT_CTA_LABEL = "WHATSAPP NOW";
export const ABOUT_CTA_HREF = WHATSAPP_LINK;

// Heading reveals word-by-word, tied directly to scroll position (not time) —
// scrub distance runs from the section entering the bottom of the viewport
// to its top clearing the vertical center, so the whole reveal completes
// well before the section is scrolled past.
export const TITLE_REVEAL_SCROLL_START = "top bottom";
export const TITLE_REVEAL_SCROLL_END = "bottom center";
export const TITLE_REVEAL_SCRUB = 1.2;
export const TITLE_REVEAL_STAGGER_EACH_S = 0.25;
export const TITLE_REVEAL_OPACITY_FROM = 0.3;
