"use client";

import Image from "next/image";
import { CustomButton } from "@/components";
import { cn } from "@/lib";
import {
  TRUSTED_BADGE,
  TRUSTED_CTA_HREF,
  TRUSTED_CTA_LABEL,
  TRUSTED_DIMMED_CLASS,
  TRUSTED_IMAGES,
  TRUSTED_STEP_DEG,
  TRUSTED_TITLE_ACCENT,
  TRUSTED_TITLE_LEAD,
  TRUSTED_Z_INDEX_BY_CARD,
} from "./trusted-founders.data";
import useTrustedFounders from "./use-trusted-founders";

export default function TrustedFounders() {
  const { sectionRef, wheelRef, contentRef } = useTrustedFounders();

  return (
    <section
      ref={sectionRef}
      className="relative box-content flex min-h-[70vh] items-center justify-center overflow-clip py-16 text-black-secondary sm:min-h-[90vh] sm:py-20 md:min-h-[120vh] md:py-25 lg:min-h-[150vh] lg:py-30 2xl:min-h-[200vh]"
    >
      <h2 className="sr-only">
        {TRUSTED_TITLE_LEAD} {TRUSTED_TITLE_ACCENT}
      </h2>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Sits behind the title; offsets and padding follow the reference's
            breakpoints. */}
        <p className="absolute -top-8.25 left-2.25 -z-1 -rotate-7 bg-lilac px-3 py-2 font-heading text-(length:--_typography---font-sizes--body--badge) leading-none tracking-[-0.01em] text-black sm:-top-11.5 sm:left-7 sm:-rotate-15 sm:px-4 sm:py-3 md:-top-13 lg:-top-18 lg:left-22.25 lg:px-7 lg:py-4 2xl:-top-19.75 2xl:left-29.5">
          {TRUSTED_BADGE}
        </p>
        <p className="mb-5 max-w-[10ch] font-heading text-(length:--_typography---font-sizes--heading--h3) leading-none uppercase sm:mb-6 lg:mb-8">
          <span data-trusted-dim className={TRUSTED_DIMMED_CLASS}>
            {TRUSTED_TITLE_LEAD}
          </span>{" "}
          <span className="bg-flare bg-clip-text text-transparent">
            {TRUSTED_TITLE_ACCENT}
          </span>
        </p>
        <div data-trusted-dim className={TRUSTED_DIMMED_CLASS}>
          <CustomButton label={TRUSTED_CTA_LABEL} href={TRUSTED_CTA_HREF} />
        </div>
      </div>

      {/* The wheel: a zero-size pivot at the section's centre, with each card
          standing on it and rotated around it. The transform here is the
          fallback layout; the hook replaces it while motion is allowed. */}
      <div ref={wheelRef} aria-hidden className="absolute top-1/2 left-1/2">
        {TRUSTED_IMAGES.map((image, index) => (
          <div
            key={index}
            style={{
              zIndex: TRUSTED_Z_INDEX_BY_CARD[index + 1],
              transform: `translateX(-50%) rotate(${index * TRUSTED_STEP_DEG}deg)`,
            }}
            className="absolute bottom-0 left-1/2 w-[18vw] origin-bottom pb-[30vw] max-md:w-25 max-md:pb-43.75 max-sm:w-20 max-sm:pb-32.75 lg:w-[14vw] lg:pb-[22vw] 2xl:w-65"
          >
            <Image
              src={image}
              alt=""
              sizes="(min-width: 1024px) 14vw, 18vw"
              className={cn(
                "h-auto w-full rounded-lg object-cover",
                "sm:rounded-2xl md:rounded-3xl lg:rounded-[40px]",
              )}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
