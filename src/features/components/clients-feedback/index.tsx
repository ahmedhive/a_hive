"use client";

import Image from "next/image";
import { CSSProperties } from "react";
import { StarRating } from "@/components";
import { cn } from "@/lib";
import {
  FEEDBACK_BADGE,
  FEEDBACK_STAR_COUNT,
  FEEDBACK_TILT_DEG,
  FEEDBACK_TITLE,
  TESTIMONIALS,
} from "./clients-feedback.data";
import useClientsFeedback from "./use-clients-feedback";

export default function ClientsFeedback() {
  const { titleRef, badgeRef, cardsRef } = useClientsFeedback();

  return (
    <section className="overflow-clip px-[5%] pb-16 text-black-secondary sm:pb-20 lg:pb-25 xl:pb-37.5">
      <div className="mx-auto w-full max-w-420">
        <header className="relative mb-13 text-center lg:mb-20">
          <h2
            ref={titleRef}
            className="text-(length:--_typography---font-sizes--heading--h2) leading-none font-normal tracking-[-0.03em] uppercase"
          >
            {FEEDBACK_TITLE}
          </h2>
          {/* Sticker: offsets and padding follow the reference's
              breakpoints; hidden below 640px. */}
          <p
            ref={badgeRef}
            className="absolute top-10 left-53.75 hidden -rotate-15 bg-amber px-9 py-5 font-heading text-(length:--_typography---font-sizes--body--badge) leading-[0.8] tracking-[-0.01em] max-lg:top-6 max-lg:left-37.5 max-lg:px-5 max-lg:py-3 max-md:top-3.75 max-md:left-26 max-md:px-4 max-md:py-2 sm:block 2xl:top-18.5 2xl:left-80.25"
          >
            {FEEDBACK_BADGE}
          </p>
        </header>

        <ul
          ref={cardsRef}
          className="grid gap-4 max-lg:grid-cols-2 max-md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-sm:grid-cols-1 lg:flex lg:items-center lg:justify-center lg:gap-4 lg:pt-17 xl:pt-18.25 2xl:pt-16.25"
        >
          {TESTIMONIALS.map(({ quote, name, role, dark, image }, index) => (
            <li
              key={name}
              className={cn(
                "relative lg:w-[30vw] lg:max-w-115 lg:hover:z-1",
                index > 0 && "lg:ml-[-10vw] 2xl:ml-[-6vw]",
                index === 1 && "lg:mt-[-8vw] 2xl:mt-[-5vw]",
              )}
            >
              <article
                className={cn(
                  "flex h-full flex-col lg:rotate-(--tilt) lg:scale-(--hover-scale) justify-between rounded-3xl p-5 sm:p-6 md:min-h-122.5 lg:min-h-155 lg:rounded-[40px] lg:p-8",
                  dark ? "bg-taupe text-white" : "bg-mist text-black-secondary",
                )}
                style={
                  {
                    "--tilt": `${FEEDBACK_TILT_DEG[index]}deg`,
                    "--hover-scale": 1,
                  } as CSSProperties
                }
              >
                <StarRating
                  count={FEEDBACK_STAR_COUNT}
                  label={`${FEEDBACK_STAR_COUNT} out of ${FEEDBACK_STAR_COUNT} stars`}
                  className={cn(
                    "mb-13 gap-1 lg:mb-0",
                    dark ? "text-amber" : "text-flame",
                  )}
                  starClassName="size-5 shrink-0 lg:size-7.5"
                />
                <div>
                  <blockquote className="mb-5 text-base leading-[1.4] md:mb-6 md:text-xl lg:mb-10 lg:text-2xl 2xl:text-[28px]">
                    {quote}
                  </blockquote>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Image
                      src={image}
                      alt=""
                      sizes="64px"
                      className="size-12 shrink-0 rounded-full object-cover sm:size-14 lg:size-16"
                    />
                    <div>
                      <p className="mb-1 font-heading text-base leading-[0.8] md:text-xl lg:mb-2 lg:text-2xl">
                        {name}
                      </p>
                      <p className="text-base md:text-lg">{role}</p>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
