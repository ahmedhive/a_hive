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
  HERO_IMAGE_REVEAL_EASE,
  HERO_IMAGE_REVEAL_START_S,
  HERO_TITLE_REVEAL_DURATION_S,
  HERO_TITLE_REVEAL_EASE,
  HERO_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./hero-banner.data";

export default function useHeroBanner() {
  const captionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLSpanElement>(null);

  // Nothing is CSS-pre-hidden, so skipping the tweens under reduced motion
  // leaves everything visible.
  useIsomorphicLayoutEffect(() => {
    const caption = captionRef.current;
    const title = titleRef.current;
    const image = imageRef.current;
    if (!caption || !title || !image) return;
    if (prefersReducedMotion()) return;

    const split = SplitText.create(title, {
      type: "chars, words",
      mask: "chars",
      charsClass: "char",
    });

    const titleTl = gsap.timeline();
    titleTl
      .from(split.chars, {
        yPercent: -100,
        opacity: 0,
        duration: HERO_TITLE_REVEAL_DURATION_S,
        stagger: { amount: HERO_TITLE_REVEAL_STAGGER_AMOUNT_S },
        ease: HERO_TITLE_REVEAL_EASE,
      })
      .from(
        image,
        { scale: 0, ease: HERO_IMAGE_REVEAL_EASE },
        HERO_IMAGE_REVEAL_START_S,
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
      titleTl.revert();
      captionTween.scrollTrigger?.kill();
      captionTween.revert();
      split.revert();
    };
  }, []);

  return { captionRef, titleRef, imageRef };
}
