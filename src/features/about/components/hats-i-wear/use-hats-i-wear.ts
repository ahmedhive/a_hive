import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  HATS_BADGE_REVEAL_DURATION_S,
  HATS_BADGE_REVEAL_EASE,
  HATS_BADGE_REVEAL_FROM_SCALE,
  HATS_BADGE_REVEAL_START_S,
  HATS_CARD_DURATION_S,
  HATS_CARD_EASE,
  HATS_CARD_FROM_Y_PERCENT,
  HATS_CARD_STAGGER_S,
  HATS_PIN_QUERY,
  HATS_REVEAL_SCROLL_START,
  HATS_SCROLL_END,
  HATS_SCROLL_START,
  HATS_SCRUB_S,
  HATS_TITLE_REVEAL_DURATION_S,
  HATS_TITLE_REVEAL_EASE,
  HATS_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./hats-i-wear.data";

export default function useHatsIWear() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Title reveal and sticker pop. Nothing is CSS-pre-hidden, so skipping the
  // tweens under reduced motion leaves everything visible.
  useIsomorphicLayoutEffect(() => {
    const title = titleRef.current;
    const badge = badgeRef.current;
    if (!title || !badge) return;
    if (prefersReducedMotion()) return;

    const split = SplitText.create(title, {
      type: "chars, words",
      mask: "chars",
      charsClass: "char",
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: HATS_REVEAL_SCROLL_START,
        once: true,
      },
    });
    tl.from(split.chars, {
      yPercent: -100,
      duration: HATS_TITLE_REVEAL_DURATION_S,
      stagger: { amount: HATS_TITLE_REVEAL_STAGGER_AMOUNT_S },
      ease: HATS_TITLE_REVEAL_EASE,
    }).from(
      badge,
      {
        opacity: 0,
        scale: HATS_BADGE_REVEAL_FROM_SCALE,
        duration: HATS_BADGE_REVEAL_DURATION_S,
        ease: HATS_BADGE_REVEAL_EASE,
      },
      HATS_BADGE_REVEAL_START_S,
    );

    // revert() (not kill()) so inline start states are cleared: `from` tweens
    // read their end values off the element, so a leftover hidden state from
    // StrictMode's first pass would animate from hidden to hidden.
    return () => {
      tl.scrollTrigger?.kill();
      tl.revert();
      split.revert();
    };
  }, []);

  // Cards rising in, scrubbed against the track's scroll.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();
    mm.add(HATS_PIN_QUERY, () => {
      const risers = track.querySelectorAll<HTMLElement>(
        "[data-hat-card]:not(:first-child)",
      );
      gsap.fromTo(
        risers,
        { yPercent: HATS_CARD_FROM_Y_PERCENT, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: HATS_CARD_DURATION_S,
          stagger: HATS_CARD_STAGGER_S,
          ease: HATS_CARD_EASE,
          scrollTrigger: {
            trigger: track,
            start: HATS_SCROLL_START,
            end: HATS_SCROLL_END,
            scrub: HATS_SCRUB_S,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return { titleRef, badgeRef, trackRef };
}
