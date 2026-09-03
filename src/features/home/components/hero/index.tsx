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
      className="relative flex h-dvh flex-col justify-between overflow-clip bg-white pt-[13dvh] pb-[5dvh] text-white-secondary"
    >
      <div className="relative z-10 text-center">
        <h1 ref={titleRef} className="text-[19vw] leading-none">
          {HERO_TITLE}
        </h1>
      </div>

      {/* Direct flex child of section (sibling of the title div and the
          socials/stat row below), so the section's own `justify-between`
          distributes real space between all three — not just between the
          title and "everything else" the way a single shared wrapper would. */}
      <div className="relative z-30 flex w-full max-w-[1680px] flex-col items-center justify-between gap-4 px-[6vw] sm:flex-row">
        <h2
          ref={subtitleRef}
          className="text-left text-[4.44vw] leading-none tracking-[-0.0405em]"
        >
          {HERO_SUBTITLE_LINES[0]} <br />
          {HERO_SUBTITLE_LINES[1]}
        </h2>
        <p
          ref={descriptionRef}
          className="max-w-112.5 text-left text-[1.25vw] font-medium leading-[1.5556]"
        >
          {HERO_DESCRIPTION}
        </p>
      </div>

      {/* Third direct flex child of section — see the comment on the
          subtitle row above for why this is a sibling rather than nested
          inside a shared wrapper. */}
      <div className="relative z-30 flex w-full max-w-[1680px] flex-col items-center justify-between gap-4 px-[6vw] sm:flex-row">
        <div
          ref={socialLinksRef}
          className="flex items-center justify-center gap-3"
        >
          <p className="text-[1.39vw] font-medium leading-normal">Reach via</p>
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

        <div ref={statRef} className="flex items-center justify-center gap-4">
          <StatBadgeIcon className="h-[4.165vw] w-[3.426vw]" />
          <div>
            <p className="font-heading text-[2.5vw] leading-none">
              {HERO_STAT.value}
            </p>
            <p className="text-[1.11vw]">{HERO_STAT.label}</p>
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
        <div className="absolute inset-0 scale-110">
          <Image
            src={HeroForegroundImg}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
