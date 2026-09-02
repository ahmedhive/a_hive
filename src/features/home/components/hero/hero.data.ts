import { InstagramIcon, WhatsappIcon } from "@/assets/icons";
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
