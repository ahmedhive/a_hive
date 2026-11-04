import { RefObject } from "react";
import { gsap } from "./gsap";
import "./gsap-scroll-trigger";
import { PLAY_ONCE_ON_ENTER, prefersReducedMotion } from "./utils";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

// Counter roll, same as the reference's [data-counter] timeline: once a
// counter reaches the bottom of the viewport its digit columns roll into place
// (top columns downward, bottom columns upward) over 2s, then the suffix fades
// up just before the roll lands.
const COUNTER_SCROLL_START = "top bottom";
const COUNTER_ROLL_DURATION_S = 2;
const COUNTER_ROLL_EASE = "power3.inOut";
const COUNTER_ROLL_FROM_Y_PERCENT = 90;
const COUNTER_SUFFIX_START_S = 1.94;
const COUNTER_SUFFIX_FROM_Y_PERCENT = 20;
const COUNTER_SUFFIX_EASE = "power2.out";

// Rolls every StatCounter ([data-counter]) inside the root.
export default function useCounterRoll(rootRef: RefObject<HTMLElement | null>) {
  // Nothing is CSS-pre-hidden: each counter is laid out in its final state,
  // so skipping the tweens under reduced motion leaves the real numbers.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const timelines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-counter]"),
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
  }, [rootRef]);
}
