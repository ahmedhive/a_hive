// Shapes of the two full-width images: the banner under the hero, and the
// wider one between the overview and the quote.
export const BANNER_CLASS = "aspect-2/1 sm:aspect-192/65";
export const DESC_IMAGE_CLASS = "aspect-12/5";

// The gap between the lines under the last section and the footer banner.
// The lines under the last section take its background colour, handed down as
// a custom property because the colour is data, not a class Tailwind can see.
export const LINES_COLOR_VARIABLE = "--lines-color";
export const LINES_COLOR_CLASS = "bg-(--lines-color)";

export const AFTER_LINES_SPACER_CLASS = "pt-16 sm:pt-20 md:pt-25 lg:pt-37.5";

// Shared by the sections: their padding and text colour, the heading size, and
// the body text size.
export const SECTION_CLASS =
  "px-[5%] py-16 text-black-secondary sm:py-20 md:py-25 lg:py-37.5";
export const SECTION_TITLE_CLASS =
  "text-(length:--_typography---font-sizes--heading--h4) leading-none font-normal tracking-[-0.01em] uppercase";
export const BODY_TEXT_CLASS = "text-base lg:text-xl";
