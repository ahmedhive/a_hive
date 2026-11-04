import { useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib";
import { LENIS_LERP, LENIS_WHEEL_MULTIPLIER } from "./smooth-scroll.data";

export default function useSmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const lastPathnameRef = useRef(pathname);
  // Set by the browser's back/forward buttons, which restore the old scroll
  // position themselves.
  const isHistoryTraversalRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const lenis = new Lenis({
      lerp: LENIS_LERP,
      wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const handlePopState = () => {
      isHistoryTraversalRef.current = true;
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // A new page starts at the top. Next scrolls there itself, but Lenis keeps
  // gliding toward the old position when a link is clicked mid-scroll and
  // drags the new page back down, so Lenis is sent to the top as well.
  useIsomorphicLayoutEffect(() => {
    if (pathname === lastPathnameRef.current) return;
    lastPathnameRef.current = pathname;

    if (isHistoryTraversalRef.current) {
      isHistoryTraversalRef.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);
}
