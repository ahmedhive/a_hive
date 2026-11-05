"use client";

import { CSSProperties } from "react";
import { WorkCard } from "./components";
import {
  WORK_BADGE,
  WORK_PERSPECTIVE_PX,
  WORK_PIN_TOP,
  WORK_TITLE,
  WORK_TRACK_HEIGHT_VH,
} from "./featured-work.data";
import useFeaturedWork from "./use-featured-work";
import { FEATURED_WORK } from "@/data/work";

export default function FeaturedWork() {
  const { headerRef, titleRef, badgeRef, trackRef, stackRef } =
    useFeaturedWork();

  return (
    <section className="overflow-clip px-[5%] py-16 text-black-secondary sm:py-20 md:py-25 lg:py-37.5">
      <div className="mx-auto w-full max-w-420">
        <header
          ref={headerRef}
          className="relative mb-8 text-center sm:mb-11 md:mb-13 lg:mb-20"
        >
          <h2
            ref={titleRef}
            className="text-(length:--_typography---font-sizes--heading--h2) leading-none font-normal tracking-[-0.03em] uppercase"
          >
            {WORK_TITLE}
          </h2>
          {/* Sticker: top/right offsets and padding follow the reference's
              breakpoints; hidden below 640px. */}
          <p
            ref={badgeRef}
            className="absolute top-4.75 right-52.5 hidden -rotate-15 bg-lime px-5 py-3 font-heading text-[clamp(1.5rem,1.2573rem+1.0356vw,2.5rem)] leading-[0.8] tracking-[-0.01em] sm:block md:top-6 lg:top-11.5 lg:right-51.75 lg:px-9 lg:py-5 2xl:top-20.5 2xl:right-69.25"
          >
            {WORK_BADGE}
          </p>
        </header>

        {/* From 768px (motion allowed) the track is tall and the stack inside it
            sticks near the top, with a CSS perspective for the peeling cards;
            below that, or under reduced motion, both collapse to plain flow.
            The geometry comes from data so it's tuned in one place; Tailwind
            can't take it from a variable at build time. */}
        <div
          ref={trackRef}
          className="motion-safe:md:h-(--work-track-h)"
          style={
            {
              "--work-track-h": `${WORK_TRACK_HEIGHT_VH}vh`,
              "--work-pin-top": WORK_PIN_TOP,
              "--work-perspective": `${WORK_PERSPECTIVE_PX}px`,
            } as CSSProperties
          }
        >
          <div
            ref={stackRef}
            className="relative flex flex-col items-center gap-5 motion-safe:md:sticky motion-safe:md:top-(--work-pin-top) motion-safe:md:gap-0 motion-safe:md:perspective-(--work-perspective)"
          >
            {FEATURED_WORK.map((work, index) => (
              <WorkCard
                key={work.title}
                work={work}
                index={index}
                total={FEATURED_WORK.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
