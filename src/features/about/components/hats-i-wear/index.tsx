"use client";

import Image from "next/image";
import { HATS, HATS_BADGE, HATS_TITLE } from "./hats-i-wear.data";
import useHatsIWear from "./use-hats-i-wear";

export default function HatsIWear() {
  const { titleRef, badgeRef, trackRef } = useHatsIWear();

  return (
    <section className="px-[5%] pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-25 md:pb-25 lg:pt-37.5 lg:pb-37.5">
      <div className="mx-auto w-full max-w-420">
        <header className="relative mb-8 text-center md:mb-13 lg:mb-20">
          <h2
            ref={titleRef}
            className="text-(length:--_typography---font-sizes--heading--h2) leading-none font-normal tracking-[-0.03em] uppercase"
          >
            {HATS_TITLE}
          </h2>
          {/* Sticker: offsets and padding follow the reference's
              breakpoints; hidden below 640px. */}
          <p
            ref={badgeRef}
            className="absolute top-3.75 left-26 hidden -rotate-15 bg-sky px-4 py-2 font-heading text-(length:--_typography---font-sizes--body--badge) leading-[0.8] tracking-[-0.01em] sm:block md:top-6 md:left-37.5 md:px-5 md:py-3 lg:top-10 lg:left-53.75 lg:px-9 lg:py-5 2xl:top-18.5 2xl:left-80.25"
          >
            {HATS_BADGE}
          </p>
        </header>

        <div ref={trackRef} className="lg:h-[300vh]">
          <div className="lg:sticky lg:top-[10%] lg:h-screen lg:w-full">
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-4 gap-y-6 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4 xl:gap-10">
              {HATS.map(({ title, description, image, stairClassName }) => (
                <li key={title} data-hat-card className={stairClassName}>
                  <div className="relative mb-5 aspect-13/15 overflow-clip rounded-2xl md:mb-6 md:rounded-3xl lg:mb-8 lg:rounded-[40px]">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-(length:--_typography---font-sizes--body--badge) leading-none tracking-[-0.01em] uppercase">
                      {title}
                    </h3>
                    <p className="text-base">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
