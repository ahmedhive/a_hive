import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  useHeroReveal,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  HERO_CUE_DURATION_S,
  HERO_CUE_EASE,
  HERO_CUE_TRAVEL_Y_PX,
} from "./hero-banner.data";

export default function useHeroBanner() {
  const { captionRef, titleRef } = useHeroReveal();
  const cueRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const cue = cueRef.current;
    if (!cue) return;
    if (prefersReducedMotion()) return;

    const cueTween = gsap.to(cue, {
      y: HERO_CUE_TRAVEL_Y_PX,
      duration: HERO_CUE_DURATION_S,
      ease: HERO_CUE_EASE,
      repeat: -1,
      yoyo: true,
    });

    return () => {
      cueTween.revert();
    };
  }, []);

  return { captionRef, titleRef, cueRef };
}
