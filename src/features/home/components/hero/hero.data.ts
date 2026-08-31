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

// Each subtitle/description character switches to a light color when it
// individually sits over a dark region of the foreground photo (see
// use-hero.ts's recomputeContrast). Coverage/dark-ratio thresholds are
// calibrated for a single glyph's small bounding box (not a whole line) and
// set close to 1 deliberately: a character should only flip when essentially
// its whole box is dark, not just a corner or edge — a letter's bounding box
// always has some non-ink padding even when fully "on" the dark region
// (curves, the sides of an "l"/"i"), so this stops just short of a literal
// 100% requirement, which a fully-dark letter could still legitimately miss.
export const CONTRAST_ALPHA_THRESHOLD = 32;
export const CONTRAST_DARK_LUMINANCE_THRESHOLD = 90;
export const CONTRAST_MIN_PHOTO_COVERAGE_RATIO = 0.92;
export const CONTRAST_MIN_DARK_RATIO = 0.5;
// Higher than a whole-block sample would need, since each character now maps
// to a much smaller natural-image region and needs enough canvas resolution
// to sample accurately rather than a handful of blocky downscaled pixels.
export const CONTRAST_CANVAS_MAX_DIMENSION_PX = 960;
export const CONTRAST_RESIZE_DEBOUNCE_MS = 150;
