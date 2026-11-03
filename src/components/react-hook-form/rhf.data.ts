// Look shared by every field control: a blush box with no visible border that
// picks up the accent border on focus, and an alert-red one on error. Each
// control adds its own height and padding (they differ per control), sized to
// the reference's fields: 54px tall below `sm`, 64px from `sm`, 72px from `lg`.
export const RHF_FIELD_CLASS =
  "w-full rounded-xl border border-transparent bg-blush text-base text-black-secondary outline-none transition-colors placeholder:text-black-secondary focus:border-flame disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl lg:rounded-[20px] lg:text-xl";
export const RHF_FIELD_ERROR_CLASS = "border-vivid-red focus:border-vivid-red";
export const RHF_INPUT_CLASS = "h-13.5 px-4 sm:h-16 sm:px-5 lg:h-18 lg:px-7";
export const RHF_TEXTAREA_CLASS =
  "block resize-none p-5 h-35 sm:h-42.5 md:h-50";
// The arrow sits over the right padding, so the text clears it.
export const RHF_SELECT_CLASS =
  "h-13.5 appearance-none py-0 pr-10 pl-4 sm:h-16 sm:pr-12 sm:pl-5 lg:h-18 lg:pr-14 lg:pl-7";
export const RHF_SELECT_ARROW_CLASS =
  "pointer-events-none absolute top-1/2 right-[6%] w-3.5 -translate-y-1/2 text-black-secondary sm:right-[4%] sm:w-4.5";
export const RHF_ERROR_TEXT_CLASS = "mt-1 text-sm text-vivid-red";
