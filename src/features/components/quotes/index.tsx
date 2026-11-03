"use client";

import { PixelGlyphIcon } from "@/assets/icons";
import { cn } from "@/lib";
import {
  QUOTES,
  QUOTES_BG_CELLS,
  QUOTES_LABEL,
  QUOTES_MARQUEE_COPIES,
  QUOTES_MARQUEE_TEXT,
  QUOTES_TABLET_HIDDEN_CELL,
} from "./quotes.data";
import useQuotes from "./use-quotes";

const BG_CELLS = Array.from({ length: QUOTES_BG_CELLS });
const MARQUEE_COPIES = Array.from({ length: QUOTES_MARQUEE_COPIES });

export default function Quotes() {
  const {
    marqueeRef,
    overlayRef,
    quoteRef,
    authorRef,
    active,
    shown,
    layoutKey,
    select,
  } = useQuotes();
  const { quote, title, subtitle, variant } = QUOTES[shown];
  const isPerson = variant === "person";

  return (
    <section
      data-bg-luma="dark"
      data-cursor-shape="circle"
      className="quotes-section relative text-white"
    >
      <h2 className="sr-only">{QUOTES_LABEL}</h2>

      <div className="relative w-full">
        {/* Square-cell grid lines behind everything. */}
        <div aria-hidden className="quotes-bg">
          {BG_CELLS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "quotes-cell",
                i === QUOTES_TABLET_HIDDEN_CELL && "quotes-cell-tablet-hidden",
              )}
            />
          ))}
        </div>

        <div
          ref={overlayRef}
          data-quotes-layout={layoutKey}
          className="quotes-overlay"
        >
          {/* The strip repeats its phrase only so the tween can loop
              seamlessly, so it is hidden from assistive tech. */}
          <div data-quotes-area="strip" aria-hidden className="quotes-strip">
            <div
              ref={marqueeRef}
              className="flex w-max items-center whitespace-nowrap"
            >
              {MARQUEE_COPIES.map((_, i) => (
                <div key={i} className="flex items-center">
                  <p className="mr-10 font-medium uppercase max-sm:mr-6">
                    {QUOTES_MARQUEE_TEXT}
                  </p>
                  <PixelGlyphIcon className="mr-10 shrink-0 max-sm:mr-6" />
                </div>
              ))}
            </div>
          </div>

          {/* The box stays put and announces the swap; only the figure inside
              is remounted per quote (see use-quotes.ts). */}
          <div data-quotes-area="quote" className="quotes-box">
            <div aria-live="polite" className="flex flex-1">
              <figure
                key={shown}
                className="flex w-full flex-col justify-between"
              >
                <blockquote>
                  <p
                    ref={quoteRef}
                    className="mb-8 text-(length:--_typography---font-sizes--body--badge) leading-[1.3] lg:text-[min(6cqw,2.5rem)] max-md:mb-15 max-sm:mb-9.5"
                  >
                    {isPerson ? `"${quote}"` : quote}
                  </p>
                </blockquote>
                <figcaption
                  ref={authorRef}
                  className="border-l border-dashed border-white pl-6 max-sm:pl-4"
                >
                  <p className="font-bold uppercase">{title}</p>
                  <p
                    className={cn("max-sm:text-base", !isPerson && "uppercase")}
                  >
                    {subtitle}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          {QUOTES.map((item, index) => (
            <button
              key={item.stat}
              type="button"
              data-quotes-slot={index + 1}
              aria-pressed={index === active}
              onMouseEnter={() => select(index)}
              onFocus={() => select(index)}
              onClick={() => select(index)}
              className={cn(
                "quotes-tile cursor-pointer transition-colors duration-500 ease-out focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white-secondary",
                index === active ? "text-white-secondary" : "text-iron",
              )}
            >
              {/* Sized against the tile, so the stat fits however many grid
                  cells the tile spans at this breakpoint. */}
              <span className="font-heading text-[32cqw] leading-none whitespace-nowrap uppercase">
                {item.stat}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
