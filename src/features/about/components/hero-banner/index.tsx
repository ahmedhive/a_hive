"use client";

import Image from "next/image";
import { AboutHeaderImg } from "@/assets/images";
import { Caption, StarRating } from "@/components";
import {
  HERO_AVATARS,
  HERO_CAPTION_EMPHASIS,
  HERO_CAPTION_PREFIX,
  HERO_CAPTION_SUFFIX,
  HERO_RATING,
  HERO_RATING_LABEL,
  HERO_STAR_COUNT,
  HERO_TITLE_AFTER,
  HERO_TITLE_BEFORE,
} from "./hero-banner.data";
import useHeroBanner from "./use-hero-banner";

export default function HeroBanner() {
  const { captionRef, titleRef } = useHeroBanner();

  return (
    <section className="relative overflow-clip px-[5%] pt-30 pb-16 text-black-secondary min-[480px]:pb-20 min-[768px]:pt-37.5 min-[768px]:pb-25 min-[992px]:pt-46 min-[992px]:pb-37.5 min-[1440px]:pt-68.25 min-[1920px]:overflow-visible">
      {/* Soft glow behind the content, anchored to the section's bottom. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 aspect-square w-screen -translate-x-1/2 rounded-full bg-linear-to-b from-white from-30% to-wine opacity-20 min-[480px]:w-[90vw] min-[992px]:w-[75vw] min-[1440px]:w-303"
      />

      <div className="relative mx-auto flex w-full max-w-420 flex-col items-center text-center">
        <div ref={captionRef}>
          <Caption
            prefix={HERO_CAPTION_PREFIX}
            emphasis={HERO_CAPTION_EMPHASIS}
            suffix={HERO_CAPTION_SUFFIX}
          />
        </div>

        <h1
          ref={titleRef}
          className="my-6 max-w-[32ch] text-[clamp(2.75rem,1.4757rem+5.4369vw,5rem)] leading-none font-normal tracking-[0.01em] uppercase min-[480px]:my-8 min-[768px]:my-9 min-[992px]:my-12"
        >
          {HERO_TITLE_BEFORE}
          <span
            data-hero-image
            aria-hidden
            className="mx-1 inline-block aspect-95/44 w-18.75 overflow-hidden rounded-full align-middle min-[480px]:w-22.5 min-[768px]:w-27.5 min-[992px]:mx-2 min-[992px]:w-37.5 min-[1920px]:w-52.5"
          >
            <Image
              src={AboutHeaderImg}
              alt=""
              sizes="210px"
              className="size-full object-cover"
            />
          </span>
          {HERO_TITLE_AFTER}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div aria-hidden className="flex">
            {HERO_AVATARS.map((avatar) => (
              <Image
                key={avatar.src}
                src={avatar}
                alt=""
                sizes="48px"
                className="-ml-5 size-9.75 rounded-full border-2 border-white object-cover first:ml-0 min-[768px]:size-12"
              />
            ))}
          </div>
          <div className="text-left">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-base leading-none font-bold min-[768px]:text-xl min-[992px]:text-2xl">
                {HERO_RATING}
              </p>
              <StarRating
                count={HERO_STAR_COUNT}
                label={`${HERO_RATING} out of ${HERO_STAR_COUNT} stars`}
                className="w-25 text-tangerine min-[992px]:w-31"
                starClassName="flex-1"
              />
            </div>
            <p className="text-base">{HERO_RATING_LABEL}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
