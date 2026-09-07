import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  DOT_FOLLOW_DURATION_S,
  DOT_FOLLOW_EASE,
  HOVER_SELECTOR,
  LENS_RADIUS_PX,
  LENS_ZOOM,
  LIGHT_LUMA_THRESHOLD,
  LUMA_SAMPLE_EVERY_N_MOVES,
  RING_FOLLOW_DURATION_S,
  RING_FOLLOW_EASE,
  RING_HOVER_FOLLOW_DURATION_S,
} from "./custom-cursor.data";

type TBackdrop = { color: string; luma: number };

const LUMA_OVERRIDES: Record<string, number> = { dark: 0, light: 255 };

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
  const lensRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const lens = lensRef.current;
    const stage = stageRef.current;
    if (!root || !dot || !ring || !lens || !stage) return;

    document.documentElement.classList.add("has-custom-cursor");

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let active = false;
    let isLight = false;
    let sampleCountdown = 0;

    let hoverEl: Element | null = null;
    let cloneSrc: Element | null = null;
    let clone: HTMLElement | null = null;

    const dotXTo = gsap.quickTo(dot, "x", {
      duration: DOT_FOLLOW_DURATION_S,
      ease: DOT_FOLLOW_EASE,
    });
    const dotYTo = gsap.quickTo(dot, "y", {
      duration: DOT_FOLLOW_DURATION_S,
      ease: DOT_FOLLOW_EASE,
    });

    let ringXTo: (value: number) => void;
    let ringYTo: (value: number) => void;
    const setRingFollowDuration = (duration: number) => {
      gsap.killTweensOf(ring, ["x", "y"]);
      ringXTo = gsap.quickTo(ring, "x", { duration, ease: RING_FOLLOW_EASE });
      ringYTo = gsap.quickTo(ring, "y", { duration, ease: RING_FOLLOW_EASE });
      ringXTo(px);
      ringYTo(py);
    };
    setRingFollowDuration(RING_FOLLOW_DURATION_S);

    const clearClone = () => {
      stage.replaceChildren();
      clone = null;
      cloneSrc = null;
    };

    // Clones the hovered control into the stage so the lens can show a
    // magnified copy. Computed styles are flattened onto the clone because
    // its look often depends on inherited/CSS-variable context (Tailwind
    // classes, theme tokens) that wouldn't resolve on a detached node.
    const buildClone = (src: Element) => {
      cloneSrc = src;
      const c = src.cloneNode(true) as HTMLElement;
      const cs = getComputedStyle(src);
      let cssText = "";
      for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        cssText += `${prop}:${cs.getPropertyValue(prop)};`;
      }
      c.style.cssText = cssText;
      c.style.position = "absolute";
      c.style.margin = "0";
      c.style.transform = "none";
      c.style.transition = "none";
      c.style.animation = "none";
      c.style.maxWidth = "none";
      c.style.pointerEvents = "none";
      c.removeAttribute("id");
      stage.appendChild(c);
      clone = c;
    };

    const lensTick = () => {
      if (!cloneSrc || !clone) return;
      const r = cloneSrc.getBoundingClientRect();
      clone.style.left = `${r.left}px`;
      clone.style.top = `${r.top}px`;
      clone.style.width = `${r.width}px`;
      clone.style.height = `${r.height}px`;
      gsap.set(stage, {
        x: px * (1 - LENS_ZOOM),
        y: py * (1 - LENS_ZOOM),
        scale: LENS_ZOOM,
      });
      gsap.set(lens, {
        clipPath: `circle(${LENS_RADIUS_PX}px at ${px}px ${py}px)`,
      });
    };

    const setHoverTarget = (next: Element | null) => {
      if (next === hoverEl) return;
      hoverEl = next;
      root.classList.toggle("is-hover", !!next);
      setRingFollowDuration(
        next ? RING_HOVER_FOLLOW_DURATION_S : RING_FOLLOW_DURATION_S,
      );
      clearClone();
      if (next) {
        buildClone(next);
        gsap.ticker.add(lensTick);
      } else {
        gsap.ticker.remove(lensTick);
      }
    };

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
      setHoverTarget(under?.closest(HOVER_SELECTOR) ?? null);

      let backdrop: TBackdrop | null = null;
      if (cloneSrc) {
        backdrop = solidBgFrom(cloneSrc.parentElement ?? cloneSrc);
      } else if (--sampleCountdown <= 0) {
        sampleCountdown = LUMA_SAMPLE_EVERY_N_MOVES;
        backdrop = solidBgFrom(under);
      }
      if (backdrop) {
        if (lens.style.backgroundColor !== backdrop.color) {
          lens.style.backgroundColor = backdrop.color;
        }
        const nextLight = backdrop.luma > LIGHT_LUMA_THRESHOLD;
        if (nextLight !== isLight) {
          isLight = nextLight;
          root.classList.toggle("is-light", isLight);
        }
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(lensTick);
      gsap.killTweensOf(dot);
      gsap.killTweensOf(ring);
      gsap.killTweensOf(stage);
      gsap.killTweensOf(lens);
      clearClone();
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return { rootRef, dotRef, ringRef, lensRef, stageRef };
}
