import {
  StatsVisualFourIcon,
  StatsVisualOneIcon,
  StatsVisualThreeIcon,
  StatsVisualTwoIcon,
} from "@/assets/icons";
import { IStat } from "./stats-grid.interface";

export const STATS: IStat[] = [
  {
    value: "08+",
    label: "Years spent planning and designing real products",
    boxClassName: "bg-wine text-white",
    Visual: StatsVisualOneIcon,
    visualClassName: "text-white right-0 bottom-0 max-lg:h-auto max-lg:w-22.25",
  },
  {
    value: "200+",
    label: "Projects shipped for founders and product teams",
    boxClassName: "bg-black-secondary text-white",
    Visual: StatsVisualTwoIcon,
    visualClassName: "text-white right-0 bottom-0 max-lg:h-auto max-lg:w-36",
  },
  {
    value: "82+",
    label: "PRDs and roadmaps I've written that actually shipped",
    boxClassName: "bg-mist text-black-secondary",
    Visual: StatsVisualThreeIcon,
    visualClassName: "text-white top-0 right-0 max-lg:h-auto max-lg:w-14.75",
  },
  {
    value: "4.9",
    label: "Average rating from my clients across globe",
    boxClassName: "bg-vivid-red text-white",
    Visual: StatsVisualFourIcon,
    visualClassName: "text-white right-0 bottom-0 max-lg:h-auto max-lg:w-22.5",
  },
];
