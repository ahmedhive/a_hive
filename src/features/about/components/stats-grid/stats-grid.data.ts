import {
  AboutStatsVisual1Img,
  AboutStatsVisual2Img,
  AboutStatsVisual3Img,
  AboutStatsVisual4Img,
} from "@/assets/images";
import { IStat } from "./stats-grid.interface";

export const STATS: IStat[] = [
  {
    value: "08+",
    label: "Years spent planning and designing real products",
    boxClassName: "bg-wine text-white",
    visual: AboutStatsVisual1Img,
    visualClassName: "bg-bottom-right max-[991px]:bg-[length:89px]",
  },
  {
    value: "200+",
    label: "Projects shipped for founders and product teams",
    boxClassName: "bg-black-secondary text-white",
    visual: AboutStatsVisual2Img,
    visualClassName: "bg-bottom-right max-[991px]:bg-[length:144px]",
  },
  {
    value: "82+",
    label: "PRDs and roadmaps I've written that actually shipped",
    boxClassName: "bg-mist text-black-secondary",
    visual: AboutStatsVisual3Img,
    visualClassName: "bg-top-right max-[991px]:bg-[length:59px]",
  },
  {
    value: "4.9",
    label: "Average rating from my clients across globe",
    boxClassName: "bg-vivid-red text-white",
    visual: AboutStatsVisual4Img,
    visualClassName: "bg-bottom-right max-[991px]:bg-[length:90px]",
  },
];

// Counter roll, same as the reference's [data-counter] timeline: once a box
// reaches the bottom of the viewport its digit columns roll into place (top
// columns downward, bottom columns upward) over 2s, then the suffix fades up
// just before the roll lands.
export const COUNTER_SCROLL_START = "top bottom";
export const COUNTER_ROLL_DURATION_S = 2;
export const COUNTER_ROLL_EASE = "power3.inOut";
export const COUNTER_ROLL_FROM_Y_PERCENT = 90;
export const COUNTER_SUFFIX_START_S = 1.94;
export const COUNTER_SUFFIX_FROM_Y_PERCENT = 20;
export const COUNTER_SUFFIX_EASE = "power2.out";
