import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import {
  QUOTE_EASE,
  QUOTE_LINE_DURATION,
  QUOTE_LINE_STEP,
  QUOTE_SCROLL_DISTANCE_RATIO,
  QUOTE_SCROLL_START,
} from "./quote-reveal.data";

export default function useQuoteReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  // The covers are hidden under reduced motion by CSS, so skipping the
  // timeline leaves the whole quote readable.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion()) return;

    const covers = section.querySelectorAll("[data-quote-cover]");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: QUOTE_SCROLL_START,
        end: () => `+=${section.offsetHeight * QUOTE_SCROLL_DISTANCE_RATIO}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    covers.forEach((cover, index) => {
      tl.to(
        cover,
        { xPercent: 100, duration: QUOTE_LINE_DURATION, ease: QUOTE_EASE },
        index * QUOTE_LINE_STEP,
      );
    });

    // revert() so StrictMode's first pass doesn't leave the covers displaced.
    return () => {
      tl.scrollTrigger?.kill();
      tl.revert();
    };
  }, []);

  return { sectionRef };
}
