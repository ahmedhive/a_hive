"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTitleReveal } from "@/lib";
import { IWorkResultProps } from "./work-result.interface";
import {
  BODY_TEXT_CLASS,
  SECTION_CLASS,
  SECTION_TITLE_CLASS,
} from "../../work-details.data";

export default function WorkResult(props: IWorkResultProps) {
  const { result } = props;
  const sectionRef = useRef<HTMLElement>(null);
  useTitleReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={SECTION_CLASS}
      style={{ backgroundColor: result.bgColor }}
    >
      {/* From 640px the text column and every image stick near the top, so the
          images pile up over each other as they scroll past. */}
      <div className="mx-auto flex w-full max-w-420 flex-col items-start gap-8 sm:flex-row sm:gap-6 md:gap-10">
        <div className="flex w-full flex-col gap-4 sm:sticky sm:top-20 sm:w-1/2 sm:max-w-132.5 md:gap-5 lg:gap-6">
          <h2 data-title className={SECTION_TITLE_CLASS}>
            {result.title}
          </h2>
          <p className={BODY_TEXT_CLASS}>{result.text}</p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-1/2 sm:max-w-202.5 sm:gap-6 lg:gap-15">
          {result.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-81/70 w-full overflow-hidden rounded-2xl sm:sticky sm:top-20 sm:rounded-3xl lg:rounded-[40px]"
            >
              {/* The sticky box can't be the positioned parent of a fill image (Next
                warns), so the image sits in an absolutely positioned layer. */}
              <div className="absolute inset-0">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1680px) 810px, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
