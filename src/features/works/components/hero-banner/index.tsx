"use client";

import { Caption, CustomButton } from "@/components";
import { useHeroReveal } from "@/lib";
import {
  HERO_CAPTION_EMPHASIS,
  HERO_CAPTION_PREFIX,
  HERO_CAPTION_SUFFIX,
  HERO_CTA_HREF,
  HERO_CTA_LABEL,
  HERO_TITLE,
} from "./hero-banner.data";

export default function HeroBanner() {
  const { captionRef, titleRef } = useHeroReveal();

  return (
    <section className="relative overflow-clip px-[5%] pt-30 pb-16 text-black-secondary sm:pb-20 md:pt-37.5 md:pb-25 lg:pt-46 lg:pb-37.5 xl:pt-68.25">
      {/* Soft glow behind the content, anchored to the section's bottom. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 aspect-square w-screen -translate-x-1/2 rounded-full bg-halo opacity-20 sm:w-[90vw] lg:w-[75vw] xl:w-303"
      />

      <div className="relative mx-auto flex w-full max-w-420 flex-col items-center gap-6 text-center md:gap-9 lg:gap-12">
        <div ref={captionRef}>
          <Caption
            prefix={HERO_CAPTION_PREFIX}
            emphasis={HERO_CAPTION_EMPHASIS}
            suffix={HERO_CAPTION_SUFFIX}
          />
        </div>

        <h1
          ref={titleRef}
          className="max-w-[22ch] text-[clamp(2.75rem,1.4757rem+5.4369vw,5rem)] leading-none font-normal tracking-[0.01em] uppercase"
        >
          {HERO_TITLE}
        </h1>

        <CustomButton label={HERO_CTA_LABEL} href={HERO_CTA_HREF} />
      </div>
    </section>
  );
}
