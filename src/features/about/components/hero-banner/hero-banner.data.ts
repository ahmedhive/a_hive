import {
  FeedbackIvanImg,
  FeedbackQudsiaImg,
  FeedbackShyamImg,
} from "@/assets/images";

export const HERO_CAPTION_PREFIX = "Meet ";
export const HERO_CAPTION_EMPHASIS = "(the)";
export const HERO_CAPTION_SUFFIX = " Maker";

// The title wraps the inline image: text before it, then text after it.
export const HERO_TITLE_BEFORE = "A PRODUCT MANAGER WHO DESIGNS, SHAPING";
export const HERO_TITLE_AFTER = "EVERY IDEA INTO SOMETHING THAT SHIPS";

export const HERO_RATING = "4.9";
export const HERO_RATING_LABEL = "Rating From Clients";
export const HERO_STAR_COUNT = 5;
export const HERO_AVATARS = [
  FeedbackQudsiaImg,
  FeedbackIvanImg,
  FeedbackShyamImg,
];

// Entrance, same as the reference's load timeline: the title's characters
// slide down through a mask while fading in, then the inline image pops in
// from nothing partway through. The caption slides up and fades in once it
// is in view.
export const HERO_TITLE_REVEAL_DURATION_S = 1;
export const HERO_TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const HERO_TITLE_REVEAL_EASE = "back.inOut";
export const HERO_IMAGE_REVEAL_START_S = 0.53;
export const HERO_IMAGE_REVEAL_DURATION_S = 0.5;
export const HERO_IMAGE_REVEAL_EASE = "power1.inOut";
export const HERO_CAPTION_REVEAL_DURATION_S = 0.5;
export const HERO_CAPTION_REVEAL_Y_PX = 30;
export const HERO_CAPTION_REVEAL_EASE = "power1.out";
export const HERO_CAPTION_SCROLL_START = "top bottom";
