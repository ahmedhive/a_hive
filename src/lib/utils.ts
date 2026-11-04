import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A new array in random order (Fisher-Yates), leaving the input untouched.
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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

// ScrollTrigger `toggleActions` for a reveal that plays once when its start is
// reached and never reverses or replays. Used instead of `once: true`: that
// option kills the trigger the moment it fires, and when the page loads with
// the scroll position already past the start (a refresh partway down) the kill
// happens while ScrollTrigger is still looping over its trigger list, which
// throws "Cannot read properties of undefined (reading 'end')".
export const PLAY_ONCE_ON_ENTER = "play none none none";
