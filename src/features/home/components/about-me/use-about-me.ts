import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  TITLE_REVEAL_OPACITY_FROM,
  TITLE_REVEAL_SCROLL_END,
  TITLE_REVEAL_SCROLL_START,
  TITLE_REVEAL_SCRUB,
  TITLE_REVEAL_STAGGER_EACH_S,
} from "./about-me.data";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function useAboutMe() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const split = SplitText.create(title, {
      type: "words",
      wordsClass: "word",
    });

    // fromTo (not from): a scrubbed tween driven by ScrollTrigger has no
    // independent play/replay of its own for StrictMode's double-invoke to
    // race against, but fromTo still keeps both the "from" and "to" state
    // explicit rather than relying on the split words' own current opacity.
    const tween = gsap.fromTo(
      split.words,
      { opacity: TITLE_REVEAL_OPACITY_FROM },
      {
        opacity: 1,
        ease: "none",
        stagger: { each: TITLE_REVEAL_STAGGER_EACH_S },
        scrollTrigger: {
          trigger: title,
          start: TITLE_REVEAL_SCROLL_START,
          end: TITLE_REVEAL_SCROLL_END,
          scrub: TITLE_REVEAL_SCRUB,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, []);

  return { titleRef };
}
