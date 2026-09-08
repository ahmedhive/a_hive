import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import { ROUTES } from "@/constants/routes";
import {
  HEADER_DEFAULT_INSET_PX,
  HEADER_DEFAULT_TOP_INSET_PX,
  HEADER_REVEAL_DELAY_S,
  HEADER_REVEAL_DURATION_S,
  HEADER_REVEAL_EASE,
  HEADER_REVEAL_Y_PERCENT_FROM,
  HEADER_SCROLLED_CLASS,
  HEADER_SCROLLED_INSET_PX,
  HEADER_SCROLLED_TOP_INSET_PX,
  HEADER_SCROLL_EASE,
  HEADER_SCROLL_TWEEN_DURATION_S,
} from "./header.data";
import useHeaderLuma from "./use-header-luma";

export default function useHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === ROUTES.HOME;

  useHeaderLuma(headerRef, pathname);

  // One-time entrance reveal. Header lives in the root layout, so it mounts
  // exactly once for the whole session (client-side navigation only swaps
  // `children`, it never remounts Header) — this must NOT depend on
  // pathname, or the header would slide in from off-screen again every time
  // the user navigates.
  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduceMotion = prefersReducedMotion();

    // fromTo (not from): immediateRender applies the offscreen "from" state
    // synchronously in this layout effect, before the browser's first paint,
    // so there's no static hidden className needed and no FOUC — same
    // approach as the hero/about-me reveals. Under reduced motion the hero
    // shows its final state immediately with no reveal to wait on, so the
    // header should match that and appear in place right away instead of
    // sliding in after HEADER_REVEAL_DELAY_S. Only the home page runs the
    // preloader/hero sequence this delay is timed against — everywhere else
    // there's nothing to wait on, so the header slides in immediately. Since
    // this effect only ever runs once, `isHome` here reflects only whichever
    // route the user actually landed on first.
    const revealTween = reduceMotion
      ? gsap.set(header, { yPercent: 0 })
      : gsap.fromTo(
          header,
          { yPercent: HEADER_REVEAL_Y_PERCENT_FROM },
          {
            yPercent: 0,
            duration: HEADER_REVEAL_DURATION_S,
            ease: HEADER_REVEAL_EASE,
            delay: isHome ? HEADER_REVEAL_DELAY_S : 0,
          },
        );

    return () => {
      revealTween.kill();
    };
  }, []);

  // Scroll-driven inset/background state. Re-synced on every route change
  // (pathname dependency): the header persists across client-side
  // navigation, so without this a scrolled-state class or inset tween left
  // over from the previous page could still be sitting on the header after
  // landing on a new one at a different actual scrollY.
  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduceMotion = prefersReducedMotion();

    // Baseline is read from the real, current scrollY (not assumed false)
    // and applied instantly via gsap.set — this is a re-sync on route
    // change, not a scroll-driven transition, so it must not animate or
    // depend on whatever class/inset the previous page's scroll state left
    // behind.
    let scrolled = window.scrollY > 0;
    header.classList.toggle(HEADER_SCROLLED_CLASS, scrolled);
    gsap.set(header, {
      left: scrolled ? HEADER_SCROLLED_INSET_PX : HEADER_DEFAULT_INSET_PX,
      right: scrolled ? HEADER_SCROLLED_INSET_PX : HEADER_DEFAULT_INSET_PX,
      top: scrolled
        ? HEADER_SCROLLED_TOP_INSET_PX
        : HEADER_DEFAULT_TOP_INSET_PX,
    });

    // Animate left/right/top insets rather than width: the header is fixed
    // and full-bleed (inset-x-0 top-0), so pulling all three edges in by the
    // same amount narrows and lifts it off the viewport edge while staying
    // centered, with no over-constrained left/right/width conflict for the
    // browser to resolve.
    const onScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled === scrolled) return;
      scrolled = isScrolled;

      header.classList.toggle(HEADER_SCROLLED_CLASS, isScrolled);

      gsap.to(header, {
        left: isScrolled ? HEADER_SCROLLED_INSET_PX : HEADER_DEFAULT_INSET_PX,
        right: isScrolled ? HEADER_SCROLLED_INSET_PX : HEADER_DEFAULT_INSET_PX,
        top: isScrolled
          ? HEADER_SCROLLED_TOP_INSET_PX
          : HEADER_DEFAULT_TOP_INSET_PX,
        duration: reduceMotion ? 0 : HEADER_SCROLL_TWEEN_DURATION_S,
        ease: HEADER_SCROLL_EASE,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return { headerRef };
}
