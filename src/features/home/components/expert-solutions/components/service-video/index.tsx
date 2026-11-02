"use client";

import { useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/assets/icons";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import { EXPERT_VIDEO_VISIBLE_RATIO } from "../../expert-solutions.data";
import { IServiceVideoProps } from "./service-video.interface";

export default function ServiceVideo(props: IServiceVideoProps) {
  const { src, poster, label } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const coveredRef = useRef(false);
  // The viewer's own choice wins over autoplay; reduced motion starts paused.
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  const sync = () => {
    const video = videoRef.current;
    if (!video) return;
    if (visibleRef.current && !coveredRef.current && !pausedRef.current) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  useIsomorphicLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion()) {
      pausedRef.current = true;
      setPaused(true);
    }

    // Plays only while on screen, so four looping videos don't all decode
    // at once.
    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        sync();
      },
      { threshold: EXPERT_VIDEO_VISIBLE_RATIO },
    );
    visibleObserver.observe(video);

    // Rows stack as they stick, so a row stays "on screen" after the next one
    // has slid over it. It is covered once the next row's top reaches the
    // sticky offset (the root's top edge, shrunk by that offset). The last
    // row has no next row and is never covered.
    const article = video.closest("article");
    const next = article?.nextElementSibling;
    let coveredObserver: IntersectionObserver | undefined;
    if (article && next) {
      const stickyTop = parseFloat(getComputedStyle(article).top) || 0;
      coveredObserver = new IntersectionObserver(
        ([entry]) => {
          const rootTop = entry.rootBounds?.top ?? 0;
          coveredRef.current = entry.boundingClientRect.top <= rootTop;
          sync();
        },
        { rootMargin: `-${stickyTop}px 0px 0px 0px`, threshold: [0, 1] },
      );
      coveredObserver.observe(next);
    }

    return () => {
      visibleObserver.disconnect();
      coveredObserver?.disconnect();
    };
  }, []);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    sync();
  };

  return (
    <div className="relative aspect-4/3 max-w-150 flex-[200px] overflow-hidden rounded-3xl max-[767px]:max-w-none max-[767px]:basis-80 min-[1920px]:basis-150">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        preload="metadata"
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? `Play ${label} video` : `Pause ${label} video`}
        className="absolute right-4 bottom-4 cursor-pointer rounded-full bg-linen p-3 text-black-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-secondary"
      >
        {paused ? (
          <PlayIcon className="size-6" />
        ) : (
          <PauseIcon className="size-6" />
        )}
      </button>
    </div>
  );
}
