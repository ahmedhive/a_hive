"use client";

import { useRef } from "react";
import { useTitleReveal } from "@/lib";
import { IChallengeProps } from "./challenge.interface";
import {
  BODY_TEXT_CLASS,
  SECTION_CLASS,
  SECTION_TITLE_CLASS,
} from "../../work-details.data";

export default function Challenge(props: IChallengeProps) {
  const { challenge } = props;
  const sectionRef = useRef<HTMLElement>(null);
  useTitleReveal(sectionRef);

  return (
    <section ref={sectionRef} className={SECTION_CLASS}>
      <div className="mx-auto flex w-full max-w-420 flex-wrap justify-between gap-x-10 gap-y-6 sm:flex-nowrap">
        <h2 data-title className={SECTION_TITLE_CLASS}>
          {challenge.title}
        </h2>
        <div className="flex w-full max-w-202.5 flex-col gap-5 sm:w-[59%] md:gap-6 lg:gap-10">
          <p className="text-xl tracking-[-0.01em] md:text-2xl lg:text-[30px]">
            {challenge.lead}
          </p>
          <p className={BODY_TEXT_CLASS}>{challenge.text}</p>
        </div>
      </div>
    </section>
  );
}
