import { IQuote } from "./quotes.interface";

export const QUOTES_MARQUEE_TEXT = "The Numbers Behind Work";
export const QUOTES_LABEL = "The numbers behind the work";

// Order is the reference's logo order: entry N fills tile slot N of the grid
// (see the quotes-slot rules in globals.css), which is also the DOM and tab
// order. The first entry is active on load. A "person" caption shows a name
// over a role and wraps the quote in quotation marks; a "label" caption shows
// two uppercase lines and no quotation marks.
export const QUOTES: IQuote[] = [
  {
    stat: "01 ONLY",
    quote:
      "I don't hand off a file and disappear. I stay through the roadmap, the sprints, and the launch, until the product is actually shipped.",
    title: "Ahmed Hive",
    subtitle: "Product Manager & Product Designer",
    variant: "person",
  },
  {
    stat: "620+",
    quote:
      "Six hundred twenty plus user stories written and handed to real teams, small enough to build, clear enough to not need a meeting.",
    title: "Broken down",
    subtitle: "User stories written",
    variant: "label",
  },
  {
    stat: "200+",
    quote:
      "Two hundred plus projects taught me more about scoping, prioritizing, and saying no than any single course or certification ever could.",
    title: "Volume",
    subtitle: "Real projects shipped",
    variant: "label",
  },
  {
    stat: "2+",
    quote:
      "Two roles, product manager and designer, handled by one person, which means fewer handoffs, faster decisions, and nothing lost in translation.",
    title: "One role",
    subtitle: "Two disciplines, merged",
    variant: "label",
  },
  {
    stat: "3+",
    quote:
      "Three companies where I've owned both product strategy and design at the same time, not split across two people or two separate meetings.",
    title: "Proven",
    subtitle: "Same ownership, every time",
    variant: "label",
  },
  {
    stat: "15+",
    quote:
      "Fifteen plus PRDs and roadmaps written, reviewed, and actually shipped, not filed away and forgotten after the kickoff meeting.",
    title: "Documented",
    subtitle: "PRDs & roadmaps",
    variant: "label",
  },
];

// Layout key per stat (same order as QUOTES): which set of cells the quote box
// and the two movable tiles occupy, set in the `data-quotes-layout` rules in
// globals.css. "01 ONLY" and "200+" share the reference's default layout.
export const QUOTES_LAYOUT_KEYS = ["base", "620", "base", "2", "3", "15"];

// The tiles that change cells (slots 3 and 5 are "200+" and "3+"); the quote
// box moves too. Everything else stays put.
export const QUOTES_MOVING_SLOTS = [3, 5];

// Cells only change from 1024px up (the tablet and phone layouts stay put).
// Must equal the `min-width: 1024px` query around the layout rules in
// globals.css: matchMedia can't read it from there.
export const QUOTES_MOVE_QUERY = "(min-width: 1024px)";

// Placement change. The box and any tile that doesn't cross it glide to their
// new cells together; a tile whose move would cross the box fades out where it
// was and fades back in at its new cell instead.
export const QUOTES_MOVE_DURATION_S = 0.9;
export const QUOTES_MOVE_EASE = "power3.inOut";
export const QUOTES_TILE_FADE_OUT_S = 0.3;
export const QUOTES_TILE_FADE_IN_S = 0.45;
export const QUOTES_TILE_FADE_IN_DELAY_S = 0.3;
export const QUOTES_TILE_FADE_EASE = "power2.out";
// Points sampled along a tile's straight path to test whether it crosses the box.
export const QUOTES_PATH_SAMPLES = 24;

// The background grid of square cells: 22 columns by 11 rows on desktop (11
// by 22 below 1024px, hidden below 768px). One cell near the end is
// hidden at tablet widths, as in the reference.
export const QUOTES_BG_CELLS = 242;
export const QUOTES_TABLET_HIDDEN_CELL = 227;

// The strip repeats its phrase and the track tweens 50% of its own width, so
// one loop is half the copies and lands on a frame identical to the start. Four
// copies keep that half wider than the strip box at any width.
export const QUOTES_MARQUEE_COPIES = 4;

// A literal px/second speed (not a fixed duration): duration is derived from
// the measured width in use-quotes.ts, so the speed holds across widths.
export const QUOTES_MARQUEE_SPEED_PX_PER_S = 70;
export const QUOTES_MARQUEE_EASE = "none";

// Quote swap. The old lines lift out through their masks, then the new quote's
// lines rise in from below, staggered; the author fades with the last of them.
export const QUOTES_OUT_DURATION_S = 0.5;
export const QUOTES_OUT_STAGGER_S = 0.08;
export const QUOTES_OUT_EASE = "power3.in";
export const QUOTES_IN_DURATION_S = 0.8;
export const QUOTES_IN_STAGGER_S = 0.1;
export const QUOTES_IN_EASE = "power3.out";
export const QUOTES_AUTHOR_FADE_DURATION_S = 0.5;
export const QUOTES_AUTHOR_FADE_DELAY_S = 0.3;
