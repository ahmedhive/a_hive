"use client";

import { PauseIcon, PlayIcon } from "@/assets/icons";
import { cn } from "@/lib";
import {
  REEL_LABEL,
  REEL_POSTER_SRC,
  REEL_VIDEO_SRC,
  REEL_WORD_CLASS,
  REEL_WORD_TEXT_CLASS,
  REEL_WORD_TEXT_HIDDEN_CLASS,
  REEL_WORDS,
} from "./play-reel.data";
import usePlayReel from "./use-play-reel";

export default function PlayReel() {
  const {
    trackRef,
    maskRef,
    firstWordRef,
    lastWordRef,
    videoRef,
    playing,
    toggle,
    handleEnded,
  } = usePlayReel();
  return (
    <section className="overflow-clip px-[5%] py-25 motion-safe:lg:px-0 motion-safe:lg:py-0">
      <h2 className="sr-only">{REEL_LABEL}</h2>

      <div ref={trackRef} className="motion-safe:lg:h-[250vh]">
        <div className="flex w-full items-center justify-center motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:h-screen">
          <div className="relative flex size-full items-center justify-center">
            <div
              ref={maskRef}
              className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl sm:rounded-[20px] md:rounded-3xl motion-safe:lg:h-[40vh] motion-safe:lg:w-[50vw] motion-safe:lg:rounded-[40px]"
            >
              <div className="relative aspect-3/2 w-full motion-safe:lg:aspect-auto motion-safe:lg:h-screen motion-safe:lg:w-screen motion-safe:lg:flex-none">
                <video
                  ref={videoRef}
                  src={REEL_VIDEO_SRC}
                  poster={REEL_POSTER_SRC}
                  aria-label={REEL_LABEL}
                  playsInline
                  preload="metadata"
                  onEnded={handleEnded}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause reel" : "Play reel"}
                  className="absolute top-1/2 left-1/2 z-20 grid aspect-square w-15 -translate-1/2 cursor-pointer place-items-center rounded-full border border-white/50 bg-white/20 text-white backdrop-blur-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-20 xl:w-30 motion-safe:lg:w-25"
                >
                  {playing ? (
                    <PauseIcon className="size-6 sm:size-9" />
                  ) : (
                    <PlayIcon className="size-6 sm:size-9" />
                  )}
                </button>
              </div>
            </div>

            <h3
              ref={firstWordRef}
              aria-hidden
              className={cn(
                REEL_WORD_CLASS,
                "left-0 translate-x-[15vw] sm:translate-x-[22vw] md:translate-x-[25vw]",
              )}
            >
              <span
                className={cn(
                  REEL_WORD_TEXT_CLASS,
                  playing && REEL_WORD_TEXT_HIDDEN_CLASS,
                )}
              >
                {REEL_WORDS[0]}
              </span>
            </h3>
            <h3
              ref={lastWordRef}
              aria-hidden
              className={cn(
                REEL_WORD_CLASS,
                "right-0 translate-x-[-15vw] sm:translate-x-[-22vw] md:translate-x-[-25vw]",
              )}
            >
              <span
                className={cn(
                  REEL_WORD_TEXT_CLASS,
                  playing && REEL_WORD_TEXT_HIDDEN_CLASS,
                )}
              >
                {REEL_WORDS[1]}
              </span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
