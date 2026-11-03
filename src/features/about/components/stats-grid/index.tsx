"use client";

import Image from "next/image";
import { AboutStatsGridImg } from "@/assets/images";
import { cn } from "@/lib";
import { StatCounter } from "./components";
import { STATS } from "./stats-grid.data";
import useStatsGrid from "./use-stats-grid";

export default function StatsGrid() {
  const { sectionRef } = useStatsGrid();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip pt-10 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-25 lg:pt-20 lg:pb-37.5"
    >
      <div className="grid grid-cols-[1fr_0.5fr_0.5fr] gap-3 max-md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] max-sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {/* Spans both rows beside the boxes; a full row on top below 768px,
            and dropped entirely below 640px. */}
        <div className="relative row-span-2 overflow-clip rounded-[30px] max-lg:rounded-[20px] max-md:col-span-2 max-md:row-span-1 max-md:aspect-1376/768 max-md:rounded-2xl max-sm:hidden">
          <Image
            src={AboutStatsGridImg}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {STATS.map(
          ({ value, label, boxClassName, Visual, visualClassName }) => (
            <div
              key={value}
              className={cn(
                "relative flex min-h-82.5 flex-col justify-between overflow-clip rounded-[30px] px-8 py-6 max-lg:min-h-0 max-lg:rounded-[20px] max-lg:p-5 max-md:rounded-2xl 2xl:min-h-107.5 2xl:p-12",
                boxClassName,
              )}
            >
              <Visual
                aria-hidden
                className={cn("pointer-events-none absolute", visualClassName)}
              />
              <p className="relative max-w-[16ch] text-base leading-[1.3] max-lg:mb-12 md:text-xl lg:text-2xl">
                {label}
              </p>
              <StatCounter value={value} className="relative" />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
