import {
  WhyWorkVisualOneIcon,
  WhyWorkVisualThreeIcon,
  WhyWorkVisualTwoIcon,
} from "@/assets/icons";
import { IWhyWorkCard } from "./why-work-with-me.interface";

export const WHY_WORK_TITLE = "Why work with me";
export const WHY_WORK_HIGHLIGHT = "No handoffs";
export const WHY_WORK_PARAGRAPHS = [
  "I help founders and product teams turn rough ideas into clear plans and products people actually use.",
  "You work directly with me, from the first conversation to launch day. The person who writes your roadmap is the same person who designs your product, so nothing gets lost along the way.",
];

export const WHY_WORK_HEADING_CLASS =
  "text-(length:--_typography---font-sizes--heading--h4) leading-none font-normal tracking-[-0.01em] uppercase";
// Width of the right-hand column, shared by "No handoffs" and the paragraphs
// so they line up: 220px on tablet, 321px on desktop, 400px from 2xl so the
// heading stays on one line, and full width on phones.
export const WHY_WORK_COLUMN_CLASS =
  "max-w-55 max-sm:max-w-none lg:max-w-80.25 2xl:max-w-100";

export const WHY_WORK_CARDS: IWhyWorkCard[] = [
  { label: "Respond within", value: "24 hours", Visual: WhyWorkVisualOneIcon },
  {
    label: "First roadmap in",
    value: "Only 7 days",
    Visual: WhyWorkVisualTwoIcon,
  },
  {
    label: "I stay with you",
    value: "Till it ships",
    Visual: WhyWorkVisualThreeIcon,
  },
];

// Title and paragraph reveals, same as the reference's [data-title-anim] and
// [data-text-anim] timelines: characters slide down through a mask once the
// element's top is 90% down the screen. The paragraphs wait 0.2s and are
// quicker.
export const WHY_WORK_REVEAL_SCROLL_START = "top 90%";
export const WHY_WORK_TITLE_REVEAL_DURATION_S = 1;
export const WHY_WORK_TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const WHY_WORK_TITLE_REVEAL_EASE = "back.inOut";
export const WHY_WORK_TEXT_REVEAL_DELAY_S = 0.2;
export const WHY_WORK_TEXT_REVEAL_DURATION_S = 0.8;
export const WHY_WORK_TEXT_REVEAL_STAGGER_AMOUNT_S = 0.4;
export const WHY_WORK_TEXT_REVEAL_EASE = "power3.out";

// Desktop only (`lg`+): the cards start side by side at full width each, so
// only the first shows (the row is clipped). As the track scrolls they shrink
// one after another (each 0.5s, 0.5s apart, linear) into three columns,
// revealing the next card, scrubbed with 0.8s of lag across the track. Below
// `lg` the cards just wrap in the normal flow. Must equal the `lg:` classes in
// index.tsx: matchMedia can't read them from there.
export const WHY_WORK_PIN_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const WHY_WORK_SCROLL_START = "top top";
export const WHY_WORK_SCROLL_END = "bottom 130%";
export const WHY_WORK_SCRUB_S = 0.8;
export const WHY_WORK_CARD_FROM_WIDTH = "100%";
export const WHY_WORK_CARD_TO_WIDTH = "32.5%";
export const WHY_WORK_CARD_DURATION_S = 0.5;
export const WHY_WORK_CARD_STAGGER_S = 0.5;
export const WHY_WORK_CARD_EASE = "none";
