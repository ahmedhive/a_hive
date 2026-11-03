"use client";

import { TickerStarIcon } from "@/assets/icons";
import { DecorativeLines } from "@/components";
import { cn } from "@/lib";
import {
  TICKER_GROUPS,
  TICKER_LINE_GAP_PX,
  TICKER_LINE_HEIGHTS_PX,
  TICKER_LINE_RESPONSIVE_HEIGHTS,
  TICKER_WORDS,
} from "./service-ticker.data";
import useServiceTicker from "./use-service-ticker";

export default function ServiceTicker() {
  const { rowRef } = useServiceTicker();

  return (
    <>
      {/* Decorative: the words repeat purely so the row can loop, so
          assistive tech skips it rather than reading them out three times. */}
      <section aria-hidden className="overflow-clip bg-wine py-4 text-white">
        <div ref={rowRef} className="flex">
          {TICKER_GROUPS.map((_, group) => (
            <div
              key={group}
              data-ticker-group
              className="flex flex-none items-center"
            >
              {TICKER_WORDS.map((word) => (
                <div key={word} className="flex flex-none items-center">
                  <h2 className="mr-6 flex-none text-[clamp(2.75rem,1.4757rem+5.4369vw,5rem)] leading-none font-normal tracking-[0.01em] uppercase md:mr-10 lg:mr-15">
                    {word}
                  </h2>
                  <div
                    data-ticker-star
                    className="mr-6 flex w-10 flex-none sm:w-12.5 md:mr-10 md:w-15 lg:mr-15 lg:w-22.5"
                  >
                    <TickerStarIcon className="h-auto w-full" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <DecorativeLines
        heights={TICKER_LINE_HEIGHTS_PX}
        gap={TICKER_LINE_GAP_PX}
        lineClassName="bg-wine"
        className={cn("mt-1 w-full", TICKER_LINE_RESPONSIVE_HEIGHTS)}
      />
    </>
  );
}
