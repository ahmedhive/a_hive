import { useRef } from "react";
import {
  gsap,
  PLAY_ONCE_ON_ENTER,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  EXPERT_BADGE_REVEAL_DURATION_S,
  EXPERT_BADGE_REVEAL_EASE,
  EXPERT_BADGE_REVEAL_FROM_SCALE,
  EXPERT_BADGE_REVEAL_START_S,
  EXPERT_REVEAL_SCROLL_START,
  EXPERT_TITLE_REVEAL_DURATION_S,
  EXPERT_TITLE_REVEAL_EASE,
  EXPERT_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./expert-solutions.data";

export default function useExpertSolutions() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);

  // Reveals. Nothing is CSS-pre-hidden, so skipping the tweens under reduced
  // motion leaves everything visible. The section title also pops its sticker
  // in; each row title (marked [data-expert-title]) reveals on its own.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const badge = badgeRef.current;
    if (!section || !title || !badge) return;
    if (prefersReducedMotion()) return;

    const rowTitles = Array.from(
      section.querySelectorAll<HTMLElement>("[data-expert-title]"),
    );
    const targets = [title, ...rowTitles];
    const splits = targets.map((el) =>
      SplitText.create(el, {
        type: "chars, words",
        mask: "chars",
        charsClass: "char",
      }),
    );

    const timelines = splits.map((split, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: targets[i],
          start: EXPERT_REVEAL_SCROLL_START,
          toggleActions: PLAY_ONCE_ON_ENTER,
        },
      });
      tl.from(split.chars, {
        yPercent: -100,
        duration: EXPERT_TITLE_REVEAL_DURATION_S,
        stagger: { amount: EXPERT_TITLE_REVEAL_STAGGER_AMOUNT_S },
        ease: EXPERT_TITLE_REVEAL_EASE,
      });
      if (i === 0) {
        tl.from(
          badge,
          {
            opacity: 0,
            scale: EXPERT_BADGE_REVEAL_FROM_SCALE,
            duration: EXPERT_BADGE_REVEAL_DURATION_S,
            ease: EXPERT_BADGE_REVEAL_EASE,
          },
          EXPERT_BADGE_REVEAL_START_S,
        );
      }
      return tl;
    });

    // revert() (not kill()) so inline start states are cleared: `from` tweens
    // read their end values off the element, so a leftover hidden state from
    // StrictMode's first pass would animate from hidden to hidden.
    return () => {
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.revert();
      });
      splits.forEach((split) => split.revert());
    };
  }, []);

  return { sectionRef, titleRef, badgeRef };
}
