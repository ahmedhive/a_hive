"use client";

import { useRef } from "react";
import { StatCounter } from "@/components";
import { useCounterRoll, useTitleReveal } from "@/lib";
import { OVERVIEW_COUNTER_CLASS } from "./work-overview.data";
import { IWorkOverviewProps } from "./work-overview.interface";
import {
  BODY_TEXT_CLASS,
  SECTION_CLASS,
  SECTION_TITLE_CLASS,
} from "../../work-details.data";

export default function WorkOverview(props: IWorkOverviewProps) {
  const { overview } = props;
  const sectionRef = useRef<HTMLElement>(null);
  useTitleReveal(sectionRef);
  useCounterRoll(sectionRef);

  return (
    <section ref={sectionRef} className={SECTION_CLASS}>
      <div className="mx-auto flex w-full max-w-420 flex-wrap justify-between gap-10 sm:flex-nowrap">
        <div className="flex w-full flex-col gap-4 sm:w-[46%] sm:max-w-128.25 sm:gap-5 lg:gap-6">
          <h2 data-title className={SECTION_TITLE_CLASS}>
            {overview.title}
          </h2>
          <p className={BODY_TEXT_CLASS}>{overview.text}</p>
        </div>
        <ul className="grid w-full grid-cols-2 gap-x-10 gap-y-8 sm:w-1/2 sm:max-w-202.5 lg:gap-y-19">
          {overview.stats.map(({ value, label }) => (
            <li key={label} className="flex flex-col gap-2 lg:gap-4">
              <StatCounter value={value} className={OVERVIEW_COUNTER_CLASS} />
              <div className="h-px w-full bg-black-secondary/10" />
              <p className={BODY_TEXT_CLASS}>{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
