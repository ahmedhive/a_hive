"use client";

import Image from "next/image";
import { StatBadgeIcon } from "@/assets/icons";
import { HeroForegroundImg } from "@/assets/images";
import {
  HERO_DESCRIPTION,
  HERO_SOCIAL_LINKS,
  HERO_STAT,
  HERO_SUBTITLE_LINES,
  HERO_TITLE,
} from "./hero.data";
import useHero from "./use-hero";

export default function Hero() {
  const {
    sectionRef,
    bgRef,
    imageRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    socialLinksRef,
    statRef,
    neckLineSpacerRef,
    subtitleRowRef,
    contentBlockRef,
    foregroundImgRef,
    handleForegroundImageLoad,
  } = useHero();

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-258 flex-col justify-between overflow-clip bg-white pt-27.5 pb-8 text-white-secondary
        sm:h-auto sm:block sm:pb-16
        md:pt-32.5 md:pb-25
        lg:pt-37.5 lg:pb-37.5
        xl:pt-42.5"
    >
      <div
        className="relative z-10 mb-7 text-center
          sm:mb-45
          md:mb-57.5
          lg:mb-45"
      >
        <h1 ref={titleRef} className="text-[19vw] leading-none font-bold">
          {HERO_TITLE}
        </h1>
      </div>

      <div className="relative z-30 mt-112 px-[5%] sm:mt-12 md:mt-0">
        {/* Height is 0 by default (matching use-hero.ts's own reset value,
            so there's no hydration mismatch) and only ever grows into
            space that already exists but sits unused below the content at
            this breakpoint (sm:+ block layout doesn't redistribute
            min-height's leftover space toward content the way flex does) —
            see recomputeNeckLineGap's "tier 0" for why this is free (never
            moves the image) up to that existing amount, and a no-op
            otherwise. */}
        <div ref={neckLineSpacerRef} aria-hidden style={{ height: 0 }} />
        <div ref={contentBlockRef} className="mx-auto w-full max-w-[1680px]">
          {/* mb-* here is the baseline gap; use-hero.ts's
              recomputeNeckLineGap can additionally shrink it (never grow it
              past this) via an inline marginBottom override, as a safety
              net for the cases where this baseline still isn't enough to
              keep the row below from overlapping the person's face/beard —
              see that function for why shrinking this specific gap is the
              lever (the image is bottom-anchored, so growing anything
              can't create separation, but this wrapper's own bottom is
              itself pinned near the section's bottom, so shrinking this
              gap pushes its top — and everything in it — down by close to
              the same amount). */}
          <div
            ref={subtitleRowRef}
            className="mb-8 flex flex-col items-center justify-between gap-x-6 gap-y-4
              sm:mb-10 sm:flex-row sm:flex-wrap sm:items-center
              md:mb-18 md:flex-nowrap md:gap-y-6
              lg:mb-62.5"
          >
            <h2
              ref={subtitleRef}
              className="text-center text-[44px] leading-none tracking-tight
                sm:text-left sm:text-[8vw]
                lg:text-[6vw]
                3xl:text-[96px]"
            >
              {HERO_SUBTITLE_LINES[0]}{" "}
              {/* Below sm, this drops max-width entirely and lets the text
                  wrap naturally (so it's 1 line or 2 depending on the exact
                  width) — this <br> is hidden there and only forces the
                  2-line break at sm+, where the earlier max-width:12ch
                  approach was too font-metric-fragile to land reliably. */}
              <br className="hidden sm:block" />
              {HERO_SUBTITLE_LINES[1]}
            </h2>
            <p
              ref={descriptionRef}
              className="max-w-none text-center text-[16px] font-medium leading-[1.4] tracking-[-0.01em]
                sm:text-left
                md:max-w-75
                lg:max-w-112.5 lg:text-[20px]"
            >
              {HERO_DESCRIPTION}
            </p>
          </div>

          <div
            className="flex flex-col items-center gap-6
              sm:flex-row sm:items-center sm:justify-between sm:gap-0"
          >
            <div
              ref={socialLinksRef}
              className="flex items-center justify-center gap-3"
            >
              <p className="text-[16px] font-medium leading-normal tracking-tight lg:text-[20px]">
                Reach via
              </p>
              <div className="h-px w-10 bg-white-secondary" />
              <div className="flex gap-2">
                {HERO_SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    aria-label="social link"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            <div
              ref={statRef}
              className="flex items-center justify-center gap-4
                md:gap-5
                lg:gap-6"
            >
              <StatBadgeIcon className="size-8.5 md:size-10 lg:size-12.75" />
              <div>
                <p className="mb-1 font-heading text-(length:--_typography---font-sizes--heading--h5) leading-none font-bold">
                  {HERO_STAT.value}
                </p>
                <p className="text-[16px] font-normal tracking-[-0.01em]">
                  {HERO_STAT.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separate from imageRef (and given no z-index, so it stays below the
          z-10 text) since GSAP's transform on imageRef creates its own
          stacking context — anything inside imageRef would be forced to
          paint as one atomic unit relative to the text. bg and imageRef are
          tweened together in use-hero.ts so they still scale in as one
          visual layer despite being separate elements. */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ background: "var(--gradient-wine)" }}
      />

      <div ref={imageRef} className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute inset-x-0 bottom-0 h-full scale-110 sm:scale-100 lg:translate-y-20 xl:translate-y-70">
          <Image
            ref={foregroundImgRef}
            src={HeroForegroundImg}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-bottom"
            onLoad={handleForegroundImageLoad}
          />
        </div>
      </div>
    </section>
  );
}
