import { useRef } from "react";
import { gsap } from "./gsap";
import "./gsap-scroll-trigger";
import { SplitText } from "./gsap-split-text";
import { PLAY_ONCE_ON_ENTER, prefersReducedMotion } from "./utils";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

// Entrance shared by the page hero banners, same as the reference's load
// timeline: the title's characters slide down through a mask while fading in,
// then the inline image (`[data-hero-image]` inside the title, when there is
// one) pops in from nothing partway through. The caption slides up and fades
// in once it is in view.
const TITLE_REVEAL_DURATION_S = 1;
const TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
const TITLE_REVEAL_EASE = "back.inOut";
const IMAGE_REVEAL_START_S = 0.53;
const IMAGE_REVEAL_DURATION_S = 0.5;
const IMAGE_REVEAL_EASE = "power1.inOut";
const CAPTION_REVEAL_DURATION_S = 0.5;
const CAPTION_REVEAL_Y_PX = 30;
const CAPTION_REVEAL_EASE = "power1.out";
const CAPTION_SCROLL_START = "top bottom";

export default function useHeroReveal() {
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

    const charsTween = gsap.from(split.chars, {
      yPercent: -100,
      opacity: 0,
      duration: TITLE_REVEAL_DURATION_S,
      stagger: { amount: TITLE_REVEAL_STAGGER_AMOUNT_S },
      ease: TITLE_REVEAL_EASE,
    });

    // The inline image is optional. Looked up after the split, not held in a
    // ref: SplitText rebuilds the title's markup on revert (StrictMode mounts
    // the effect twice), so a ref would point at a detached copy on the second
    // pass. fromTo with a delay (not a late-positioned .from() in a timeline)
    // so the image holds at scale 0 until its turn, on every mount pass.
    const image = title.querySelector<HTMLElement>("[data-hero-image]");
    const imageTween = image
      ? gsap.fromTo(
          image,
          { scale: 0 },
          {
            scale: 1,
            duration: IMAGE_REVEAL_DURATION_S,
            delay: IMAGE_REVEAL_START_S,
            ease: IMAGE_REVEAL_EASE,
          },
        )
      : null;

    const captionTween = gsap.from(caption, {
      y: CAPTION_REVEAL_Y_PX,
      opacity: 0,
      duration: CAPTION_REVEAL_DURATION_S,
      ease: CAPTION_REVEAL_EASE,
      scrollTrigger: {
        trigger: caption,
        start: CAPTION_SCROLL_START,
        toggleActions: PLAY_ONCE_ON_ENTER,
      },
    });

    // revert() so StrictMode's first pass doesn't leave a hidden end state.
    return () => {
      charsTween.revert();
      imageTween?.revert();
      captionTween.scrollTrigger?.kill();
      captionTween.revert();
      split.revert();
    };
  }, []);

  return { captionRef, titleRef };
}
