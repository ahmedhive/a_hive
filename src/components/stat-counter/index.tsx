import { cn } from "@/lib/utils";
import { IStatCounterProps } from "./stat-counter.interface";
import { columnDigits, toParts } from "./stat-counter.utils";

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
