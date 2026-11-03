import { IExpertSolution } from "./expert-solutions.interface";

export const EXPERT_TITLE = "Expert SOLUTIONS";
export const EXPERT_BADGE = "5 STAR SERVICES";
export const EXPERT_TAGS_LABEL = "Services included:";

// Videos and their poster frames are served from public/videos: Turbopack
// can't import .mp4 files.
export const EXPERT_SOLUTIONS: IExpertSolution[] = [
  {
    title: "PRODUCT DISCOVERY",
    tags: [
      "User Research",
      "Competitive Analysis",
      "Usability Testing",
      "Persona Development",
      "Discovery Workshops",
      "User Journey Mapping",
      "Market Research",
    ],
    video: "/videos/expert-sol-1-vid.mp4",
    poster: "/videos/expert-sol-1-poster.jpg",
  },
  {
    title: "PRODUCT STRATEGY",
    tags: [
      "Roadmap Planning",
      "PRD Writing",
      "User Stories",
      "Feature Prioritization",
      "Stakeholder Management",
      "OKRs",
      "Go-To-Market Strategy",
      "Product Vision",
    ],
    video: "/videos/expert-sol-2-vid.mp4",
    poster: "/videos/expert-sol-2-poster.jpg",
  },
  {
    title: "DESIGN & ALIGNMENT",
    tags: [
      "Interface Design",
      "Design Systems",
      "Wireframing",
      "Prototyping",
      "Sprint Planning",
      "Jira",
      "ClickUp",
      "Backlog Management",
      "Standups Facilitation",
    ],
    video: "/videos/expert-sol-3-vid.mp4",
    poster: "/videos/expert-sol-3-poster.jpg",
  },
  {
    title: "AI-NATIVE FLOWS",
    tags: [
      "AI Augmented Design",
      "Rapid Prototyping",
      "Workflow Automation",
      "AI Powered Research",
      "AI Copilot Integration",
      "Prompt Engineering",
    ],
    video: "/videos/expert-sol-4-vid.mp4",
    poster: "/videos/expert-sol-4-poster.jpg",
  },
];

// The band of shrinking lines under the section (the reference's `.border`):
// the layout's DecorativeLines at full width, 12px down to 3px with 4px gaps.
// Below 1024px and below 768px the reference thins them, which the component's
// inline heights can't express, so these classes override the first lines'
// heights (the rest follow the same steps; see the className in index.tsx).
export const EXPERT_LINE_HEIGHTS_PX = [12, 9, 6, 4, 3];
export const EXPERT_LINE_GAP_PX = 4;
export const EXPERT_LINE_RESPONSIVE_HEIGHTS =
  "max-lg:[&>:nth-child(1)]:h-2! max-lg:[&>:nth-child(2)]:h-1.5! max-md:[&>:nth-child(1)]:h-1.25! max-md:[&>:nth-child(2)]:h-1! max-md:[&>:nth-child(3)]:h-0.75! max-md:[&>:nth-child(4)]:h-0.5! max-md:[&>:nth-child(5)]:h-px!";

// Title reveal, same as the reference's [data-title-anim]: characters slide
// down through a mask once the title is 90% into the viewport, then the
// sticker pops in. The rows' titles reuse the title timing.
export const EXPERT_REVEAL_SCROLL_START = "top 90%";
export const EXPERT_TITLE_REVEAL_DURATION_S = 1;
export const EXPERT_TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const EXPERT_TITLE_REVEAL_EASE = "back.inOut";
export const EXPERT_BADGE_REVEAL_START_S = 1;
export const EXPERT_BADGE_REVEAL_DURATION_S = 0.6;
export const EXPERT_BADGE_REVEAL_FROM_SCALE = 0.5;
export const EXPERT_BADGE_REVEAL_EASE = "back.out";

// Box and button of each row's video.
export const EXPERT_VIDEO_CLASS =
  "aspect-4/3 max-w-150 flex-[200px] rounded-2xl sm:rounded-[20px] md:rounded-3xl lg:rounded-[40px] max-md:max-w-none max-md:basis-80 2xl:basis-150";
export const EXPERT_VIDEO_BUTTON_CLASS = "right-4 bottom-4";
