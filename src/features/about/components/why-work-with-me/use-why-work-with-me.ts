import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  WHY_WORK_CARD_DURATION_S,
  WHY_WORK_CARD_EASE,
  WHY_WORK_CARD_FROM_WIDTH,
  WHY_WORK_CARD_STAGGER_S,
  WHY_WORK_CARD_TO_WIDTH,
  WHY_WORK_PIN_QUERY,
  WHY_WORK_REVEAL_SCROLL_START,
  WHY_WORK_SCROLL_END,
  WHY_WORK_SCROLL_START,
  WHY_WORK_SCRUB_S,
  WHY_WORK_TEXT_REVEAL_DELAY_S,
  WHY_WORK_TEXT_REVEAL_DURATION_S,
  WHY_WORK_TEXT_REVEAL_EASE,
  WHY_WORK_TEXT_REVEAL_STAGGER_AMOUNT_S,
  WHY_WORK_TITLE_REVEAL_DURATION_S,
  WHY_WORK_TITLE_REVEAL_EASE,
  WHY_WORK_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./why-work-with-me.data";

export default function useWhyWorkWithMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Reveals. Nothing is CSS-pre-hidden, so skipping the tweens under reduced
  // motion leaves everything visible. The two headings (marked
  // [data-why-title]) and the paragraphs (marked [data-why-text]) each reveal
  // on their own trigger.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion()) return;

    const reveals = [
      ...Array.from(
        section.querySelectorAll<HTMLElement>("[data-why-title]"),
      ).map((target) => ({
        target,
        delay: 0,
        duration: WHY_WORK_TITLE_REVEAL_DURATION_S,
        amount: WHY_WORK_TITLE_REVEAL_STAGGER_AMOUNT_S,
        ease: WHY_WORK_TITLE_REVEAL_EASE,
      })),
      ...Array.from(
        section.querySelectorAll<HTMLElement>("[data-why-text]"),
      ).map((target) => ({
        target,
        delay: WHY_WORK_TEXT_REVEAL_DELAY_S,
        duration: WHY_WORK_TEXT_REVEAL_DURATION_S,
        amount: WHY_WORK_TEXT_REVEAL_STAGGER_AMOUNT_S,
        ease: WHY_WORK_TEXT_REVEAL_EASE,
      })),
    ];

    const splits: SplitText[] = [];
    const timelines = reveals.map(
      ({ target, delay, duration, amount, ease }) => {
        const split = SplitText.create(target, {
          type: "chars, words",
          mask: "chars",
          charsClass: "char",
        });
        splits.push(split);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: target,
            start: WHY_WORK_REVEAL_SCROLL_START,
            once: true,
          },
        });
        tl.from(
          split.chars,
          {
            yPercent: -100,
            duration,
            stagger: { amount },
            ease,
          },
          delay,
        );
        return tl;
      },
    );

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

  // Card expansion, scrubbed against the track's scroll.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();
    mm.add(WHY_WORK_PIN_QUERY, () => {
      const cards = track.querySelectorAll<HTMLElement>("[data-why-card]");
      gsap.fromTo(
        cards,
        { width: WHY_WORK_CARD_FROM_WIDTH },
        {
          width: WHY_WORK_CARD_TO_WIDTH,
          duration: WHY_WORK_CARD_DURATION_S,
          stagger: WHY_WORK_CARD_STAGGER_S,
          ease: WHY_WORK_CARD_EASE,
          scrollTrigger: {
            trigger: track,
            start: WHY_WORK_SCROLL_START,
            end: WHY_WORK_SCROLL_END,
            scrub: WHY_WORK_SCRUB_S,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return { sectionRef, trackRef };
}
