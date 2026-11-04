"use client";

import Image from "next/image";
import { DesignShapeIcon, ScrollIndicatorIcon } from "@/assets/icons";
import { ServicesHeaderImg } from "@/assets/images";
import { Caption } from "@/components";
import {
  HERO_CAPTION_EMPHASIS,
  HERO_CAPTION_PREFIX,
  HERO_CAPTION_SUFFIX,
  HERO_TITLE_AFTER,
  HERO_TITLE_BEFORE,
  HERO_TITLE_FIRST_LINE,
} from "./hero-banner.data";
import useHeroBanner from "./use-hero-banner";

export default function HeroBanner() {
  const { captionRef, titleRef, cueRef } = useHeroBanner();

  return (
    <section className="relative mx-auto max-w-480 overflow-clip px-[5%] pt-30 pb-10 text-black-secondary md:pt-37.5 lg:pt-46 lg:pb-20 xl:pt-68.25">
      {/* Two soft orbs, one in each upper and lower corner. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-0 aspect-square w-[45vw] rounded-full bg-dusk opacity-10 2xl:w-186.5" />
        <div className="absolute top-0 right-0 aspect-square w-[45vw] rounded-full bg-dawn opacity-10 2xl:w-186.5" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mx-auto max-w-373"
      >
        <DesignShapeIcon className="absolute top-52 right-4 h-auto w-15 sm:top-60 sm:right-9 sm:w-24 lg:right-18 lg:w-35.5 xl:right-28 2xl:top-73 2xl:right-45.5" />
      </div>

      <div className="relative mx-auto flex w-full max-w-420 flex-col items-center gap-8 text-center lg:gap-12">
        <div ref={captionRef}>
          <Caption
            prefix={HERO_CAPTION_PREFIX}
            emphasis={HERO_CAPTION_EMPHASIS}
            suffix={HERO_CAPTION_SUFFIX}
          />
        </div>

        <h1
          ref={titleRef}
          className="max-w-[24ch] text-[clamp(2.75rem,1.4757rem+5.4369vw,5rem)] leading-none font-normal tracking-[0.01em] uppercase"
        >
          {HERO_TITLE_FIRST_LINE} <br aria-hidden className="hidden lg:block" />
          {HERO_TITLE_BEFORE}
          <span
            data-hero-image
            aria-hidden
            className="mx-1 inline-block aspect-95/44 w-18.75 overflow-hidden rounded-full align-middle sm:w-22.5 md:w-27.5 lg:mx-2 lg:w-37.5 2xl:w-52.5"
          >
            <Image
              src={ServicesHeaderImg}
              alt=""
              sizes="210px"
              className="size-full object-cover"
            />
          </span>
          {HERO_TITLE_AFTER}
        </h1>

        <div
          aria-hidden
          className="flex aspect-1/2 w-7 items-center justify-center rounded-full border border-stroke sm:w-8 lg:w-10"
        >
          <div ref={cueRef} className="flex w-3 sm:w-3.5 lg:w-4">
            <ScrollIndicatorIcon className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
