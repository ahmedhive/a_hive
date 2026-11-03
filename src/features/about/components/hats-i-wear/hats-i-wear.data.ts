import {
  AboutMe1Img,
  AboutMe2Img,
  AboutMe3Img,
  AboutMe4Img,
} from "@/assets/images";
import { IHat } from "./hats-i-wear.interface";

export const HATS_TITLE = "The hats I wear";
export const HATS_BADGE = "One person";

// `stairClassName` is the desktop staircase: each card 100px lower than the one
// before it.
export const HATS: IHat[] = [
  {
    title: "The Strategist",
    description: "Roadmaps, priorities, and the why",
    image: AboutMe1Img,
    stairClassName: "",
  },
  {
    title: "The Product Manager",
    description: "PRDs, user stories, and sprints",
    image: AboutMe2Img,
    stairClassName: "lg:mt-25",
  },
  {
    title: "The Designer",
    description: "From first wireframe to final screen",
    image: AboutMe3Img,
    stairClassName: "lg:mt-50",
  },
  {
    title: "The AI Builder",
    description: "AI native workflows that ship faster",
    image: AboutMe4Img,
    stairClassName: "lg:mt-75",
  },
];

// Title and sticker reveal, same as the reference's [data-title-anim]
// timeline: the title's characters slide down through a mask once its top is
// 90% down the screen, then the sticker pops in.
export const HATS_REVEAL_SCROLL_START = "top 90%";
export const HATS_TITLE_REVEAL_DURATION_S = 1;
export const HATS_TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const HATS_TITLE_REVEAL_EASE = "back.inOut";
export const HATS_BADGE_REVEAL_START_S = 1;
export const HATS_BADGE_REVEAL_DURATION_S = 0.6;
export const HATS_BADGE_REVEAL_FROM_SCALE = 0.5;
export const HATS_BADGE_REVEAL_EASE = "back.out";

// Desktop only (`lg`+): the cards sit in a staircase (`stairClassName`) inside a pinned 300vh track. The first card
// is always there; the other three rise in from below their own height while
// fading in, one after another (each 0.5s, 0.5s apart, linear), scrubbed with
// 0.8s of lag across the track. Below `lg` the cards are a plain grid. Must
// equal the `lg:` classes in index.tsx: matchMedia can't read them from there.
export const HATS_PIN_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const HATS_SCROLL_START = "top top";
export const HATS_SCROLL_END = "bottom 130%";
export const HATS_SCRUB_S = 0.8;
export const HATS_CARD_FROM_Y_PERCENT = 100;
export const HATS_CARD_DURATION_S = 0.5;
export const HATS_CARD_STAGGER_S = 0.5;
export const HATS_CARD_EASE = "none";
