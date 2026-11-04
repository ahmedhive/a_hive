import { RefObject } from "react";
import { gsap } from "./gsap";
import "./gsap-scroll-trigger";
import { SplitText } from "./gsap-split-text";
import { PLAY_ONCE_ON_ENTER, prefersReducedMotion } from "./utils";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

// The reference's [data-title] reveal: each marked title inside the root has
// its characters slide down through a mask once the title is 90% into the
// viewport. A title already in view at load plays straight away.
const TITLE_REVEAL_SCROLL_START = "top 90%";
const TITLE_REVEAL_DURATION_S = 1;
const TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
const TITLE_REVEAL_EASE = "back.inOut";

export default function useTitleReveal(rootRef: RefObject<HTMLElement | null>) {
  // Nothing is CSS-pre-hidden, so skipping the tweens under reduced motion
  // leaves every title visible.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const titles = Array.from(
      root.querySelectorAll<HTMLElement>("[data-title]"),
    );
    const splits = titles.map((title) =>
      SplitText.create(title, {
        type: "chars, words",
        mask: "chars",
        charsClass: "char",
      }),
    );

    const tweens = splits.map((split, i) =>
      gsap.from(split.chars, {
        yPercent: -100,
        duration: TITLE_REVEAL_DURATION_S,
        stagger: { amount: TITLE_REVEAL_STAGGER_AMOUNT_S },
        ease: TITLE_REVEAL_EASE,
        scrollTrigger: {
          trigger: titles[i],
          start: TITLE_REVEAL_SCROLL_START,
          toggleActions: PLAY_ONCE_ON_ENTER,
        },
      }),
    );

    // revert() (not kill()) so inline start states are cleared: `from` tweens
    // read their end values off the element, so a leftover hidden state from
    // StrictMode's first pass would animate from hidden to hidden.
    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.revert();
      });
      splits.forEach((split) => split.revert());
    };
  }, [rootRef]);
}
