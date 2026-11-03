import {
  AboutLife1Img,
  AboutLife2Img,
  AboutLife3Img,
  AboutLife4Img,
} from "@/assets/images";
import { ILifeMoment } from "./life-behind-the-work.interface";

export const LIFE_TITLE = "Life behind the work";
export const LIFE_DESCRIPTION =
  "From early workshops to final pixels, this is how my days run.";

// From `lg` the cards sit in one row, each tucked under the one before it (the
// second also sits higher); the overlap is in vw so it scales with the card
// width, and is gentler from `2xl` where the cards stop growing.
const OVERLAP_CLASS = "lg:-ml-[10vw] 2xl:-ml-[6vw]";
// The reference tilts cards 1, 3 and 4 by -3deg and card 2 by +5deg.
export const LIFE_MOMENTS: ILifeMoment[] = [
  { image: AboutLife1Img, tiltDeg: -3, overlapClassName: "" },
  {
    image: AboutLife2Img,
    tiltDeg: 5,
    overlapClassName: `lg:-mt-[8vw] 2xl:-mt-[5vw] ${OVERLAP_CLASS}`,
  },
  { image: AboutLife3Img, tiltDeg: -3, overlapClassName: OVERLAP_CLASS },
  { image: AboutLife4Img, tiltDeg: -3, overlapClassName: OVERLAP_CLASS },
];

export const LIFE_TILT_DEG = LIFE_MOMENTS.map(({ tiltDeg }) => tiltDeg);

// Title and description reveals, same as the reference's [data-title-anim] and
// [data-text-anim] timelines: characters slide down through a mask once the
// element's top is 90% down the screen. The description waits 0.2s and is
// quicker.
export const LIFE_REVEAL_SCROLL_START = "top 90%";
export const LIFE_TITLE_REVEAL_DURATION_S = 1;
export const LIFE_TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const LIFE_TITLE_REVEAL_EASE = "back.inOut";
export const LIFE_TEXT_REVEAL_DELAY_S = 0.2;
export const LIFE_TEXT_REVEAL_DURATION_S = 0.8;
export const LIFE_TEXT_REVEAL_STAGGER_AMOUNT_S = 0.4;
export const LIFE_TEXT_REVEAL_EASE = "power3.out";

// Desktop only (`lg`+): once the row is half way up the screen the cards fly
// in from the right, spinning down into place, one after another, and then
// react to hover. Below `lg` they are just there. Must equal the `lg:` classes in index.tsx: matchMedia
// can't read them from there.
export const LIFE_FLY_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const LIFE_CARDS_SCROLL_START = "top center";
export const LIFE_CARD_FROM_X = "100vw";
export const LIFE_CARD_FROM_ROTATION_DEG = 40;
export const LIFE_CARD_ORIGIN = "100% 100%";
export const LIFE_CARD_DURATION_S = 1;
export const LIFE_CARD_STAGGER_AMOUNT_S = 0.4;
export const LIFE_CARD_EASE = "back.out";

// Hover, same as the reference's card hover timelines (desktop only): the
// hovered card straightens, scales up and comes forward while its neighbours
// slide apart. Row = the hovered card, column = how far each card moves
// sideways, in vw (positive is right).
export const LIFE_HOVER_SHIFT_VW = [
  [0, 7, 5, 5],
  [2, 0, 2, 2],
  [-15, -8, 0, 10],
  [-10, -8, -10, 0],
];
export const LIFE_HOVER_QUERY =
  "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)";
// Marks the hover tweens so cleanup can kill them without touching the fly-in.
export const LIFE_HOVER_TWEEN_TAG = "hover";
export const LIFE_HOVER_SCALE = 1.1;
export const LIFE_HOVER_IN_S = 0.8;
export const LIFE_HOVER_OUT_S = 0.6;
export const LIFE_HOVER_EASE = "back.out";
