import { useRef, useState } from "react";
import {
  Flip,
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
  QUOTES_LAYOUT_KEYS,
  QUOTES_MARQUEE_EASE,
  QUOTES_MARQUEE_SPEED_PX_PER_S,
  QUOTES_MOVE_DURATION_S,
  QUOTES_MOVE_EASE,
  QUOTES_MOVE_QUERY,
  QUOTES_OUT_DURATION_S,
  QUOTES_OUT_EASE,
  QUOTES_OUT_STAGGER_S,
  QUOTES_TILE_FADE_EASE,
  QUOTES_TILE_FADE_IN_DELAY_S,
  QUOTES_TILE_FADE_IN_S,
  QUOTES_TILE_FADE_OUT_S,
} from "./quotes.data";
import { IMove } from "./quotes.interface";
import { crossesBox, placeGhost, recordMove } from "./quotes.utils";

export default function useQuotes() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<IMove | null>(null);
  const ghostsRef = useRef<HTMLElement[]>([]);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLElement>(null);
  const linesRef = useRef<Element[]>([]);
  const hasSwappedRef = useRef(false);
  const exitingRef = useRef(false);

  // `active` is the chosen stat and updates at once (colors); `shown` is the
  // quote on screen and only catches up once the old quote has left, so the
  // exit animation plays on the text that is still there.
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);

  const layoutKey = QUOTES_LAYOUT_KEYS[active];

  const select = (index: number) => {
    if (index === active) return;

    // Only a choice that puts the box and tiles in different cells needs
    // recording, and only on desktop without reduced motion (the layout then
    // changes instantly).
    const overlay = overlayRef.current;
    moveRef.current =
      overlay &&
      QUOTES_LAYOUT_KEYS[index] !== layoutKey &&
      window.matchMedia(QUOTES_MOVE_QUERY).matches &&
      !prefersReducedMotion()
        ? recordMove(overlay)
        : null;

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

    // Slides right: from half a loop back to the start, so the strip enters
    // from the left and the loop still lands on an identical frame.
    const tween = gsap.fromTo(
      marquee,
      { xPercent: -50 },
      {
        xPercent: 0,
        repeat: -1,
        ease: QUOTES_MARQUEE_EASE,
        duration: durationFor(),
      },
    );

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

  // Placement. When the layout key changes the box and tiles are already in
  // their new cells; Flip plays them in from where select() recorded them.
  // A tile whose path would cross the box instead leaves a ghost behind that
  // fades out while the real tile fades in at its new cell.
  useIsomorphicLayoutEffect(() => {
    const overlay = overlayRef.current;
    const move = moveRef.current;
    moveRef.current = null;
    if (!overlay || !move) return;

    // Drop whatever an earlier move left running, so the new cells measure clean.
    const els = [move.box, ...move.tiles].map((piece) => piece.el);
    ghostsRef.current.forEach((ghost) => {
      gsap.killTweensOf(ghost);
      ghost.remove();
    });
    ghostsRef.current = [];
    Flip.killFlipsOf(els);
    gsap.killTweensOf(els);
    gsap.set(els, { clearProps: "transform,opacity" });

    const boxNow = move.box.el.getBoundingClientRect();
    const flipOptions = {
      duration: QUOTES_MOVE_DURATION_S,
      ease: QUOTES_MOVE_EASE,
      overwrite: true,
    };
    Flip.from(move.box.state, flipOptions);

    move.tiles.forEach((tile) => {
      const next = tile.el.getBoundingClientRect();
      const moved =
        Math.abs(next.left - tile.rect.left) > 1 ||
        Math.abs(next.top - tile.rect.top) > 1;
      if (!moved) return;

      if (!crossesBox(tile.rect, next, [move.box.rect, boxNow])) {
        Flip.from(tile.state, flipOptions);
        return;
      }

      const ghost = placeGhost(overlay, tile);
      ghostsRef.current.push(ghost);
      gsap.to(ghost, {
        opacity: 0,
        duration: QUOTES_TILE_FADE_OUT_S,
        ease: QUOTES_TILE_FADE_EASE,
        onComplete: () => ghost.remove(),
      });
      gsap.fromTo(
        tile.el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: QUOTES_TILE_FADE_IN_S,
          delay: QUOTES_TILE_FADE_IN_DELAY_S,
          ease: QUOTES_TILE_FADE_EASE,
        },
      );
    });
  }, [layoutKey]);

  // Anything still moving when the section unmounts.
  useIsomorphicLayoutEffect(() => {
    const ghosts = ghostsRef;
    return () => {
      ghosts.current.forEach((ghost) => ghost.remove());
      ghosts.current = [];
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
      // Only a reversal needs the lines brought back. When an exit finished,
      // `shown` just caught up and the entrance effect owns the new quote.
      if (exitingRef.current) {
        exitingRef.current = false;
        gsap.to([...lines, author], {
          yPercent: 0,
          opacity: 1,
          duration: QUOTES_IN_DURATION_S,
          ease: QUOTES_IN_EASE,
          overwrite: "auto",
        });
      }
      return;
    }

    hasSwappedRef.current = true;
    exitingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        exitingRef.current = false;
        setShown(active);
      },
    });
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

  return {
    marqueeRef,
    overlayRef,
    quoteRef,
    authorRef,
    active,
    shown,
    layoutKey,
    select,
  };
}
