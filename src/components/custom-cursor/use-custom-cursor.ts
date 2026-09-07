import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  CURSOR_SHAPES,
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

type TBackdrop = { color: string; luma: number };

const LUMA_OVERRIDES: Record<string, number> = { dark: 0, light: 255 };
const DEFAULT_SHAPE: TCursorShape = "circle";

function isCursorShape(value: string | null): value is TCursorShape {
  return !!value && (CURSOR_SHAPES as readonly string[]).includes(value);
}

// Walks up to the nearest mostly-opaque background and reports a colour
// plus its perceptual luminance, so the cursor can decide whether to render
// light or dark ink against whatever it's currently over.
//
// Some sections (e.g. the hero) paint their real background with an
// absolutely-positioned sibling layer (an image/gradient div) rather than a
// CSS background-color on an actual ancestor, so a plain ancestor colour
// walk would misread them via whatever background-color happens to sit
// further up (e.g. a fallback colour hidden underneath that layer). Such
// sections opt in with a `data-cursor-luma="dark"|"light"` attribute on
// their common ancestor, checked before the colour walk.
function solidBgFrom(node: Element | null): TBackdrop | null {
  while (node) {
    const override = node.getAttribute("data-cursor-luma");
    if (override && override in LUMA_OVERRIDES) {
      return {
        color: override === "dark" ? "var(--jet-black)" : "var(--white)",
        luma: LUMA_OVERRIDES[override],
      };
    }

    const style = getComputedStyle(node);
    const bg = style.backgroundColor;
    const match = bg.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(",").map((n) => parseFloat(n));
      const alpha = parts[3] === undefined ? 1 : parts[3];
      if (alpha >= 0.5) {
        const [r, g, b] = parts;
        return {
          color: `rgb(${r}, ${g}, ${b})`,
          luma: 0.2126 * r + 0.7152 * g + 0.0722 * b,
        };
      }
    }
    // An image/gradient paints here; its colour can't be read from CSS, so
    // stop climbing rather than mis-sample an unrelated ancestor further up
    // (e.g. a fallback background-color hidden beneath it). Callers should
    // mark such layers with data-cursor-luma to keep the cursor adaptive.
    if (style.backgroundImage !== "none") return null;

    node = node.parentElement;
  }
  return null;
}

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

      const under = document.elementFromPoint(px, py);
      const hoverTarget = under?.closest(HOVER_SELECTOR) ?? null;
      const nextHoverShape = hoverTarget
        ? (HOVER_TAG_SHAPES[hoverTarget.tagName] ?? null)
        : null;
      if (nextHoverShape !== hoverShape) {
        hoverShape = nextHoverShape;
        refreshShape();
        gsap.to(ring, {
          scale: hoverShape ? HOVER_RING_SCALE : 1,
          duration: SHAPE_MORPH_DURATION_S,
          ease: SHAPE_MORPH_EASE,
        });
      }

      if (--sampleCountdown <= 0) {
        sampleCountdown = LUMA_SAMPLE_EVERY_N_MOVES;
        const backdrop = solidBgFrom(under);
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
      observer.disconnect();
      gsap.killTweensOf(dot);
      gsap.killTweensOf(ring);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return { rootRef, dotRef, ringRef };
}
