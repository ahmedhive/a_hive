import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Every 10% step from 0 to 1 — for IntersectionObservers that need to pick
// the "most intersecting" of several overlapping targets (e.g. custom-cursor's
// section shape and the header's luma scrollspy), a single 0/1 threshold only
// reports fully-entered/fully-left; this reports every ratio change in
// between so the picker can react smoothly as sections scroll past each other.
export const FULL_INTERSECTION_THRESHOLDS = Array.from(
  { length: 11 },
  (_, i) => i / 10,
);

// Shared by custom-cursor's section-shape picker and the header's luma
// scrollspy: both track every currently-intersecting target's ratio in a
// Map (set on enter, deleted on leave) so overlapping sections resolve to
// whichever one is most visible, instead of a single active/inactive flag
// that would break once two sections intersect at once mid-scroll.
export function pickMostIntersecting(
  ratios: Map<Element, number>,
): Element | null {
  let best: Element | null = null;
  let bestRatio = 0;
  for (const [el, ratio] of ratios) {
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = el;
    }
  }
  return best;
}
