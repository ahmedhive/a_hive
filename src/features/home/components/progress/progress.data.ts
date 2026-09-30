import {
  Progress2018Img,
  Progress2019Img,
  Progress2020Img,
  Progress2021Img,
  Progress2022Img,
  Progress2023Img,
  Progress2024Img,
  Progress2025Img,
  Progress2026Img,
} from "@/assets/images";
import { IProgressItem } from "./progress.interface";

export const PROGRESS_ITEMS: IProgressItem[] = [
  {
    year: "2026",
    badgeLabel: "ONE PROCESS",
    badgeColor: "#BCE70C",
    description:
      "The roadmap and the interface stopped being two separate jobs, they became one continuous decision I make over and over, every single day.",
    image: Progress2026Img,
  },
  {
    year: "2025",
    badgeLabel: "GOT SPECIFIC",
    badgeColor: "#FF6EB0",
    description:
      "I got specific about who I actually want to work with, and just as specific about turning away the work that didn't fit anymore.",
    image: Progress2025Img,
  },
  {
    year: "2024",
    badgeLabel: "STRATEGY JOINED",
    badgeColor: "#C5BAFF",
    description:
      "Senior product management pulled me in, strategy stopped being someone else's job the moment I started owning roadmaps as much as interfaces.",
    image: Progress2024Img,
  },
  {
    year: "2023",
    badgeLabel: "SCALING UP",
    badgeColor: "#3DECD5",
    description:
      "Two hundred plus projects later, volume became the real teacher, forcing me to get faster at scoping without ever letting quality slip.",
    image: Progress2023Img,
  },
  {
    year: "2022",
    badgeLabel: "LEVELED UP",
    badgeColor: "#FFC145",
    description:
      "Formal certifications gave structure to instincts I had already built through years of client work, method finally caught up to intuition.",
    image: Progress2022Img,
  },
  {
    year: "2021",
    badgeLabel: "REAL CLIENTS",
    badgeColor: "#FF8198",
    description:
      "Real products, real users, and a business that actually depended on my decisions, this was the year my work stopped being practice.",
    image: Progress2021Img,
  },
  {
    year: "2020",
    badgeLabel: "THINKING IN ROADMAPS",
    badgeColor: "#99C3FF",
    description:
      "I stopped introducing myself as a designer first and started leading with the strategy that had quietly been shaping my best work all along.",
    image: Progress2020Img,
  },
  {
    year: "2019",
    badgeLabel: "BUILDING REPS",
    badgeColor: "#B5B5B5",
    description:
      "Almost every project got a yes from me, not because each one was exciting, but because every single one taught me something new.",
    image: Progress2019Img,
  },
  {
    year: "2018",
    badgeLabel: "DAY ONE",
    badgeColor: "#D4D4D4",
    description:
      "No clients, no roadmap, no plan, just curiosity and a willingness to figure things out one small project at a time.",
    image: Progress2018Img,
  },
];

// Smoothing on the scrub itself; same role as about-me's TITLE_REVEAL_SCRUB.
export const PROGRESS_ROW_SCRUB = 0.8;

// The reference ships 6 cards. Its scroll timing and end position are tuned
// for that count, so use-progress.ts scales them to our own card count.
export const PROGRESS_REFERENCE_ITEM_COUNT = 6;

// Matches the `max-width: 991px` tier in globals.css and the sticky classes
// in index.tsx.
export const PROGRESS_TABLET_MAX_WIDTH = 991;

// Measured from the reference (flat 300vh track, 6 cards):
// - endShare: the row stops once it has moved this share of its own width,
//   so the last card rests at a fixed spot (desktop 70%, tablet/phone 84%).
// - start / end: ScrollTrigger positions the scrub runs between.
// - travelVh: scroll distance of that run, in viewport heights, for the
//   reference's 6 cards. Our 9 cards keep the same px-per-px pace by
//   stretching it (see use-progress.ts).
// - tailVh: pinned scroll left after the run ends (track = travel + tail).
export const PROGRESS_SCROLL = {
  desktop: {
    endShare: 0.7,
    start: "top top",
    end: "bottom 130%",
    travelVh: 1.7,
    tailVh: 1.3,
  },
  tablet: {
    endShare: 0.84,
    start: "top 50%",
    end: "bottom bottom",
    travelVh: 2.5,
    tailVh: 0.5,
  },
} as const;
