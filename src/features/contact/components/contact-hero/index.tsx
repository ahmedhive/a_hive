"use client";

import { Caption } from "@/components";
import { useHeroReveal } from "@/lib";
import {
  CONTACT_CAPTION_EMPHASIS,
  CONTACT_CAPTION_PREFIX,
  CONTACT_CAPTION_SUFFIX,
  CONTACT_TITLE,
} from "./contact-hero.data";

export default function ContactHero() {
  const { captionRef, titleRef } = useHeroReveal();

  return (
    <section className="px-[5%] pt-30 pb-10 text-black-secondary sm:pb-15 md:pt-37.5 lg:pt-46 2xl:pt-68.25">
      <div className="mx-auto flex w-full max-w-420 flex-col items-center text-center">
        <div ref={captionRef}>
          <Caption
            prefix={CONTACT_CAPTION_PREFIX}
            emphasis={CONTACT_CAPTION_EMPHASIS}
            suffix={CONTACT_CAPTION_SUFFIX}
          />
        </div>
        <h1
          ref={titleRef}
          className="mt-5 max-w-[22ch] text-[clamp(2.75rem,1.4757rem+5.4369vw,5rem)] leading-none font-normal tracking-[0.01em] uppercase md:mt-6 lg:mt-10"
        >
          {CONTACT_TITLE}
        </h1>
      </div>
    </section>
  );
}
