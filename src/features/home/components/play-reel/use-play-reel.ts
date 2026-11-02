import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib";
import {
  REEL_BOX_FROM,
  REEL_BOX_TO,
  REEL_SCRUB_S,
  REEL_SCROLL_END,
  REEL_SCROLL_QUERY,
  REEL_SCROLL_START,
  REEL_WORD_FADE_FRACTION,
  REEL_WORD_OFFSET_VW,
} from "./play-reel.data";

export default function usePlayReel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const firstWordRef = useRef<HTMLHeadingElement>(null);
  const lastWordRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  // Like the reference, the reel waits for the viewer to press play. It
  // pauses while off screen and resumes on return if it was playing.
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const sync = () => {
    const video = videoRef.current;
    if (!video) return;
    if (visibleRef.current && playingRef.current) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  useIsomorphicLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Any visible part counts: the video element is full-screen but the
    // framed box clips it to a fraction of that at the start of the scroll,
    // and pressing play there must still play.
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
    sync();
  };

  // The reference's scrubbed timeline. The CSS (index.tsx) pins the stage and
  // sizes the box under the same query; matchMedia reverts everything this
  // creates when the query stops matching, handing the layout back to the
  // plain static one.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const mask = maskRef.current;
    const firstWord = firstWordRef.current;
    const lastWord = lastWordRef.current;
    if (!track || !mask || !firstWord || !lastWord) return;

    const mm = gsap.matchMedia();

    mm.add(REEL_SCROLL_QUERY, () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: REEL_SCROLL_START,
          end: REEL_SCROLL_END,
          scrub: REEL_SCRUB_S,
        },
      });

      tl.fromTo(
        mask,
        {
          width: REEL_BOX_FROM.width,
          height: REEL_BOX_FROM.height,
          borderRadius: REEL_BOX_FROM.radius,
        },
        {
          width: REEL_BOX_TO.width,
          height: REEL_BOX_TO.height,
          borderRadius: REEL_BOX_TO.radius,
          duration: 1,
        },
        0,
      )
        .fromTo(
          firstWord,
          { x: "0vw" },
          { x: `${REEL_WORD_OFFSET_VW}vw`, duration: 1 },
          0,
        )
        .fromTo(
          lastWord,
          { x: "0vw" },
          { x: `-${REEL_WORD_OFFSET_VW}vw`, duration: 1 },
          0,
        )
        .fromTo(
          [firstWord, lastWord],
          { opacity: 0 },
          { opacity: 1, duration: REEL_WORD_FADE_FRACTION },
          0,
        );
    });

    // Pinned geometry changes the page height the other triggers measured.
    ScrollTrigger.refresh();

    return () => mm.revert();
  }, []);

  return {
    trackRef,
    maskRef,
    firstWordRef,
    lastWordRef,
    videoRef,
    playing,
    toggle,
  };
}
