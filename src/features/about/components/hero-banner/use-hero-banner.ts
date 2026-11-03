import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  HERO_CAPTION_REVEAL_DURATION_S,
  HERO_CAPTION_REVEAL_EASE,
  HERO_CAPTION_REVEAL_Y_PX,
  HERO_CAPTION_SCROLL_START,
  HERO_IMAGE_REVEAL_DURATION_S,
  HERO_IMAGE_REVEAL_EASE,
  HERO_IMAGE_REVEAL_START_S,
  HERO_TITLE_REVEAL_DURATION_S,
  HERO_TITLE_REVEAL_EASE,
  HERO_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./hero-banner.data";

export default function useHeroBanner() {
  const captionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Nothing is CSS-pre-hidden, so skipping the tweens under reduced motion
  // leaves everything visible.
  useIsomorphicLayoutEffect(() => {
    const caption = captionRef.current;
    const title = titleRef.current;
    if (!caption || !title) return;
    if (prefersReducedMotion()) return;

    const split = SplitText.create(title, {
      type: "chars, words",
      mask: "chars",
      charsClass: "char",
    });

    // Looked up after the split, not held in a ref: SplitText rebuilds the
    // title's markup on revert (StrictMode mounts the effect twice), so a
    // ref would point at a detached copy on the second pass.
    const image = title.querySelector<HTMLElement>("[data-hero-image]");
    if (!image) {
      split.revert();
      return;
    }

    const charsTween = gsap.from(split.chars, {
      yPercent: -100,
      opacity: 0,
      duration: HERO_TITLE_REVEAL_DURATION_S,
      stagger: { amount: HERO_TITLE_REVEAL_STAGGER_AMOUNT_S },
      ease: HERO_TITLE_REVEAL_EASE,
    });
    // fromTo with a delay (not a late-positioned .from() in a timeline) so
    // the image holds at scale 0 until its turn, on every mount pass.
    const imageTween = gsap.fromTo(
      image,
      { scale: 0 },
      {
        scale: 1,
        duration: HERO_IMAGE_REVEAL_DURATION_S,
        delay: HERO_IMAGE_REVEAL_START_S,
        ease: HERO_IMAGE_REVEAL_EASE,
      },
    );

    const captionTween = gsap.from(caption, {
      y: HERO_CAPTION_REVEAL_Y_PX,
      opacity: 0,
      duration: HERO_CAPTION_REVEAL_DURATION_S,
      ease: HERO_CAPTION_REVEAL_EASE,
      scrollTrigger: {
        trigger: caption,
        start: HERO_CAPTION_SCROLL_START,
        once: true,
      },
    });

    // revert() so StrictMode's first pass doesn't leave a hidden end state.
    return () => {
      charsTween.revert();
      imageTween.revert();
      captionTween.scrollTrigger?.kill();
      captionTween.revert();
      split.revert();
    };
  }, []);

  return { captionRef, titleRef };
}
