import { RefObject } from "react";
import {
  BG_LUMA_ATTRIBUTE,
  LIGHT_LUMA_THRESHOLD,
  LUMA_OVERRIDES,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  HEADER_LUMA_ROOT_MARGIN,
  HEADER_LUMA_THRESHOLDS,
  HEADER_ON_LIGHT_CLASS,
} from "./header.data";

// Scrollspy for the header's own background tint: tracks which [data-bg-luma]
// section currently sits under the header (via a thin observed band pinned
// to the top of the viewport, see HEADER_LUMA_ROOT_MARGIN) and toggles
// HEADER_ON_LIGHT_CLASS accordingly. Only dark-tagged sections opt in, so no
// section under the band at all correctly falls through to the light
// default (the site's convention: light unless explicitly marked dark) with
// no extra tagging required elsewhere.
//
// `pathname` is a dependency (not just read once) because Header lives in
// the root layout and is never remounted by client-side navigation — only
// `children` swaps. Without re-running per route, this observer would keep
// watching whatever [data-bg-luma] DOM nodes existed at Header's very first
// mount, which are destroyed the moment their page unmounts; the "new"
// section on a page you've navigated back to would never be observed again.
export default function useHeaderLuma(
  headerRef: RefObject<HTMLElement | null>,
  pathname: string,
) {
  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const ratios = new Map<Element, number>();
    let isOnLight = false;

    // Force a clean baseline on every (re)run rather than relying on
    // isOnLight's fresh `false` matching reality: the header DOM itself
    // persists across routes, so a previous page's class/attribute can
    // still be sitting on it even though this effect's local state has
    // just reset — left unaddressed, pickLuma's below unchanged-value
    // guard would skip clearing it whenever the new page also resolves to
    // dark first.
    header.classList.remove(HEADER_ON_LIGHT_CLASS);
    header.setAttribute(BG_LUMA_ATTRIBUTE, "dark");

    const pickLuma = () => {
      let best: Element | null = null;
      let bestRatio = 0;
      for (const [el, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = el;
        }
      }

      const override = best?.getAttribute(BG_LUMA_ATTRIBUTE) ?? null;
      const luma =
        override && override in LUMA_OVERRIDES
          ? LUMA_OVERRIDES[override]
          : LUMA_OVERRIDES.light;

      const nextIsOnLight = luma > LIGHT_LUMA_THRESHOLD;
      if (nextIsOnLight === isOnLight) return;
      isOnLight = nextIsOnLight;
      header.classList.toggle(HEADER_ON_LIGHT_CLASS, isOnLight);

      // The header's own data-bg-luma started as a static "dark" (matching
      // its old, always-dark background) but its visible surface now flips
      // with isOnLight — keep the attribute truthful so the cursor's own
      // ancestor walk (solidBgFrom), which reads this same attribute when
      // hovering the header, picks ink that contrasts with what's actually
      // showing rather than a stale hardcoded value.
      header.setAttribute(BG_LUMA_ATTRIBUTE, isOnLight ? "light" : "dark");
    };

    // The header itself carries data-bg-luma (for the cursor's benefit
    // while hovering it) and is always pinned at the top, so it would
    // otherwise always "win" the top-band intersection against its own
    // attribute regardless of what's actually scrolled underneath —
    // exclude it from the set this observer watches.
    const sections = Array.from(
      document.querySelectorAll(`[${BG_LUMA_ATTRIBUTE}]`),
    ).filter((section) => section !== header);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ratios.set(entry.target, entry.intersectionRatio);
          } else {
            ratios.delete(entry.target);
          }
        });
        pickLuma();
      },
      {
        rootMargin: HEADER_LUMA_ROOT_MARGIN,
        threshold: HEADER_LUMA_THRESHOLDS,
      },
    );
    sections.forEach((section) => observer.observe(section));

    // observer's callback only ever fires once it has at least one observed
    // target to report on — a page with zero [data-bg-luma] sections (e.g.
    // the 404 page) would otherwise never invoke pickLuma at all, leaving
    // isOnLight stuck at its initial `false` (dark) forever instead of
    // falling through to the light default.
    pickLuma();

    return () => observer.disconnect();
  }, [pathname]);
}
