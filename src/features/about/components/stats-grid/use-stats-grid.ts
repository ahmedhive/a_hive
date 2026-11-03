import { useRef } from "react";
import {
  gsap,
  PLAY_ONCE_ON_ENTER,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  COUNTER_ROLL_DURATION_S,
  COUNTER_ROLL_EASE,
  COUNTER_ROLL_FROM_Y_PERCENT,
  COUNTER_SCROLL_START,
  COUNTER_SUFFIX_EASE,
  COUNTER_SUFFIX_FROM_Y_PERCENT,
  COUNTER_SUFFIX_START_S,
} from "./stats-grid.data";

export default function useStatsGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  // Nothing is CSS-pre-hidden: each counter is laid out in its final state,
  // so skipping the tweens under reduced motion leaves the real numbers.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion()) return;

    const timelines = Array.from(
      section.querySelectorAll<HTMLElement>("[data-counter]"),
    ).map((counter) => {
      const tops = counter.querySelectorAll("[data-counter-column='top']");
      const bottoms = counter.querySelectorAll(
        "[data-counter-column='bottom']",
      );
      const suffixes = counter.querySelectorAll("[data-counter-suffix]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: counter,
          start: COUNTER_SCROLL_START,
          toggleActions: PLAY_ONCE_ON_ENTER,
        },
      });
      tl.from(
        tops,
        {
          yPercent: -COUNTER_ROLL_FROM_Y_PERCENT,
          duration: COUNTER_ROLL_DURATION_S,
          ease: COUNTER_ROLL_EASE,
        },
        0,
      )
        .from(
          bottoms,
          {
            yPercent: COUNTER_ROLL_FROM_Y_PERCENT,
            duration: COUNTER_ROLL_DURATION_S,
            ease: COUNTER_ROLL_EASE,
          },
          0,
        )
        .from(
          suffixes,
          {
            yPercent: COUNTER_SUFFIX_FROM_Y_PERCENT,
            opacity: 0,
            ease: COUNTER_SUFFIX_EASE,
          },
          COUNTER_SUFFIX_START_S,
        );
      return tl;
    });

    // revert() so StrictMode's first pass doesn't leave a rolled-out state.
    return () => {
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.revert();
      });
    };
  }, []);

  return { sectionRef };
}
