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
  WORK_PEEL_ROTATE_X_DEG,
  WORK_PEEL_Y_PERCENT,
  WORK_STACK_INITIAL,
  WORK_STEP_DURATION_S,
  WORK_STEP_EASE,
  WORK_TIMELINE_STEPS,
  WORK_BADGE_REVEAL_DURATION_S,
  WORK_BADGE_REVEAL_EASE,
  WORK_BADGE_REVEAL_FROM_SCALE,
  WORK_BADGE_REVEAL_START_S,
  WORK_PINNED_QUERY,
  WORK_REVEAL_SCROLL_START,
  WORK_SCROLL_END,
  WORK_SCROLL_START,
  WORK_SCRUB_S,
  WORK_TITLE_REVEAL_DURATION_S,
  WORK_TITLE_REVEAL_EASE,
  WORK_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./featured-work.data";

export default function useFeaturedWork() {
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  // Header reveal — the Steps pattern, plus the sticker popping in once the
  // heading's characters have landed. Nothing is CSS-pre-hidden, so skipping
  // the tween under reduced motion leaves everything visible.
  useIsomorphicLayoutEffect(() => {
    const title = titleRef.current;
    const badge = badgeRef.current;
    if (!title || !badge) return;
    if (prefersReducedMotion()) return;

    const titleSplit = SplitText.create(title, {
      type: "chars, words",
      mask: "chars",
      charsClass: "char",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: WORK_REVEAL_SCROLL_START,
        toggleActions: PLAY_ONCE_ON_ENTER,
      },
    });

    tl.from(titleSplit.chars, {
      yPercent: -100,
      duration: WORK_TITLE_REVEAL_DURATION_S,
      stagger: { amount: WORK_TITLE_REVEAL_STAGGER_AMOUNT_S },
      ease: WORK_TITLE_REVEAL_EASE,
    }).from(
      badge,
      {
        opacity: 0,
        scale: WORK_BADGE_REVEAL_FROM_SCALE,
        duration: WORK_BADGE_REVEAL_DURATION_S,
        ease: WORK_BADGE_REVEAL_EASE,
      },
      WORK_BADGE_REVEAL_START_S,
    );

    // revert() (not kill()) so the sticker's inline start state is cleared:
    // `from` tweens read their end values off the element, so a leftover
    // hidden state from StrictMode's first pass would make the second pass
    // animate from hidden to hidden.
    return () => {
      tl.scrollTrigger?.kill();
      tl.revert();
      titleSplit.revert();
    };
  }, []);

  // Pinned stack. The CSS (index.tsx / work-card) pins the track and overlaps
  // the cards under the same query; this is the reference's scrubbed timeline
  // (see the numbers in featured-work.data.ts). matchMedia reverts everything
  // it created when the query stops matching (resize, reduced motion), handing
  // the layout back to plain flow.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const stack = stackRef.current;
    if (!track || !stack) return;

    const mm = gsap.matchMedia();

    mm.add(WORK_PINNED_QUERY, () => {
      const cards = gsap.utils.toArray<HTMLElement>(stack.children);

      // Resting offsets, applied immediately so the cards behind the front
      // one show as strips from the start.
      cards.forEach((card, i) => {
        const { y, scale } = WORK_STACK_INITIAL[i];
        gsap.set(card, { y, scale });
      });

      const tl = gsap.timeline({ defaults: { ease: WORK_STEP_EASE } });
      const step = { duration: WORK_STEP_DURATION_S };

      WORK_TIMELINE_STEPS.forEach(({ at, peel, forward }) => {
        tl.to(
          cards[peel],
          {
            yPercent: WORK_PEEL_Y_PERCENT,
            rotationX: WORK_PEEL_ROTATE_X_DEG,
            ...step,
          },
          at,
        );
        forward.forEach(({ card, y, scale }) => {
          tl.to(cards[card], { y, scale, ...step }, at);
        });
      });

      // Only the front card is reachable by keyboard and screen readers: one
      // behind another, or already peeled away, would otherwise take focus
      // while invisible. The front moves on once a peel is half done.
      const totalS = tl.duration();
      let currentFront = -1;
      const setFront = (progress: number) => {
        const time = progress * totalS;
        const front = WORK_TIMELINE_STEPS.filter(
          ({ at }) => time >= at + WORK_STEP_DURATION_S / 2,
        ).length;
        if (front === currentFront) return;
        currentFront = front;
        cards.forEach((card, i) => {
          card.inert = i !== front;
        });
      };
      setFront(0);

      // Scrubbed across the track. The timeline stays paused; the trigger
      // drives it.
      ScrollTrigger.create({
        trigger: track,
        start: WORK_SCROLL_START,
        end: WORK_SCROLL_END,
        animation: tl,
        scrub: WORK_SCRUB_S,
        onUpdate: (self) => setFront(self.progress),
      });

      return () => {
        cards.forEach((card) => {
          card.inert = false;
        });
      };
    });

    return () => mm.revert();
  }, []);

  return { headerRef, titleRef, badgeRef, trackRef, stackRef };
}
