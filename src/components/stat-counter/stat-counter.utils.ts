import { FILLER_DIGITS } from "./stat-counter.data";
import { TCounterAlign, TCounterPart } from "./stat-counter.interface";

// A column holds ten numerals. Top-aligned columns list the real digit first
// and settle on it from above; bottom-aligned columns list it last and settle
// on it from below, so the roll passes through the other numerals on the way.
export const columnDigits = (digit: number, align: TCounterAlign) =>
  align === "top"
    ? [digit, ...FILLER_DIGITS.slice(1)]
    : [...FILLER_DIGITS.slice(0, 9), digit];

// Digits alternate top/bottom alignment in reading order; "." stays still
// and any other character (the "+") is the suffix that fades in last.
export const toParts = (value: string): TCounterPart[] => {
  let digitCount = 0;
  return Array.from(value).map((char): TCounterPart => {
    if (/\d/.test(char)) {
      const align = digitCount % 2 === 0 ? "top" : "bottom";
      digitCount += 1;
      return { kind: "digit", digit: Number(char), align };
    }
    return char === "." ? { kind: "dot" } : { kind: "suffix", char };
  });
};
