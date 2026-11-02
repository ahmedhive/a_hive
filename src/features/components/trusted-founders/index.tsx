"use client";

import Image from "next/image";
import { CustomButton } from "@/components";
import { cn } from "@/lib";
import {
  TRUSTED_BADGE,
  TRUSTED_CTA_HREF,
  TRUSTED_CTA_LABEL,
  TRUSTED_IMAGES,
  TRUSTED_STEP_DEG,
  TRUSTED_TITLE_ACCENT,
  TRUSTED_TITLE_LEAD,
  TRUSTED_Z_INDEX_BY_CARD,
} from "./trusted-founders.data";
import useTrustedFounders from "./use-trusted-founders";

// The badge and the gradient word always show at full strength; the rest of
// the content rests at half opacity on desktop and comes up on hover.
const DIMMED_CLASS = "motion-safe:min-[992px]:opacity-50";

export default function TrustedFounders() {
  const { sectionRef, wheelRef, contentRef } = useTrustedFounders();

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[70vh] items-center justify-center overflow-clip text-black-secondary min-[480px]:min-h-[90vh] min-[768px]:min-h-[120vh] min-[992px]:min-h-[150vh] min-[1920px]:min-h-[200vh]"
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
        <p className="absolute -top-8.25 left-2.25 -z-1 -rotate-7 bg-lilac px-3 py-2 font-heading text-(length:--_typography---font-sizes--body--badge) leading-none tracking-[-0.01em] text-black min-[480px]:-top-11.5 min-[480px]:left-7 min-[480px]:-rotate-15 min-[480px]:px-4 min-[480px]:py-3 min-[768px]:-top-13 min-[992px]:-top-18 min-[992px]:left-22.25 min-[992px]:px-7 min-[992px]:py-4 min-[1920px]:-top-19.75 min-[1920px]:left-29.5">
          {TRUSTED_BADGE}
        </p>
        <p className="mb-5 max-w-[10ch] font-heading text-(length:--_typography---font-sizes--heading--h3) leading-none uppercase min-[480px]:mb-6 min-[992px]:mb-8">
          <span data-trusted-dim className={DIMMED_CLASS}>
            {TRUSTED_TITLE_LEAD}
          </span>{" "}
          <span className="bg-linear-to-b from-[#ee1515] from-0% to-[#ff691e] to-100% bg-clip-text text-transparent">
            {TRUSTED_TITLE_ACCENT}
          </span>
        </p>
        <div data-trusted-dim className={DIMMED_CLASS}>
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
            className="absolute bottom-0 left-1/2 w-[18vw] origin-bottom pb-[30vw] max-[767px]:w-25 max-[767px]:pb-43.75 max-[479px]:w-20 max-[479px]:pb-32.75 min-[992px]:w-[14vw] min-[992px]:pb-[22vw] min-[1920px]:w-65"
          >
            <Image
              src={image}
              alt=""
              sizes="(min-width: 992px) 14vw, 18vw"
              className={cn(
                "h-auto w-full rounded-lg object-cover",
                "min-[480px]:rounded-2xl min-[768px]:rounded-3xl min-[992px]:rounded-[40px]",
              )}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
