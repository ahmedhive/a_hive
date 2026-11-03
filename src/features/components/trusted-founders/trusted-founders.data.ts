import {
  Trusted1Img,
  Trusted2Img,
  Trusted3Img,
  Trusted4Img,
  Trusted5Img,
  Trusted6Img,
  Trusted7Img,
  Trusted8Img,
  Trusted9Img,
  Trusted10Img,
} from "@/assets/images";
import { ROUTES } from "@/constants/routes";

export const TRUSTED_BADGE = "200+ Projects";
export const TRUSTED_TITLE_LEAD = "Trusted by";
export const TRUSTED_TITLE_ACCENT = "Founders";
export const TRUSTED_CTA_LABEL = "Contact Now";
export const TRUSTED_CTA_HREF = ROUTES.CONTACT;

// Placeholder images, to be replaced with the real founders' work. They sit
// around the wheel in this order, one every TRUSTED_STEP_DEG degrees.
export const TRUSTED_IMAGES = [
  Trusted1Img,
  Trusted2Img,
  Trusted3Img,
  Trusted4Img,
  Trusted5Img,
  Trusted6Img,
  Trusted7Img,
  Trusted8Img,
  Trusted9Img,
  Trusted10Img,
];
export const TRUSTED_STEP_DEG = 360 / TRUSTED_IMAGES.length;

// Overlap order of the cards, from the reference (cards 2-5 stack over
// their neighbours in this order; the rest sit at the default level).
export const TRUSTED_Z_INDEX_BY_CARD: Record<number, number> = {
  2: 9,
  3: 3,
  4: 2,
  5: 1,
};

// The wheel makes one full turn as the section scrolls through the viewport:
// from its top at 25% down the screen to its bottom leaving at the top (the
// reference's measured range), with a 0.85s scrub lag.
export const TRUSTED_TURN_START = "top 25%";
export const TRUSTED_TURN_END = "bottom top";
export const TRUSTED_TURN_SCRUB_S = 0.85;

// The cards fan out from one stack to their places and re-stack depending on
// where the section is and which way you are scrolling (all measured on the
// reference, which differs by direction): fanning on the way down once the
// section's top is 55% down the screen (the reference's is 40%, nudged
// earlier so the wheel is already open as it arrives), and on the way back up once its
// bottom is 70% down; stacking on the way down once its bottom is 50% down,
// and on the way back up once its top is 75% down.
export const TRUSTED_FAN_DOWN_AT = "top 55%";
export const TRUSTED_FAN_UP_AT = "bottom 70%";
export const TRUSTED_STACK_DOWN_AT = "bottom 50%";
export const TRUSTED_STACK_UP_AT = "top 75%";
export const TRUSTED_FAN_DURATION_S = 1;
export const TRUSTED_FAN_EASE = "power2.inOut";

// Hover on the content (desktop with a real pointer): the content comes to
// full opacity while the wheel shrinks.
export const TRUSTED_HOVER_QUERY =
  "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)";
export const TRUSTED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
export const TRUSTED_HOVER_DURATION_S = 0.5;
export const TRUSTED_HOVER_EASE = "power4.inOut";
export const TRUSTED_HOVER_WHEEL_SCALE = 0.8;
// The badge and the gradient word always show at full strength; the rest of
// the content rests at half opacity on desktop and comes up on hover.
export const TRUSTED_DIMMED_CLASS = "motion-safe:lg:opacity-50";
// Must equal the `opacity-50` in TRUSTED_DIMMED_CLASS: hovering off tweens
// back to this value.
export const TRUSTED_CONTENT_REST_OPACITY = 0.5;
