import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import {
  DEFAULT_SHAPE,
  DOT_FOLLOW_DURATION_S,
  DOT_FOLLOW_EASE,
  HOVER_RING_SCALE,
  HOVER_SELECTOR,
  HOVER_TAG_SHAPES,
  LIGHT_LUMA_THRESHOLD,
  LUMA_SAMPLE_EVERY_N_MOVES,
  RING_FOLLOW_DURATION_S,
  RING_FOLLOW_EASE,
  SHAPE_ATTRIBUTE,
  SHAPE_MORPH_DURATION_S,
  SHAPE_MORPH_EASE,
  SHAPE_STYLES,
} from "./custom-cursor.data";
import { TCursorShape } from "./custom-cursor.interface";
import { isCursorShape, solidBgFrom } from "./custom-cursor.utils";

export default function useCustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let active = false;
    let isLight = false;
    let sampleCountdown = 0;
    let currentShape: TCursorShape = DEFAULT_SHAPE;
    let sectionShape: TCursorShape = DEFAULT_SHAPE;
    let hoverShape: TCursorShape | null = null;

    const dotXTo = gsap.quickTo(dot, "x", {
      duration: DOT_FOLLOW_DURATION_S,
      ease: DOT_FOLLOW_EASE,
    });
    const dotYTo = gsap.quickTo(dot, "y", {
      duration: DOT_FOLLOW_DURATION_S,
      ease: DOT_FOLLOW_EASE,
    });
    dotXTo(px);
    dotYTo(py);

    const ringXTo = gsap.quickTo(ring, "x", {
      duration: RING_FOLLOW_DURATION_S,
      ease: RING_FOLLOW_EASE,
    });
    const ringYTo = gsap.quickTo(ring, "y", {
      duration: RING_FOLLOW_DURATION_S,
      ease: RING_FOLLOW_EASE,
    });
    ringXTo(px);
    ringYTo(py);

    gsap.set(ring, { ...SHAPE_STYLES[DEFAULT_SHAPE], scale: 1 });

    const applyShape = (shape: TCursorShape) => {
      if (shape === currentShape) return;
      currentShape = shape;
      gsap.to(ring, {
        ...SHAPE_STYLES[shape],
        duration: SHAPE_MORPH_DURATION_S,
        ease: SHAPE_MORPH_EASE,
      });
    };

    // The effective shape is whichever interactive element is under the
    // pointer (a/button), falling back to the current section's shape.
    const refreshShape = () => applyShape(hoverShape ?? sectionShape);

    // Tracks the intersection ratio of every observed section so the ring
    // can pick the most-visible one as "current" — resilient to sections
    // overlapping mid-scroll, unlike a single active/inactive flag.
    const ratios = new Map<Element, number>();
    const pickCurrentShape = () => {
      let best: Element | null = null;
      let bestRatio = 0;
      for (const [el, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = el;
        }
      }
      const attr = best?.getAttribute(SHAPE_ATTRIBUTE) ?? null;
      sectionShape = isCursorShape(attr) ? attr : DEFAULT_SHAPE;
      refreshShape();
    };

    const sections = document.querySelectorAll(`[${SHAPE_ATTRIBUTE}]`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ratios.set(entry.target, entry.intersectionRatio);
          } else {
            ratios.delete(entry.target);
          }
        });
        pickCurrentShape();
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) },
    );
    sections.forEach((section) => observer.observe(section));

    // Delegated (not polled from onMove below): pointerover bubbles and
    // fires for whatever element the pointer is now topmost over, including
    // the page background once it leaves a hoverable element — so a single
    // document listener tracks hover state for every current and future
    // a/button on the page with no per-element binding and, unlike
    // elementFromPoint, no forced hit-test on every pointermove.
    const onPointerOver = (e: PointerEvent) => {
      const target =
        e.target instanceof Element ? e.target.closest(HOVER_SELECTOR) : null;
      const nextHoverShape = target
        ? (HOVER_TAG_SHAPES[target.tagName] ?? null)
        : null;
      if (nextHoverShape === hoverShape) return;
      hoverShape = nextHoverShape;
      refreshShape();
      gsap.to(ring, {
        scale: hoverShape ? HOVER_RING_SCALE : 1,
        duration: SHAPE_MORPH_DURATION_S,
        ease: SHAPE_MORPH_EASE,
      });
    };
    document.addEventListener("pointerover", onPointerOver, {
      passive: true,
    });

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!active) {
        active = true;
        root.classList.add("is-active");
      }

      dotXTo(px);
      dotYTo(py);
      ringXTo(px);
      ringYTo(py);

      if (--sampleCountdown <= 0) {
        sampleCountdown = LUMA_SAMPLE_EVERY_N_MOVES;
        const backdrop = solidBgFrom(document.elementFromPoint(px, py));
        if (backdrop) {
          const nextLight = backdrop.luma > LIGHT_LUMA_THRESHOLD;
          if (nextLight !== isLight) {
            isLight = nextLight;
            root.classList.toggle("is-light", isLight);
          }
        }
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      observer.disconnect();
      gsap.killTweensOf(dot);
      gsap.killTweensOf(ring);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return { rootRef, dotRef, ringRef };
}
