"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib";
import {
  LIFE_DESCRIPTION,
  LIFE_MOMENTS,
  LIFE_TITLE,
} from "./life-behind-the-work.data";
import useLifeBehindTheWork from "./use-life-behind-the-work";

export default function LifeBehindTheWork() {
  const { titleRef, textRef, cardsRef } = useLifeBehindTheWork();

  return (
    <section className="overflow-clip px-[5%] py-16 sm:py-20 md:py-25 lg:py-37.5">
      <div className="mx-auto w-full max-w-420">
        <header className="mb-8 flex flex-col gap-3 text-center sm:mb-11 md:mb-13 md:gap-4 lg:mb-20">
          <h2
            ref={titleRef}
            className="text-(length:--_typography---font-sizes--heading--h3) leading-none font-normal tracking-[-0.01em] uppercase"
          >
            {LIFE_TITLE}
          </h2>
          <p ref={textRef} className="text-base lg:text-xl">
            {LIFE_DESCRIPTION}
          </p>
        </header>

        <ul
          ref={cardsRef}
          className="grid grid-cols-2 gap-4 lg:flex lg:items-center lg:justify-center lg:pt-17"
        >
          {LIFE_MOMENTS.map(({ image, tiltDeg, overlapClassName }, index) => (
            <li
              key={index}
              className={cn(
                "relative lg:w-[30vw] lg:max-w-115 lg:hover:z-10",
                overlapClassName,
              )}
            >
              <div
                style={
                  {
                    "--tilt": `${tiltDeg}deg`,
                    "--hover-scale": 1,
                  } as CSSProperties
                }
                className="relative aspect-23/31 rotate-(--tilt) overflow-clip rounded-2xl border-[11px] border-white shadow-[0_30px_80px_#0000001f] sm:rounded-[20px] sm:border-20 md:rounded-3xl lg:scale-(--hover-scale) lg:rounded-[40px]"
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 460px, 50vw"
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
