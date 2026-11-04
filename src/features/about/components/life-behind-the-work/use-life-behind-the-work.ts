import { useRef } from "react";
import {
  gsap,
  PLAY_ONCE_ON_ENTER,
  prefersReducedMotion,
  ScrollTrigger,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  LIFE_CARD_DURATION_S,
  LIFE_CARD_EASE,
  LIFE_CARD_FROM_ROTATION_DEG,
  LIFE_CARD_FROM_X,
  LIFE_CARD_ORIGIN,
  LIFE_CARD_STAGGER_AMOUNT_S,
  LIFE_CARDS_SCROLL_START,
  LIFE_FLY_QUERY,
  LIFE_HOVER_EASE,
  LIFE_HOVER_IN_S,
  LIFE_HOVER_OUT_S,
  LIFE_HOVER_QUERY,
  LIFE_HOVER_SCALE,
  LIFE_HOVER_SHIFT_VW,
  LIFE_HOVER_TWEEN_TAG,
  LIFE_REVEAL_SCROLL_START,
  LIFE_TEXT_REVEAL_DELAY_S,
  LIFE_TEXT_REVEAL_DURATION_S,
  LIFE_TEXT_REVEAL_EASE,
  LIFE_TEXT_REVEAL_STAGGER_AMOUNT_S,
  LIFE_TILT_DEG,
  LIFE_TITLE_REVEAL_DURATION_S,
  LIFE_TITLE_REVEAL_EASE,
  LIFE_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./life-behind-the-work.data";

export default function useLifeBehindTheWork() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);

  // Title and description reveals. Nothing is CSS-pre-hidden, so skipping the
  // tweens under reduced motion leaves everything visible.
  useIsomorphicLayoutEffect(() => {
    const title = titleRef.current;
    const text = textRef.current;
    if (!title || !text) return;
    if (prefersReducedMotion()) return;

    const reveals = [
      {
        target: title,
        delay: 0,
        duration: LIFE_TITLE_REVEAL_DURATION_S,
        amount: LIFE_TITLE_REVEAL_STAGGER_AMOUNT_S,
        ease: LIFE_TITLE_REVEAL_EASE,
      },
      {
        target: text,
        delay: LIFE_TEXT_REVEAL_DELAY_S,
        duration: LIFE_TEXT_REVEAL_DURATION_S,
        amount: LIFE_TEXT_REVEAL_STAGGER_AMOUNT_S,
        ease: LIFE_TEXT_REVEAL_EASE,
      },
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
            start: LIFE_REVEAL_SCROLL_START,
            toggleActions: PLAY_ONCE_ON_ENTER,
          },
        });
        tl.from(
          split.chars,
          { yPercent: -100, duration, stagger: { amount }, ease },
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

  // Cards fly in once, then react to hover. The fly-in moves the list items
  // while the hover works on the faces inside them (a tilt/scale pair read from
  // CSS variables, see index.tsx), so none of it fights the resting tilt.
  useIsomorphicLayoutEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const mm = gsap.matchMedia();
    mm.add(LIFE_FLY_QUERY, () => {
      gsap.from(cards.children, {
        x: LIFE_CARD_FROM_X,
        rotation: LIFE_CARD_FROM_ROTATION_DEG,
        transformOrigin: LIFE_CARD_ORIGIN,
        duration: LIFE_CARD_DURATION_S,
        stagger: { amount: LIFE_CARD_STAGGER_AMOUNT_S },
        ease: LIFE_CARD_EASE,
        scrollTrigger: {
          trigger: cards,
          start: LIFE_CARDS_SCROLL_START,
          toggleActions: PLAY_ONCE_ON_ENTER,
        },
      });
    });

    // Hover needs a real pointer: on a touch screen a tap fires mouseenter but
    // there is no mouseleave, so the neighbours would stay shifted.
    mm.add(LIFE_HOVER_QUERY, () => {
      const items = Array.from(cards.children) as HTMLElement[];
      const faces = items.map((item) => item.firstElementChild as HTMLElement);

      // Whether a hover ever ran: if not, the cards are exactly as the fly-in
      // left (or has yet to leave) them and cleanup must not touch them.
      let touched = false;

      // Moves every card to the state for `hovered` (or back to rest).
      const settle = (hovered: number | null) => {
        touched = true;
        const entering = hovered !== null;
        const duration = entering ? LIFE_HOVER_IN_S : LIFE_HOVER_OUT_S;
        items.forEach((item, i) => {
          gsap.to(item, {
            x: `${entering ? LIFE_HOVER_SHIFT_VW[hovered][i] : 0}vw`,
            duration,
            ease: LIFE_HOVER_EASE,
            overwrite: "auto",
            data: LIFE_HOVER_TWEEN_TAG,
          });
          const lifted = i === hovered;
          gsap.to(faces[i], {
            "--tilt": `${lifted ? 0 : LIFE_TILT_DEG[i]}deg`,
            "--hover-scale": lifted ? LIFE_HOVER_SCALE : 1,
            duration,
            ease: LIFE_HOVER_EASE,
            overwrite: "auto",
            data: LIFE_HOVER_TWEEN_TAG,
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
        // Only the hover's own tweens: the fly-in animates the same items.
        gsap
          .getTweensOf([...items, ...faces])
          .filter((tween) => tween.data === LIFE_HOVER_TWEEN_TAG)
          .forEach((tween) => tween.kill());
        if (touched) gsap.set(items, { clearProps: "x" });
        // Back to the resting values React rendered, not cleared: clearing
        // would drop the tilt.
        faces.forEach((face, i) =>
          gsap.set(face, {
            "--tilt": `${LIFE_TILT_DEG[i]}deg`,
            "--hover-scale": 1,
          }),
        );
      };
    });
    ScrollTrigger.refresh();

    return () => mm.revert();
  }, []);

  return { titleRef, textRef, cardsRef };
}
