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
        className="bg-blush px-[5%] py-25 text-black-secondary min-[992px]:py-37.5"
      >
        <div className="mx-auto w-full max-w-420">
          <header className="relative mb-13 text-center min-[992px]:mb-20">
            <h2
              ref={titleRef}
              className="text-(length:--_typography---font-sizes--heading--h2) leading-none font-normal tracking-[-0.03em] uppercase"
            >
              {EXPERT_TITLE}
            </h2>
            {/* Sticker: offsets and padding follow the reference's
              breakpoints; hidden at 479px and below. */}
            <p
              ref={badgeRef}
              className="absolute top-13 left-58.5 hidden -rotate-15 bg-sun px-9 py-5 font-heading text-[clamp(1.5rem,1.2573rem+1.0356vw,2.5rem)] leading-[0.8] tracking-[-0.01em] max-[991px]:top-4.5 max-[991px]:left-64 max-[991px]:px-5 max-[991px]:py-3 max-[767px]:px-4 max-[767px]:py-2 min-[480px]:block min-[1440px]:top-16 min-[1440px]:left-66 min-[1920px]:top-23.5 min-[1920px]:left-80.75"
            >
              {EXPERT_BADGE}
            </p>
          </header>

          <div>
            {EXPERT_SOLUTIONS.map(({ title, tags, video, poster }) => (
              <article
                key={title}
                className="sticky top-25 border-t border-black-secondary bg-blush py-15 max-[991px]:py-10 max-[767px]:top-12 max-[767px]:py-8 max-[479px]:py-6 min-[1920px]:py-25"
              >
                <div className="flex flex-wrap items-center justify-between gap-10 max-[479px]:gap-8">
                  <div className="flex-[260px] max-[991px]:basis-72.5 max-[767px]:basis-82.5">
                    <h3
                      data-expert-title
                      className="mb-10 text-(length:--_typography---font-sizes--heading--h3) leading-none font-normal tracking-[-0.01em] uppercase max-[991px]:mb-6"
                    >
                      {title}
                    </h3>
                    <p className="mb-4 font-bold text-black-secondary uppercase">
                      {EXPERT_TAGS_LABEL}
                    </p>
                    <ul className="flex max-w-152.5 flex-wrap gap-x-2 gap-y-3">
                      {tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-white px-5 py-2 text-base font-medium text-black-secondary uppercase max-[991px]:px-3 max-[991px]:py-1 max-[991px]:text-sm"
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
