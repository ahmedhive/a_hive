import { useRef } from "react";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib";
import {
  TRUSTED_CONTENT_REST_OPACITY,
  TRUSTED_FAN_DURATION_S,
  TRUSTED_FAN_EASE,
  TRUSTED_FAN_DOWN_AT,
  TRUSTED_FAN_UP_AT,
  TRUSTED_HOVER_DURATION_S,
  TRUSTED_HOVER_EASE,
  TRUSTED_HOVER_QUERY,
  TRUSTED_HOVER_WHEEL_SCALE,
  TRUSTED_MOTION_QUERY,
  TRUSTED_STACK_DOWN_AT,
  TRUSTED_STACK_UP_AT,
  TRUSTED_STEP_DEG,
  TRUSTED_TURN_END,
  TRUSTED_TURN_SCRUB_S,
  TRUSTED_TURN_START,
} from "./trusted-founders.data";

export default function useTrustedFounders() {
  const sectionRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll turn and fan-out. The CSS (index.tsx) already lays the cards out
  // in their final circle, so without motion (or before this runs) the wheel
  // simply sits still; matchMedia reverts everything created here when
  // motion is turned off, handing the layout back to that CSS.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const wheel = wheelRef.current;
    if (!section || !wheel) return;

    const mm = gsap.matchMedia();

    mm.add(TRUSTED_MOTION_QUERY, () => {
      const cards = gsap.utils.toArray<HTMLElement>(wheel.children);

      // GSAP takes over each card's transform (the CSS one is only the
      // fallback): centred on the wheel's pivot and stacked at 0deg.
      gsap.set(cards, { x: 0, xPercent: -50, rotation: 0 });

      gsap.fromTo(
        wheel,
        { rotation: 0 },
        {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: TRUSTED_TURN_START,
            end: TRUSTED_TURN_END,
            scrub: TRUSTED_TURN_SCRUB_S,
          },
        },
      );

      // Each card sweeps counter-clockwise from the stack and lands one full
      // turn short of its place, which is the same spot on the circle.
      let fanTween: gsap.core.Tween | undefined;
      const fan = () => {
        fanTween?.kill();
        fanTween = gsap.to(cards, {
          rotation: (i) => (i === 0 ? 0 : i * TRUSTED_STEP_DEG - 360),
          duration: TRUSTED_FAN_DURATION_S,
          ease: TRUSTED_FAN_EASE,
        });
      };
      const stack = () => {
        fanTween?.kill();
        gsap.set(cards, { rotation: 0 });
      };

      // One trigger per direction: the reference fans and stacks at
      // different points on the way down than on the way back up. Created in
      // this order so a page loaded past the section ends up stacked.
      ScrollTrigger.create({
        trigger: section,
        start: TRUSTED_FAN_DOWN_AT,
        onEnter: fan,
      });
      ScrollTrigger.create({
        trigger: section,
        start: TRUSTED_STACK_DOWN_AT,
        onEnter: stack,
      });
      const stackUp = ScrollTrigger.create({
        trigger: section,
        start: TRUSTED_STACK_UP_AT,
        onLeaveBack: stack,
      });
      ScrollTrigger.create({
        trigger: section,
        start: TRUSTED_FAN_UP_AT,
        // A jump from past the section to above it crosses both up lines at
        // once; only fan if the section is still short of the stack line, or
        // the cards would be left open while off screen.
        onLeaveBack: (self) => {
          if (self.scroll() >= stackUp.start) fan();
        },
      });

      return () => fanTween?.kill();
    });

    return () => mm.revert();
  }, []);

  // Hover.
  useIsomorphicLayoutEffect(() => {
    const wheel = wheelRef.current;
    const content = contentRef.current;
    if (!wheel || !content) return;
    const dimmed = content.querySelectorAll("[data-trusted-dim]");

    const mm = gsap.matchMedia();

    mm.add(TRUSTED_HOVER_QUERY, () => {
      // Keyboard focus lights the content up like hover does, so the
      // button's focus ring isn't left at half opacity.
      let hovered = false;
      let focused = false;
      const settle = () => {
        const lit = hovered || focused;
        const options = {
          duration: TRUSTED_HOVER_DURATION_S,
          ease: TRUSTED_HOVER_EASE,
        };
        gsap.to(dimmed, {
          opacity: lit ? 1 : TRUSTED_CONTENT_REST_OPACITY,
          ...options,
        });
        gsap.to(wheel, {
          scale: lit ? TRUSTED_HOVER_WHEEL_SCALE : 1,
          ...options,
        });
      };
      const handlers = {
        mouseenter: () => {
          hovered = true;
          settle();
        },
        mouseleave: () => {
          hovered = false;
          settle();
        },
        focusin: () => {
          focused = true;
          settle();
        },
        focusout: () => {
          focused = false;
          settle();
        },
      };

      Object.entries(handlers).forEach(([type, handler]) =>
        content.addEventListener(type, handler),
      );
      return () => {
        Object.entries(handlers).forEach(([type, handler]) =>
          content.removeEventListener(type, handler),
        );
      };
    });

    return () => mm.revert();
  }, []);

  return { sectionRef, wheelRef, contentRef };
}
