import { IQuote } from "./quotes.interface";

export const QUOTES_MARQUEE_TEXT = "The Numbers Behind Work";
export const QUOTES_LABEL = "The numbers behind the work";

// Dummy copy, to be replaced with real quotes. Order is the reference's logo
// order: entry N fills tile slot N of the grid (see the quotes-slot rules in
// globals.css), which is also the DOM and tab order. The first entry is
// active on load. Keep quotes to roughly 90 characters: the quote box is a
// fixed number of grid cells and clips its text at tablet widths.
export const QUOTES: IQuote[] = [
  {
    stat: "01 ONLY",
    quote:
      "One person owned the whole thing, from first brief to launch, and nothing got lost.",
    author: "Robert Kenedy",
    role: "Head of growth @ Walton",
  },
  {
    stat: "620+",
    quote:
      "Six hundred stories, each with clear acceptance criteria. Reviews got boring, happily.",
    author: "Daniel Danzo",
    role: "Video Editor",
  },
  {
    stat: "200+",
    quote:
      "Two hundred tickets cleared without a missed sprint. The roadmap stayed honest.",
    author: "Jerome Bell",
    role: "Marketing Coordinator",
  },
  {
    stat: "2+",
    quote: "Two years in, we still ask for the same person on every new build.",
    author: "Luis Hamilton",
    role: "UI/UX Designer",
  },
  {
    stat: "3+",
    quote:
      "Three products shipped under one roof, each on the date we promised.",
    author: "Jenifer Catherin",
    role: "Content Writer",
  },
  {
    stat: "15+",
    quote: "Fifteen releases in a year and the support inbox stayed quiet.",
    author: "Robert Kenedy",
    role: "Head of growth @ Walton",
  },
];

// The background grid of square cells: 22 columns by 11 rows on desktop (11
// by 22 from 991px down, hidden from 767px down). One cell near the end is
// hidden at tablet widths, as in the reference.
export const QUOTES_BG_CELLS = 242;
export const QUOTES_TABLET_HIDDEN_CELL = 227;

// The strip repeats its phrase and the track tweens -50% of its own width, so
// one loop is half the copies and lands on a frame identical to the start. Four
// copies keep that half wider than the strip box at any width.
export const QUOTES_MARQUEE_COPIES = 4;

// A literal px/second speed (not a fixed duration): duration is derived from
// the measured width in use-quotes.ts, so the speed holds across widths.
export const QUOTES_MARQUEE_SPEED_PX_PER_S = 100;
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
