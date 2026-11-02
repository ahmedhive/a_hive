import { useRef, useState } from "react";
import {
  gsap,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  QUOTES_AUTHOR_FADE_DELAY_S,
  QUOTES_AUTHOR_FADE_DURATION_S,
  QUOTES_IN_DURATION_S,
  QUOTES_IN_EASE,
  QUOTES_IN_STAGGER_S,
  QUOTES_MARQUEE_EASE,
  QUOTES_MARQUEE_SPEED_PX_PER_S,
  QUOTES_OUT_DURATION_S,
  QUOTES_OUT_EASE,
  QUOTES_OUT_STAGGER_S,
} from "./quotes.data";

export default function useQuotes() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLElement>(null);
  const linesRef = useRef<Element[]>([]);
  const hasSwappedRef = useRef(false);

  // `active` is the chosen stat and updates at once (colors); `shown` is the
  // quote on screen and only catches up once the old quote has left, so the
  // exit animation plays on the text that is still there.
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);

  const select = (index: number) => {
    setActive(index);
    // No exit animation under reduced motion, so nothing to wait for.
    if (prefersReducedMotion()) setShown(index);
  };

  // Marquee. The strip holds its phrase several times, so half its own width
  // is exactly one loop.
  useIsomorphicLayoutEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Reduced motion leaves the strip still on its first phrase.
    if (prefersReducedMotion()) return;

    const durationFor = () =>
      marquee.scrollWidth / 2 / QUOTES_MARQUEE_SPEED_PX_PER_S;

    const tween = gsap.to(marquee, {
      xPercent: -50,
      repeat: -1,
      ease: QUOTES_MARQUEE_EASE,
      duration: durationFor(),
    });

    // Re-derive the duration (not the tween) on resize so the loop keeps its
    // position while its speed re-locks to the new width; one rAF per burst.
    let resizeRaf = 0;
    const handleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => tween.duration(durationFor()));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(resizeRaf);
      tween.kill();
    };
  }, []);

  // Entrance of the quote on screen. The figure is keyed by `shown`, so every
  // swap mounts fresh elements: SplitText never has to coexist with React
  // rewriting the text it wrapped. The first quote is split too (the exit
  // needs its lines) but simply sits in place.
  useIsomorphicLayoutEffect(() => {
    const quote = quoteRef.current;
    const author = authorRef.current;
    if (!quote || !author) return;

    linesRef.current = [];
    if (prefersReducedMotion()) return;

    const animate = hasSwappedRef.current;
    const split = SplitText.create(quote, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
      autoSplit: true,
      onSplit(self) {
        linesRef.current = self.lines;
        // autoSplit wants an animation back so a re-split on resize resumes
        // it where it was.
        return animate
          ? gsap.from(self.lines, {
              yPercent: 100,
              duration: QUOTES_IN_DURATION_S,
              stagger: QUOTES_IN_STAGGER_S,
              ease: QUOTES_IN_EASE,
            })
          : gsap.set(self.lines, { yPercent: 0 });
      },
    });
    const fade = animate
      ? gsap.fromTo(
          author,
          { opacity: 0 },
          {
            opacity: 1,
            duration: QUOTES_AUTHOR_FADE_DURATION_S,
            delay: QUOTES_AUTHOR_FADE_DELAY_S,
          },
        )
      : null;

    return () => {
      fade?.kill();
      split.revert();
      linesRef.current = [];
    };
  }, [shown]);

  // Exit. A new choice sends the shown quote's lines up and out, then swaps it
  // in (onComplete). Choosing again mid-exit kills this and starts over from
  // wherever the lines are; choosing the shown quote again brings it back.
  useIsomorphicLayoutEffect(() => {
    const author = authorRef.current;
    const lines = linesRef.current;
    if (!author) return;

    if (active === shown) {
      gsap.to([...lines, author], {
        yPercent: 0,
        opacity: 1,
        duration: QUOTES_IN_DURATION_S,
        ease: QUOTES_IN_EASE,
        overwrite: "auto",
      });
      return;
    }

    hasSwappedRef.current = true;
    const tl = gsap.timeline({ onComplete: () => setShown(active) });
    tl.to(
      lines,
      {
        yPercent: -100,
        duration: QUOTES_OUT_DURATION_S,
        stagger: QUOTES_OUT_STAGGER_S,
        ease: QUOTES_OUT_EASE,
        overwrite: "auto",
      },
      0,
    ).to(
      author,
      { opacity: 0, duration: QUOTES_OUT_DURATION_S, overwrite: "auto" },
      0,
    );

    return () => {
      tl.kill();
    };
  }, [active, shown]);

  return { marqueeRef, quoteRef, authorRef, active, shown, select };
}
