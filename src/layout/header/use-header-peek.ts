import { RefObject, useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import {
  HEADER_PEEK_DURATION_S,
  HEADER_PEEK_EASE,
  HEADER_PEEK_HIDE_EXTRA_PX,
  HEADER_PEEK_SCROLL_THRESHOLD_PX,
  HEADER_PEEK_VISIBLE_MS,
} from "./header.data";

// Hides the header on scroll down and slides it back in on scroll up, then
// hides it again HEADER_PEEK_VISIBLE_MS after the user stops scrolling up.
// It stays put while hovered, while it holds keyboard focus, or while the
// menu is open. Uses `y` (pixels) so it never fights the entrance reveal,
// which owns `yPercent`.
export default function useHeaderPeek(
  headerRef: RefObject<HTMLElement | null>,
  pathname: string,
  isMenuOpen: boolean,
) {
  const isMenuOpenRef = useRef(isMenuOpen);
  const restartRef = useRef<(() => void) | null>(null);

  useIsomorphicLayoutEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
    restartRef.current?.();
  }, [isMenuOpen]);

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const duration = prefersReducedMotion() ? 0 : HEADER_PEEK_DURATION_S;
    const canHover = window.matchMedia("(hover: hover)");
    let lastY = window.scrollY;
    let isHidden = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const move = (y: number, animate: boolean) => {
      gsap.to(header, {
        y,
        duration: animate ? duration : 0,
        ease: HEADER_PEEK_EASE,
        overwrite: "auto",
      });
    };

    const show = (animate = true) => {
      isHidden = false;
      move(0, animate);
    };

    const hide = () => {
      isHidden = true;
      move(-(header.offsetHeight + HEADER_PEEK_HIDE_EXTRA_PX), true);
    };

    const isHeld = () =>
      isMenuOpenRef.current ||
      header.contains(document.activeElement) ||
      (canHover.matches && header.matches(":hover"));

    const clearTimer = () => clearTimeout(timer);

    const startTimer = () => {
      clearTimer();
      if (window.scrollY <= 0 || isHidden) return;
      timer = setTimeout(() => {
        if (isHeld()) return;
        hide();
      }, HEADER_PEEK_VISIBLE_MS);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 0) {
        clearTimer();
        lastY = y;
        if (isHidden) show();
        return;
      }

      const delta = y - lastY;
      if (Math.abs(delta) < HEADER_PEEK_SCROLL_THRESHOLD_PX) return;
      lastY = y;

      if (delta > 0) {
        clearTimer();
        if (!isHidden && !isHeld()) hide();
        return;
      }

      if (isHidden) show();
      startTimer();
    };

    // Hovering/focusing pauses the countdown; leaving restarts it.
    const onPointerLeave = () => startTimer();
    const onFocusOut = () => startTimer();

    show(false);
    restartRef.current = () => {
      if (isMenuOpenRef.current) {
        clearTimer();
        if (isHidden) show();
      } else {
        startTimer();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    header.addEventListener("pointerleave", onPointerLeave);
    header.addEventListener("focusout", onFocusOut);

    return () => {
      clearTimer();
      restartRef.current = null;
      window.removeEventListener("scroll", onScroll);
      header.removeEventListener("pointerleave", onPointerLeave);
      header.removeEventListener("focusout", onFocusOut);
    };
  }, [pathname]);
}
