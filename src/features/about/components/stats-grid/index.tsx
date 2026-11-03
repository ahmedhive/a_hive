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
      className="relative overflow-clip pt-10 pb-16 min-[480px]:pt-12 min-[480px]:pb-20 min-[768px]:pt-16 min-[768px]:pb-25 min-[992px]:pt-20 min-[992px]:pb-37.5"
    >
      <div className="grid grid-cols-[1fr_0.5fr_0.5fr] gap-3 max-[767px]:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] max-[479px]:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {/* Spans both rows beside the boxes; a full row on top at 767px and
            below, and dropped entirely at 479px and below. */}
        <div className="relative row-span-2 overflow-clip rounded-[30px] max-[991px]:rounded-[20px] max-[767px]:col-span-2 max-[767px]:row-span-1 max-[767px]:aspect-1376/768 max-[767px]:rounded-2xl max-[479px]:hidden">
          <Image
            src={AboutStatsGridImg}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {STATS.map(
          ({ value, label, boxClassName, visual, visualClassName }) => (
            <div
              key={value}
              style={{ backgroundImage: `url(${visual.src})` }}
              className={cn(
                "flex min-h-82.5 flex-col justify-between rounded-[30px] bg-no-repeat px-8 py-6 max-[991px]:min-h-0 max-[991px]:rounded-[20px] max-[991px]:p-5 max-[767px]:rounded-2xl min-[1920px]:min-h-107.5 min-[1920px]:p-12",
                boxClassName,
                visualClassName,
              )}
            >
              <p className="max-w-[16ch] text-base leading-[1.3] max-[991px]:mb-12 min-[768px]:text-xl min-[992px]:text-2xl">
                {label}
              </p>
              <StatCounter value={value} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
