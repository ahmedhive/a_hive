"use client";

import Image from "next/image";
import { AboutHeaderImg } from "@/assets/images";
import { Caption, StarRating } from "@/components";
import { useHeroReveal } from "@/lib";
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

export default function HeroBanner() {
  const { captionRef, titleRef } = useHeroReveal();

  return (
    <section className="relative overflow-clip px-[5%] pt-30 pb-16 text-black-secondary sm:pb-20 md:pt-37.5 md:pb-25 lg:pt-46 lg:pb-37.5 xl:pt-68.25 2xl:overflow-visible">
      {/* Soft glow behind the content, anchored to the section's bottom. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 aspect-square w-screen -translate-x-1/2 rounded-full bg-halo opacity-20 sm:w-[90vw] lg:w-[75vw] xl:w-303"
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
          className="my-6 max-w-[32ch] text-[clamp(2.75rem,1.4757rem+5.4369vw,5rem)] leading-none font-normal tracking-[0.01em] uppercase sm:my-8 md:my-9 lg:my-12"
        >
          {HERO_TITLE_BEFORE}
          <span
            data-hero-image
            aria-hidden
            className="mx-1 inline-block aspect-95/44 w-18.75 overflow-hidden rounded-full align-middle sm:w-22.5 md:w-27.5 lg:mx-2 lg:w-37.5 2xl:w-52.5"
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
                sizes="64px"
                className="-ml-5 size-12.75 rounded-full border-2 border-white object-cover first:ml-0 md:-ml-6.5 md:size-16"
              />
            ))}
          </div>
          <div className="text-left">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-base leading-none font-bold md:text-xl lg:text-2xl">
                {HERO_RATING}
              </p>
              <StarRating
                count={HERO_STAR_COUNT}
                label={`${HERO_RATING} out of ${HERO_STAR_COUNT} stars`}
                className="w-25 text-tangerine lg:w-31"
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
