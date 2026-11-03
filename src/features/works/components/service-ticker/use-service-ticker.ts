import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import { TICKER_EASE, TICKER_LOOP_DURATION_S } from "./service-ticker.data";

export default function useServiceTicker() {
  const rowRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    // Reduced motion: the row and its stars stay still.
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to("[data-ticker-group]", {
        xPercent: -100,
        duration: TICKER_LOOP_DURATION_S,
        ease: TICKER_EASE,
        repeat: -1,
      });
      gsap.to("[data-ticker-star]", {
        rotation: 360,
        duration: TICKER_LOOP_DURATION_S,
        ease: TICKER_EASE,
        repeat: -1,
      });
    }, row);

    return () => ctx.revert();
  }, []);

  return { rowRef };
}
