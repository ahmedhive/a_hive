"use client";

import { DecorativeLines } from "@/layout/components";
import { cn } from "@/lib";
import { ServiceVideo } from "./components";
import {
  EXPERT_BADGE,
  EXPERT_LINE_GAP_PX,
  EXPERT_LINE_HEIGHTS_PX,
  EXPERT_LINE_RESPONSIVE_HEIGHTS,
  EXPERT_SOLUTIONS,
  EXPERT_TAGS_LABEL,
  EXPERT_TITLE,
} from "./expert-solutions.data";
import useExpertSolutions from "./use-expert-solutions";

export default function ExpertSolutions() {
  const { sectionRef, titleRef, badgeRef } = useExpertSolutions();

  return (
    <>
      <section
        ref={sectionRef}
        className="bg-blush px-[5%] text-black-secondary py-16 sm:py-20 md:py-25 lg:py-37.5"
      >
        <div className="mx-auto w-full max-w-420">
          <header className="relative mb-8 sm:mb-11 md:mb-13 lg:mb-20 text-center">
            <h2
              ref={titleRef}
              className="text-(length:--_typography---font-sizes--heading--h2) leading-none font-normal tracking-[-0.03em] uppercase"
            >
              {EXPERT_TITLE}
            </h2>
            {/* Sticker: offsets and padding follow the reference's
              breakpoints; hidden below 640px. */}
            <p
              ref={badgeRef}
              className="absolute top-13 left-58.5 hidden -rotate-15 bg-sun px-9 py-5 font-heading text-[clamp(1.5rem,1.2573rem+1.0356vw,2.5rem)] leading-[0.8] tracking-[-0.01em] max-lg:top-4.5 max-lg:left-64 max-lg:px-5 max-lg:py-3 max-md:px-4 max-md:py-2 sm:block xl:top-16 xl:left-66 2xl:top-23.5 2xl:left-80.75"
            >
              {EXPERT_BADGE}
            </p>
          </header>

          <div>
            {EXPERT_SOLUTIONS.map(({ title, tags, video, poster }) => (
              <article
                key={title}
                className="sticky top-25 border-t border-black-secondary bg-blush py-15 max-lg:py-10 max-md:top-12 max-md:py-8 max-sm:py-6 2xl:py-25"
              >
                <div className="flex flex-wrap items-center justify-between gap-10 max-sm:gap-8">
                  <div className="flex-[260px] max-lg:basis-72.5 max-md:basis-82.5">
                    <h3
                      data-expert-title
                      className="mb-10 text-(length:--_typography---font-sizes--heading--h3) leading-none font-normal tracking-[-0.01em] uppercase max-lg:mb-6"
                    >
                      {title}
                    </h3>
                    <p className="mb-4 text-base font-bold text-black-secondary uppercase lg:mb-5 lg:text-xl">
                      {EXPERT_TAGS_LABEL}
                    </p>
                    <ul className="flex max-w-152.5 flex-wrap gap-x-2 gap-y-3">
                      {tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-white px-5 py-2 text-base font-medium text-black-secondary uppercase max-lg:px-3 max-lg:py-1 max-lg:text-sm"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ServiceVideo src={video} poster={poster} label={title} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <DecorativeLines
        heights={EXPERT_LINE_HEIGHTS_PX}
        gap={EXPERT_LINE_GAP_PX}
        lineClassName="bg-blush"
        className={cn("mt-1 w-full", EXPERT_LINE_RESPONSIVE_HEIGHTS)}
      />
    </>
  );
}
