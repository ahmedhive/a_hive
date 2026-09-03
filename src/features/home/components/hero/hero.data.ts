import { InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/assets/icons";
import { IHeroSocialLink, IHeroStat } from "./hero.interface";

export const HERO_TITLE = "AHMED HIVE";
// Hardcoded line break (not left to max-width auto-wrap): "Digital Agency"
// combined sits right at the edge of the container width, so a font-metrics
// hair's-breadth difference between font builds can tip it onto a 3rd line.
export const HERO_SUBTITLE_LINES = ["STRATEGY-LED", "PRODUCT DESIGN"];
export const HERO_DESCRIPTION =
  "A PRODUCT MANAGER AND DESIGNER CRAFTING CLEAR, HIGH CONVERTING DIGITAL PRODUCTS FOR FOUNDERS, EVERYWHERE.";

export const HERO_SOCIAL_LINKS: IHeroSocialLink[] = [
  {
    label: "Whatsapp",
    href: "https://wa.me/+923340050391",
    Icon: WhatsappIcon,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/ahmedhiivee",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahmedhive/",
    Icon: LinkedinIcon,
  },
];

export const HERO_STAT: IHeroStat = {
  value: "8+ YRS",
  label: "BUILDING PRODUCTS",
};

// Image wrapper zooms out into place as the "cover" for the section reveal.
export const IMAGE_REVEAL_START_S = 1.6;
export const IMAGE_REVEAL_DURATION_S = 1.5;
export const IMAGE_REVEAL_SCALE_X_FROM = 0.3;
export const IMAGE_REVEAL_SCALE_Y_FROM = 0.2;
export const IMAGE_REVEAL_EASE = "power1.inOut";

// Title/subtitle/description reveal char-by-char via SplitText masks.
export const TITLE_REVEAL_START_S = 2.57;
export const TITLE_REVEAL_DURATION_S = 1;
export const TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const TITLE_REVEAL_EASE = "back.inOut";

export const SUBTITLE_REVEAL_START_S = 3.46;
export const SUBTITLE_REVEAL_DURATION_S = 1;
export const SUBTITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const SUBTITLE_REVEAL_EASE = "back.inOut";

export const DESCRIPTION_REVEAL_START_S = 4.06;
export const DESCRIPTION_REVEAL_DURATION_S = 0.8;
export const DESCRIPTION_REVEAL_STAGGER_AMOUNT_S = 0.4;
export const DESCRIPTION_REVEAL_EASE = "power3.out";

// Social links and the stat block fade + rise in as solid blocks (no split).
export const PROOF_AREA_REVEAL_DURATION_S = 0.5;
export const PROOF_AREA_REVEAL_Y_PX = 30;
export const PROOF_AREA_REVEAL_EASE = "power1.out";

export const SOCIAL_LINKS_REVEAL_START_S = 4.89;
export const STAT_REVEAL_START_S = 5.05;

// Debounces recomputeNeckLineGap's resize-observer trigger (see use-hero.ts).
export const HERO_LAYOUT_RESIZE_DEBOUNCE_MS = 150;

// Cursor-follow parallax on the foreground image (see use-hero.ts's
// startParallax). Max px the image translates toward the cursor at full
// deflection (cursor at the section's own edge). X has zero interaction
// with recomputeNeckLineGap's neck-line safety net below, so it's kept
// close to the reference design's magnitude. Y is capped far below
// HERO_NECK_LINE_BUFFER_PX: a downward Y offset here isn't compensated in
// real time by that safety net (it only recomputes on image load / debounced
// resize, not on pointer move) — 6px leaves >70% of the 20px buffer intact
// even at the cursor's most extreme (bottom-edge) position, and quickTo's
// power3.out easing never overshoots, so this is a hard ceiling.
export const PARALLAX_MAX_OFFSET_X_PX = 18;
export const PARALLAX_MAX_OFFSET_Y_PX = 6;
// Longer than custom-cursor's 0.25s dot-follow: a large background layer
// should read as "heavy"/parallax, not as a second cursor.
export const PARALLAX_QUICK_TO_DURATION_S = 0.6;
export const PARALLAX_QUICK_TO_EASE = "power3.out";

// The subtitle/description block must never render over the person's face
// or beard in hero-foreground-img.webp — see use-hero.ts's
// recomputeNeckLineGap. Calibrated against the natural image (1440x1268px)
// by rendering horizontal guide lines at candidate ratios and checking them
// against the source photo directly: the beard's lowest point (at its
// longest, off-center) sits right at ~67.5% down the image with zero
// clearance, so this is set past that with real margin. Re-tune this single
// ratio (and re-check the same way) if the art asset changes.
export const HERO_NECK_LINE_RATIO = 0.71;
// Extra breathing room below the calibrated line, beyond the strict pixel
// boundary.
export const HERO_NECK_LINE_BUFFER_PX = 20;
// Hard cap on recomputeNeckLineGap's shrink passes — shrinking this gap is
// a well-behaved, converging lever (unlike growing the section, which this
// replaced), so it settles in 1-2 passes in practice; this is
// defense-in-depth against a pathological case ever looping unbounded.
export const HERO_NECK_LINE_MAX_SHRINK_PASSES = 4;

// The hero photo's head must never sit too close to the title above it on
// desktop, where cover-fit naturally places the person right up against (or
// over) it — see use-hero.ts's recomputeHeadClearance. Calibrated the same
// way as HERO_NECK_LINE_RATIO above: rendering horizontal guide lines on the
// natural image and checking them against the source photo directly — the
// topmost visible hair strand sits right at ~18.5% down the image. Re-tune
// (and re-check the same way) if the art asset changes.
export const HERO_HEAD_TOP_RATIO = 0.185;
// The head should only ever cover the bottom ~40% of the title's own
// height (the top 60% stays clear) — the target recomputeHeadClearance
// solves for.
export const HERO_HEAD_TITLE_CLEARANCE_FRACTION = 0.4;
// A little extra breathing room past the bare 40% point.
export const HERO_HEAD_CLEARANCE_BUFFER_PX = 12;
// Hard cap on the height-bound lever's box-shrink (see
// computeHeadClearanceAdjustment): without this, an extreme aspect ratio
// could zoom the photo out until the person reads as tiny. Covers the
// deficit actually measured across the 1024-1450px range (~80-135px) with
// real headroom; better to fall short of the 40% target on some viewport
// than sacrifice image scale this far.
export const HERO_HEAD_CLEARANCE_MAX_SHRINK_PX = 260;

// Desktop-only: deliberately renders the photo into a smaller box (uniformly
// shrunk, not just cropped tighter) than the full section, so cover-fit's
// zoom is genuinely lower and more of the actual photo is visible — not just
// a cosmetic scale-down (a CSS transform alone wouldn't reveal any more of
// the image, since cover-fit would still compute its crop against the full,
// untransformed box first). Matches the `lg` breakpoint (index.tsx's
// `lg:left-[10%] lg:right-[10%]` on imageWrapperRef handles the horizontal
// half of this shrink in CSS directly, since that axis is never touched by
// this file's JS — HERO_DESKTOP_IMAGE_SHRINK_FRACTION must stay in sync with
// that pair of insets, i.e. each side there should be half of this value).
// The vertical half is applied here as a baseline top-inset, feeding into
// the same bottom-anchored, bottom-never-crops lever recomputeHeadClearance
// already uses — see below for why that composes safely with its own
// further fine-tuning of the same lever.
export const HERO_DESKTOP_MIN_WIDTH_PX = 1024;
export const HERO_DESKTOP_IMAGE_SHRINK_FRACTION = 0.2;
