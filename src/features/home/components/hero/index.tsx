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
  } = useHero();

  return (
    <section
      ref={sectionRef}
      className="relative flex h-dvh flex-col gap-4 justify-between overflow-clip bg-white pt-[13dvh] pb-[5dvh] text-white-secondary"
    >
      <div className="relative z-10 text-center flex-1 sm:flex-none">
        <h1 ref={titleRef} className="text-[19vw] leading-none">
          {HERO_TITLE}
        </h1>
      </div>

      {/* Direct flex child of section (sibling of the title div and the
          socials/stat row below), so the section's own `justify-between`
          distributes real space between all three — not just between the
          title and "everything else" the way a single shared wrapper would. */}
      <div className="relative z-30 flex w-full flex-col items-center justify-between gap-4 px-[6vw] sm:flex-row">
        <h2
          ref={subtitleRef}
          className="text-left text-[clamp(44px,4.44vw,64px)] leading-none tracking-[-0.0405em] self-start"
        >
          {HERO_SUBTITLE_LINES[0]} <br />
          {HERO_SUBTITLE_LINES[1]}
        </h2>
        <p
          ref={descriptionRef}
          className="max-w-[clamp(280px,31.25vw,450px)] text-left text-[clamp(16px,1.25vw,18px)] font-medium leading-[1.5556] self-start"
        >
          {HERO_DESCRIPTION}
        </p>
      </div>

      {/* Third direct flex child of section — see the comment on the
          subtitle row above for why this is a sibling rather than nested
          inside a shared wrapper. */}
      <div className="relative z-30 flex w-full flex-col-reverse items-center justify-between gap-4 px-[6vw] sm:flex-row">
        <div
          ref={socialLinksRef}
          className="flex items-center justify-center gap-3 self-start sm:self-center"
        >
          <p className="text-[clamp(16px,1.39vw,20px)] font-medium leading-normal">
            Reach via
          </p>
          <div className="h-px w-10 bg-white-secondary" />
          <div className="flex gap-4">
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
          className="flex items-center justify-center gap-4 self-start sm:self-center"
        >
          <StatBadgeIcon
            className="h-[clamp(52px,calc(2.5vw+24px),60px)]
              w-[clamp(42.77px,calc(2.056vw+19.74px),49.35px)]"
          />
          <div>
            <p className="font-heading text-[clamp(28px,2.5vw,36px)] leading-none">
              {HERO_STAT.value}
            </p>
            <p className="text-[16px]">{HERO_STAT.label}</p>
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
        {/* Full-width (not framed on the sides — a percentage left/right
            inset crops the photo far more aggressively on narrow screens,
            since object-cover has to fill a proportionally much smaller
            box), bottom-anchored, with just the top inset from Figma
            (157px of the 900px frame = 17.44%), clamped so it can't shrink
            past a usable minimum on short/mobile viewports or grow past the
            exact Figma value on tall ones. */}
        <div className="absolute inset-x-0 top-0 lg:top-[clamp(40px,10%,157px)] bottom-0">
          <Image
            src={HeroForegroundImg}
            alt=""
            fill
            preload
            sizes="(min-width: 0px) 100vw"
            className="object-cover lg:object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
