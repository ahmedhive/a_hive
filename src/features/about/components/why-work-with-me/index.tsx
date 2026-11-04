"use client";

import { cn } from "@/lib";
import {
  WHY_WORK_CARDS,
  WHY_WORK_COLUMN_CLASS,
  WHY_WORK_HEADING_CLASS,
  WHY_WORK_HIGHLIGHT,
  WHY_WORK_PARAGRAPHS,
  WHY_WORK_TITLE,
} from "./why-work-with-me.data";
import useWhyWorkWithMe from "./use-why-work-with-me";

export default function WhyWorkWithMe() {
  const { sectionRef, trackRef } = useWhyWorkWithMe();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip px-[5%] pb-16 sm:pb-20 md:pb-25 lg:pb-0"
    >
      <div className="mx-auto w-full max-w-420">
        <header className="mb-8 md:mb-13 lg:mb-20">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-black-secondary pb-4 sm:mb-8 max-sm:flex-col md:mb-9 md:pb-6 lg:mb-12 lg:pb-12">
            <h2 data-why-title className={WHY_WORK_HEADING_CLASS}>
              {WHY_WORK_TITLE}
            </h2>
            <div className={cn("w-full flex-1", WHY_WORK_COLUMN_CLASS)}>
              <h2 data-why-title className={WHY_WORK_HEADING_CLASS}>
                {WHY_WORK_HIGHLIGHT}
              </h2>
            </div>
          </div>
          <div
            className={cn(
              "ml-auto flex flex-col gap-2 text-base max-sm:ml-0 sm:gap-4 lg:gap-6 lg:text-xl",
              WHY_WORK_COLUMN_CLASS,
            )}
          >
            {WHY_WORK_PARAGRAPHS.map((text) => (
              <p key={text} data-why-text>
                {text}
              </p>
            ))}
          </div>
        </header>

        <div ref={trackRef} className="lg:h-[300vh]">
          <div className="lg:sticky lg:top-[10%] lg:h-screen lg:w-full">
            <ul className="flex flex-wrap gap-4 lg:flex-nowrap">
              {WHY_WORK_CARDS.map(({ label, value, Visual }) => (
                <li
                  key={value}
                  data-why-card
                  className="relative flex h-87.5 flex-[160px] items-center justify-center overflow-clip rounded-2xl bg-peach sm:flex-[200px] md:rounded-3xl lg:h-170 lg:w-full lg:flex-none lg:rounded-[40px]"
                >
                  <Visual
                    aria-hidden
                    className="pointer-events-none absolute right-0 bottom-0 h-auto w-23.25 lg:w-auto"
                  />
                  <p className="absolute top-4 right-4 left-4 lg:right-auto text-base font-extrabold text-black-secondary uppercase sm:top-5 sm:left-5 lg:top-10 lg:left-10 lg:text-xl">
                    {label}
                  </p>
                  <p className="font-heading text-(length:--_typography---font-sizes--body--badge) leading-none tracking-[-0.01em] text-black-secondary">
                    {value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
