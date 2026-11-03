import { useRef } from "react";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib";
import {
  INTRO_VIDEO_EASE,
  INTRO_VIDEO_END_HEIGHT_RATIO,
  INTRO_VIDEO_END_VIEWPORT_RATIO,
  INTRO_VIDEO_FROM_SCALE,
  INTRO_VIDEO_FROM_Y_PERCENT,
  INTRO_VIDEO_GROW_DURATION,
  INTRO_VIDEO_GROW_QUERY,
  INTRO_VIDEO_GROW_START,
  INTRO_VIDEO_SCROLL_START,
  INTRO_VIDEO_SCRUB_S,
  INTRO_VIDEO_SLIDE_DURATION,
} from "./intro-video.data";

export default function useIntroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const box = boxRef.current;
    if (!section || !box) return;

    const mm = gsap.matchMedia();
    mm.add(INTRO_VIDEO_GROW_QUERY, () => {
      // The static section is the trigger, not the animated box: the box's
      // own transform would move the trigger's edges as it plays.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: INTRO_VIDEO_SCROLL_START,
            end: () =>
              `top ${
                section.offsetHeight * INTRO_VIDEO_END_HEIGHT_RATIO +
                window.innerHeight * INTRO_VIDEO_END_VIEWPORT_RATIO
              }px`,
            scrub: INTRO_VIDEO_SCRUB_S,
          },
        })
        .fromTo(
          box,
          { opacity: 0, yPercent: INTRO_VIDEO_FROM_Y_PERCENT },
          {
            opacity: 1,
            yPercent: 0,
            duration: INTRO_VIDEO_SLIDE_DURATION,
            ease: INTRO_VIDEO_EASE,
          },
        )
        .fromTo(
          box,
          { scale: INTRO_VIDEO_FROM_SCALE },
          {
            scale: 1,
            duration: INTRO_VIDEO_GROW_DURATION,
            ease: INTRO_VIDEO_EASE,
          },
          INTRO_VIDEO_GROW_START,
        );
    });
    ScrollTrigger.refresh();

    return () => mm.revert();
  }, []);

  return { sectionRef, boxRef };
}
