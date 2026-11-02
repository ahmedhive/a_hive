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
    <section className="overflow-clip px-[5%] pb-16 text-black-secondary min-[480px]:pb-20 min-[992px]:pb-25 min-[1440px]:pb-37.5">
      <div className="mx-auto w-full max-w-420">
        <header className="relative mb-13 text-center min-[992px]:mb-20">
          <h2
            ref={titleRef}
            className="text-(length:--_typography---font-sizes--heading--h2) leading-none font-normal tracking-[-0.03em] uppercase"
          >
            {FEEDBACK_TITLE}
          </h2>
          {/* Sticker: offsets and padding follow the reference's
              breakpoints; hidden at 479px and below. */}
          <p
            ref={badgeRef}
            className="absolute top-10 left-53.75 hidden -rotate-15 bg-amber px-9 py-5 font-heading text-(length:--_typography---font-sizes--body--badge) leading-[0.8] tracking-[-0.01em] max-[991px]:top-6 max-[991px]:left-37.5 max-[991px]:px-5 max-[991px]:py-3 max-[767px]:top-3.75 max-[767px]:left-26 max-[767px]:px-4 max-[767px]:py-2 min-[480px]:block min-[1920px]:top-18.5 min-[1920px]:left-80.25"
          >
            {FEEDBACK_BADGE}
          </p>
        </header>

        <ul
          ref={cardsRef}
          className="grid gap-4 max-[991px]:grid-cols-2 max-[767px]:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-[479px]:grid-cols-1 min-[992px]:flex min-[992px]:items-center min-[992px]:justify-center min-[992px]:gap-4 min-[992px]:pt-17 min-[1440px]:pt-18.25 min-[1920px]:pt-16.25"
        >
          {TESTIMONIALS.map(({ quote, name, role, dark, image }, index) => (
            <li
              key={name}
              className={cn(
                "relative min-[992px]:w-[30vw] min-[992px]:max-w-115 min-[992px]:hover:z-1",
                index > 0 && "min-[992px]:ml-[-10vw] min-[1920px]:ml-[-6vw]",
                index === 1 && "min-[992px]:mt-[-8vw] min-[1920px]:mt-[-5vw]",
              )}
            >
              <article
                className={cn(
                  "flex h-full flex-col min-[992px]:rotate-(--tilt) min-[992px]:scale-(--hover-scale) justify-between rounded-3xl p-5 min-[480px]:p-6 min-[768px]:min-h-122.5 min-[992px]:min-h-155 min-[992px]:rounded-[40px] min-[992px]:p-8",
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
                    "mb-13 gap-1 min-[992px]:mb-0",
                    dark ? "text-amber" : "text-flame",
                  )}
                  starClassName="size-5 shrink-0 min-[992px]:size-7.5"
                />
                <div>
                  <blockquote className="mb-5 text-base leading-[1.4] min-[768px]:mb-6 min-[768px]:text-xl min-[992px]:mb-10 min-[992px]:text-2xl min-[1920px]:text-[28px]">
                    {quote}
                  </blockquote>
                  <div className="flex items-center gap-2 min-[992px]:gap-3">
                    <Image
                      src={image}
                      alt=""
                      sizes="64px"
                      className="size-12 shrink-0 rounded-full object-cover min-[480px]:size-14 min-[992px]:size-16"
                    />
                    <div>
                      <p className="mb-1 font-heading text-base leading-[0.8] min-[768px]:text-xl min-[992px]:mb-2 min-[992px]:text-2xl">
                        {name}
                      </p>
                      <p className="text-base min-[768px]:text-lg">{role}</p>
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
