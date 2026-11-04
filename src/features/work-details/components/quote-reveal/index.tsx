"use client";

import { cn } from "@/lib/utils";
import { IQuoteRevealProps } from "./quote-reveal.interface";
import useQuoteReveal from "./use-quote-reveal";
import { SECTION_CLASS } from "../../work-details.data";

export default function QuoteReveal(props: IQuoteRevealProps) {
  const { lines } = props;
  const { sectionRef } = useQuoteReveal();

  return (
    <section ref={sectionRef} className={cn("overflow-clip", SECTION_CLASS)}>
      <div className="mx-auto flex w-full max-w-420 flex-col items-center text-center">
        {lines.map((line) => (
          <div key={line} className="relative inline-flex pt-1 pr-1">
            <h3 className="max-w-[10ch] text-(length:--marquee-text-size) leading-[0.8] tracking-[-0.03em] uppercase">
              {line}
            </h3>
            {/* Slides off to the right as the section scrolls, uncovering the
                line; hidden outright when motion is reduced. */}
            <div
              data-quote-cover
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-white/60 motion-reduce:hidden"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
