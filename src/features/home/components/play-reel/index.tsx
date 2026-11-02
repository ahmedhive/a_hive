"use client";

import { PauseIcon, PlayIcon } from "@/assets/icons";
import { cn } from "@/lib";
import {
  REEL_LABEL,
  REEL_POSTER_SRC,
  REEL_VIDEO_SRC,
  REEL_WORDS,
} from "./play-reel.data";
import usePlayReel from "./use-play-reel";

const WORD_CLASS =
  "absolute top-1/2 z-10 -translate-y-1/2 font-heading text-(length:--_typography---font-sizes--heading--h3) leading-none text-white uppercase mix-blend-difference motion-safe:min-[992px]:translate-x-0 motion-safe:min-[992px]:opacity-0";

export default function PlayReel() {
  const {
    trackRef,
    maskRef,
    firstWordRef,
    lastWordRef,
    videoRef,
    playing,
    toggle,
  } = usePlayReel();
  return (
    <section className="overflow-clip px-[5%] py-25 motion-safe:min-[992px]:px-0 motion-safe:min-[992px]:py-0">
      <h2 className="sr-only">{REEL_LABEL}</h2>

      <div ref={trackRef} className="motion-safe:min-[992px]:h-[250vh]">
        <div className="flex w-full items-center justify-center motion-safe:min-[992px]:sticky motion-safe:min-[992px]:top-0 motion-safe:min-[992px]:h-screen">
          <div className="relative flex size-full items-center justify-center">
            <div
              ref={maskRef}
              className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl min-[480px]:rounded-[20px] min-[768px]:rounded-3xl motion-safe:min-[992px]:h-[40vh] motion-safe:min-[992px]:w-[50vw] motion-safe:min-[992px]:rounded-[40px]"
            >
              <div className="relative aspect-3/2 w-full motion-safe:min-[992px]:aspect-auto motion-safe:min-[992px]:h-screen motion-safe:min-[992px]:w-screen motion-safe:min-[992px]:flex-none">
                <video
                  ref={videoRef}
                  src={REEL_VIDEO_SRC}
                  poster={REEL_POSTER_SRC}
                  aria-label={REEL_LABEL}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause reel" : "Play reel"}
                  className="absolute top-1/2 left-1/2 z-20 grid aspect-square w-15 -translate-1/2 cursor-pointer place-items-center rounded-full border border-white/50 bg-white/20 text-white backdrop-blur-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[480px]:w-20 min-[1440px]:w-30 motion-safe:min-[992px]:w-25"
                >
                  {playing ? (
                    <PauseIcon className="size-6 min-[480px]:size-7" />
                  ) : (
                    <PlayIcon className="size-6 min-[480px]:size-7" />
                  )}
                </button>
              </div>
            </div>

            <h3
              ref={firstWordRef}
              aria-hidden
              className={cn(
                WORD_CLASS,
                "left-0 translate-x-[15vw] min-[480px]:translate-x-[22vw] min-[768px]:translate-x-[25vw]",
              )}
            >
              {REEL_WORDS[0]}
            </h3>
            <h3
              ref={lastWordRef}
              aria-hidden
              className={cn(
                WORD_CLASS,
                "right-0 translate-x-[-15vw] min-[480px]:translate-x-[-22vw] min-[768px]:translate-x-[-25vw]",
              )}
            >
              {REEL_WORDS[1]}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
