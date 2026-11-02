import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  FEEDBACK_BADGE_REVEAL_DURATION_S,
  FEEDBACK_BADGE_REVEAL_EASE,
  FEEDBACK_BADGE_REVEAL_FROM_SCALE,
  FEEDBACK_BADGE_REVEAL_START_S,
  FEEDBACK_CARD_DURATION_S,
  FEEDBACK_CARD_EASE,
  FEEDBACK_CARD_FROM_ROTATION_DEG,
  FEEDBACK_CARD_FROM_X,
  FEEDBACK_CARD_ORIGIN,
  FEEDBACK_CARD_STAGGER_AMOUNT_S,
  FEEDBACK_CARDS_SCROLL_START,
  FEEDBACK_HOVER_EASE,
  FEEDBACK_HOVER_IN_S,
  FEEDBACK_HOVER_OUT_S,
  FEEDBACK_HOVER_SCALE,
  FEEDBACK_HOVER_SHIFT_VW,
  FEEDBACK_REVEAL_SCROLL_START,
  FEEDBACK_SCROLL_QUERY,
  FEEDBACK_TILT_DEG,
  FEEDBACK_TITLE_REVEAL_DURATION_S,
  FEEDBACK_TITLE_REVEAL_EASE,
  FEEDBACK_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./clients-feedback.data";

export default function useClientsFeedback() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);

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
        start: FEEDBACK_REVEAL_SCROLL_START,
        once: true,
      },
    });
    tl.from(split.chars, {
      yPercent: -100,
      duration: FEEDBACK_TITLE_REVEAL_DURATION_S,
      stagger: { amount: FEEDBACK_TITLE_REVEAL_STAGGER_AMOUNT_S },
      ease: FEEDBACK_TITLE_REVEAL_EASE,
    }).from(
      badge,
      {
        opacity: 0,
        scale: FEEDBACK_BADGE_REVEAL_FROM_SCALE,
        duration: FEEDBACK_BADGE_REVEAL_DURATION_S,
        ease: FEEDBACK_BADGE_REVEAL_EASE,
      },
      FEEDBACK_BADGE_REVEAL_START_S,
    );

    // revert() so StrictMode's first pass doesn't leave a hidden end state.
    return () => {
      tl.scrollTrigger?.kill();
      tl.revert();
      split.revert();
    };
  }, []);

  // Cards fly in once, then react to hover. The fly-in moves the list items
  // while the hover works on the cards inside them (a tilt/scale pair read
  // from CSS variables, see index.tsx), so none of it fights the resting tilt.
  useIsomorphicLayoutEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const mm = gsap.matchMedia();
    mm.add(FEEDBACK_SCROLL_QUERY, () => {
      gsap.from(cards.children, {
        x: FEEDBACK_CARD_FROM_X,
        rotation: FEEDBACK_CARD_FROM_ROTATION_DEG,
        transformOrigin: FEEDBACK_CARD_ORIGIN,
        duration: FEEDBACK_CARD_DURATION_S,
        stagger: { amount: FEEDBACK_CARD_STAGGER_AMOUNT_S },
        ease: FEEDBACK_CARD_EASE,
        scrollTrigger: {
          trigger: cards,
          start: FEEDBACK_CARDS_SCROLL_START,
          once: true,
        },
      });

      const items = Array.from(cards.children) as HTMLElement[];
      const faces = items.map((item) => item.firstElementChild as HTMLElement);

      // Moves every card to the state for `hovered` (or back to rest).
      const settle = (hovered: number | null) => {
        const entering = hovered !== null;
        const duration = entering ? FEEDBACK_HOVER_IN_S : FEEDBACK_HOVER_OUT_S;
        items.forEach((item, i) => {
          gsap.to(item, {
            x: `${entering ? FEEDBACK_HOVER_SHIFT_VW[hovered][i] : 0}vw`,
            duration,
            ease: FEEDBACK_HOVER_EASE,
            overwrite: "auto",
          });
          const lifted = i === hovered;
          gsap.to(faces[i], {
            "--tilt": `${lifted ? 0 : FEEDBACK_TILT_DEG[i]}deg`,
            "--hover-scale": lifted ? FEEDBACK_HOVER_SCALE : 1,
            duration,
            ease: FEEDBACK_HOVER_EASE,
            overwrite: "auto",
          });
        });
      };

      const listeners = items.map((item, i) => {
        const enter = () => settle(i);
        const leave = () => settle(null);
        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);
        return () => {
          item.removeEventListener("mouseenter", enter);
          item.removeEventListener("mouseleave", leave);
        };
      });

      return () => {
        listeners.forEach((remove) => remove());
        gsap.killTweensOf([...items, ...faces]);
        gsap.set(items, { clearProps: "x" });
        // Back to the resting values React rendered, not cleared: clearing
        // would drop the tilt on desktop.
        faces.forEach((face, i) =>
          gsap.set(face, {
            "--tilt": `${FEEDBACK_TILT_DEG[i]}deg`,
            "--hover-scale": 1,
          }),
        );
      };
    });
    ScrollTrigger.refresh();

    return () => mm.revert();
  }, []);

  return { titleRef, badgeRef, cardsRef };
}
