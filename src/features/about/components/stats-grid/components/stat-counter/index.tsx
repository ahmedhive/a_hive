import { cn } from "@/lib";
import { IStatCounterProps } from "./stat-counter.interface";

const FILLER_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// A column holds ten numerals. Top-aligned columns list the real digit first
// and settle on it from above; bottom-aligned columns list it last and settle
// on it from below, so the roll passes through the other numerals on the way.
const columnDigits = (digit: number, align: "top" | "bottom") =>
  align === "top"
    ? [digit, ...FILLER_DIGITS.slice(1)]
    : [...FILLER_DIGITS.slice(0, 9), digit];

type TCounterPart =
  | { kind: "digit"; digit: number; align: "top" | "bottom" }
  | { kind: "dot" }
  | { kind: "suffix"; char: string };

// Digits alternate top/bottom alignment in reading order; "." stays still
// and any other character (the "+") is the suffix that fades in last.
const toParts = (value: string): TCounterPart[] => {
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

// The number is drawn in its final state (so it reads correctly without any
// animation) and the roll is driven by the data-counter-* markers.
export default function StatCounter({ value, className }: IStatCounterProps) {
  return (
    <div
      data-counter
      role="img"
      aria-label={value}
      className={cn(
        "flex h-(--_typography---font-sizes--heading--h3) items-center justify-start overflow-hidden font-heading text-(length:--_typography---font-sizes--heading--h3) leading-none",
        className,
      )}
    >
      {toParts(value).map((part, index) => {
        if (part.kind === "digit") {
          return (
            <div
              key={index}
              aria-hidden
              data-counter-column={part.align}
              className={part.align === "top" ? "self-start" : "self-end"}
            >
              {columnDigits(part.digit, part.align).map((digit, i) => (
                <div key={i}>{digit}</div>
              ))}
            </div>
          );
        }
        if (part.kind === "dot") {
          return (
            <div key={index} aria-hidden>
              .
            </div>
          );
        }
        return (
          <div key={index} aria-hidden data-counter-suffix>
            {part.char}
          </div>
        );
      })}
    </div>
  );
}
