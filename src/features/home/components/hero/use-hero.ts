import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  CONTRAST_ALPHA_THRESHOLD,
  CONTRAST_CANVAS_MAX_DIMENSION_PX,
  CONTRAST_DARK_LUMINANCE_THRESHOLD,
  CONTRAST_MIN_DARK_RATIO,
  CONTRAST_MIN_PHOTO_COVERAGE_RATIO,
  CONTRAST_RESIZE_DEBOUNCE_MS,
  DESCRIPTION_REVEAL_DURATION_S,
  DESCRIPTION_REVEAL_EASE,
  DESCRIPTION_REVEAL_STAGGER_AMOUNT_S,
  DESCRIPTION_REVEAL_START_S,
  IMAGE_REVEAL_DURATION_S,
  IMAGE_REVEAL_EASE,
  IMAGE_REVEAL_SCALE_X_FROM,
  IMAGE_REVEAL_SCALE_Y_FROM,
  IMAGE_REVEAL_START_S,
  PROOF_AREA_REVEAL_DURATION_S,
  PROOF_AREA_REVEAL_EASE,
  PROOF_AREA_REVEAL_Y_PX,
  SOCIAL_LINKS_REVEAL_START_S,
  STAT_REVEAL_START_S,
  SUBTITLE_REVEAL_DURATION_S,
  SUBTITLE_REVEAL_EASE,
  SUBTITLE_REVEAL_STAGGER_AMOUNT_S,
  SUBTITLE_REVEAL_START_S,
  TITLE_REVEAL_DURATION_S,
  TITLE_REVEAL_EASE,
  TITLE_REVEAL_STAGGER_AMOUNT_S,
  TITLE_REVEAL_START_S,
} from "./hero.data";
import {
  getRegionStatsFromImageData,
  isRegionDark,
  mapRectToNaturalSpace,
  naturalRectToCanvasRect,
  TObjectFit,
} from "./hero.utils";

gsap.registerPlugin(SplitText);

// Runs before paint so the SplitText mask/GSAP "from" state is applied
// before the browser ever shows the raw, unsplit text.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function useHero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const foregroundImgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Populated with the SplitText .char spans once the intro's split runs
  // (see the GSAP effect below) — the same per-character elements used for
  // the reveal animation double as the units recomputeContrast colors
  // independently, so only the glyphs actually over a dark region switch.
  const subtitleCharsRef = useRef<HTMLElement[]>([]);
  const descriptionCharsRef = useRef<HTMLElement[]>([]);

  // Re-measures where each subtitle/description character currently sits
  // relative to the foreground photo and samples the already-drawn offscreen
  // canvas (see handleForegroundImageLoad) to decide whether that single
  // character should switch to a light color — colors are set directly on
  // each char span (same imperative-DOM style GSAP itself uses here), not
  // via React state, so only the overlapping glyphs change, never the whole
  // block. Safe to call before its refs/canvas/chars are ready (no-ops) so
  // it can be triggered from onLoad, the GSAP intro's onComplete, and a
  // resize observer without any ordering requirement between them.
  const recomputeContrast = () => {
    const img = foregroundImgRef.current;
    const canvas = canvasRef.current;
    const imageContainer = imageRef.current;
    if (!img || !canvas || !imageContainer) return;
    if (
      subtitleCharsRef.current.length === 0 &&
      descriptionCharsRef.current.length === 0
    )
      return;

    // The image container is scaled in by GSAP (see the intro timeline
    // below); getBoundingClientRect() on the <img> reflects that transform,
    // so a call mid-tween (e.g. onLoad firing before the intro even starts)
    // would measure a squashed box and produce garbage geometry. Skip until
    // GSAP reports the scale has actually settled at 1 — a later trigger
    // (onComplete, or the next resize) will produce the real computation.
    const scaleX = gsap.getProperty(imageContainer, "scaleX") as number;
    const scaleY = gsap.getProperty(imageContainer, "scaleY") as number;
    if (Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const objectFit = getComputedStyle(img).objectFit as TObjectFit;
    const boxRect = img.getBoundingClientRect();
    // One canvas readback per recompute (not per character): each char below
    // just indexes into this same buffer.
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const applyContrast = (chars: HTMLElement[]) => {
      for (const char of chars) {
        const targetRect = char.getBoundingClientRect();
        const naturalRect = mapRectToNaturalSpace(
          targetRect,
          boxRect,
          img.naturalWidth,
          img.naturalHeight,
          objectFit,
        );
        if (!naturalRect) {
          char.style.color = "";
          continue;
        }

        const canvasRect = naturalRectToCanvasRect(
          naturalRect,
          img.naturalWidth,
          img.naturalHeight,
          canvas.width,
          canvas.height,
        );
        const stats = getRegionStatsFromImageData(
          imageData,
          canvasRect,
          CONTRAST_ALPHA_THRESHOLD,
          CONTRAST_DARK_LUMINANCE_THRESHOLD,
        );
        const isDark = isRegionDark(
          stats,
          CONTRAST_MIN_PHOTO_COVERAGE_RATIO,
          CONTRAST_MIN_DARK_RATIO,
        );
        char.style.color = isDark ? "var(--white)" : "";
      }
    };

    applyContrast(subtitleCharsRef.current);
    applyContrast(descriptionCharsRef.current);
  };

  // Draws the raw foreground photo (alpha intact) into a downscaled offscreen
  // canvas once it's decoded — the photo content never changes, only its
  // on-screen crop does, so this only needs to run once per image load.
  const handleForegroundImageLoad = () => {
    const img = foregroundImgRef.current;
    if (!img) return;

    if (!canvasRef.current)
      canvasRef.current = document.createElement("canvas");
    const canvas = canvasRef.current;

    const longEdge = Math.max(img.naturalWidth, img.naturalHeight);
    const downscale = Math.min(1, CONTRAST_CANVAS_MAX_DIMENSION_PX / longEdge);
    canvas.width = Math.round(img.naturalWidth * downscale);
    canvas.height = Math.round(img.naturalHeight * downscale);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    recomputeContrast();
  };

  // Not gated by useIsomorphicLayoutEffect like the GSAP setup below: the
  // subtitle/description stay hidden behind their SplitText reveal mask
  // until several seconds into the intro (see SUBTITLE_REVEAL_START_S /
  // DESCRIPTION_REVEAL_START_S), which is ample time for the image to load
  // and the first recomputeContrast() to land before either is ever shown.
  useEffect(() => {
    const img = foregroundImgRef.current;
    if (!img) return;

    const debouncedRecompute = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(
        recomputeContrast,
        CONTRAST_RESIZE_DEBOUNCE_MS,
      );
    };

    const resizeObserver = new ResizeObserver(debouncedRecompute);
    resizeObserver.observe(img);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const bg = bgRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const socialLinks = socialLinksRef.current;
    const stat = statRef.current;
    if (
      !bg ||
      !image ||
      !title ||
      !subtitle ||
      !description ||
      !socialLinks ||
      !stat
    )
      return;

    // type includes "words" (not just "chars"): with chars-only, each letter
    // is its own atomic inline-block with no DOM whitespace tying it to its
    // neighbors, so the browser can wrap a line between any two letters, not
    // just at real spaces (confirmed: was splitting "Digital" into "D" / "igital").
    // Word-level wrappers keep each word shrink-to-fit on one line while still
    // exposing .chars for the per-character stagger animation below.
    // charsClass names the generated mask wrapper "char-mask" (SplitText
    // suffixes "-mask" onto whatever class the char itself gets), which
    // globals.css gives overflow-clip-margin so diagonal glyphs (e.g. "A")
    // that ink slightly past their advance-width box don't get clipped.
    const splitConfig = {
      type: "chars, words",
      mask: "chars",
      charsClass: "char",
    } as const;
    const titleSplit = SplitText.create(title, splitConfig);
    const subtitleSplit = SplitText.create(subtitle, splitConfig);
    const descriptionSplit = SplitText.create(description, splitConfig);
    subtitleCharsRef.current = subtitleSplit.chars as HTMLElement[];
    descriptionCharsRef.current = descriptionSplit.chars as HTMLElement[];

    const tl = gsap.timeline({ onComplete: recomputeContrast });

    // fromTo (not from) for persistent DOM nodes: React StrictMode's dev-only
    // double-invoke (mount -> cleanup -> mount) kills the first timeline right
    // after immediateRender applies its "from" inline styles, and a plain
    // .from() on the second run would then read that leftover value as its
    // implicit "to" state, freezing the element. Explicit to-values sidestep
    // that. SplitText-driven chars below don't need this: split.revert() in
    // cleanup destroys the char DOM entirely, so there's nothing to leak.
    //
    // bg and image are tweened together (same array, same from/to/duration/
    // ease) rather than as one nested pair, because they can't share a DOM
    // subtree: image needs to paint above the text (person occludes the
    // title) while bg needs to stay below it (gradient never covers text) —
    // two different stacking positions. GSAP tweening both targets in lockstep
    // keeps them visually indistinguishable from a single scaling layer.
    tl.fromTo(
      [bg, image],
      { scaleX: IMAGE_REVEAL_SCALE_X_FROM, scaleY: IMAGE_REVEAL_SCALE_Y_FROM },
      {
        scaleX: 1,
        scaleY: 1,
        duration: IMAGE_REVEAL_DURATION_S,
        ease: IMAGE_REVEAL_EASE,
      },
      IMAGE_REVEAL_START_S,
    )
      .from(
        titleSplit.chars,
        {
          yPercent: -100,
          duration: TITLE_REVEAL_DURATION_S,
          stagger: { amount: TITLE_REVEAL_STAGGER_AMOUNT_S },
          ease: TITLE_REVEAL_EASE,
        },
        TITLE_REVEAL_START_S,
      )
      .from(
        subtitleSplit.chars,
        {
          yPercent: -100,
          duration: SUBTITLE_REVEAL_DURATION_S,
          stagger: { amount: SUBTITLE_REVEAL_STAGGER_AMOUNT_S },
          ease: SUBTITLE_REVEAL_EASE,
        },
        SUBTITLE_REVEAL_START_S,
      )
      .from(
        descriptionSplit.chars,
        {
          yPercent: -100,
          duration: DESCRIPTION_REVEAL_DURATION_S,
          stagger: { amount: DESCRIPTION_REVEAL_STAGGER_AMOUNT_S },
          ease: DESCRIPTION_REVEAL_EASE,
        },
        DESCRIPTION_REVEAL_START_S,
      )
      .fromTo(
        socialLinks,
        { opacity: 0, y: PROOF_AREA_REVEAL_Y_PX },
        {
          opacity: 1,
          y: 0,
          duration: PROOF_AREA_REVEAL_DURATION_S,
          ease: PROOF_AREA_REVEAL_EASE,
        },
        SOCIAL_LINKS_REVEAL_START_S,
      )
      .fromTo(
        stat,
        { opacity: 0, y: PROOF_AREA_REVEAL_Y_PX },
        {
          opacity: 1,
          y: 0,
          duration: PROOF_AREA_REVEAL_DURATION_S,
          ease: PROOF_AREA_REVEAL_EASE,
        },
        STAT_REVEAL_START_S,
      );

    return () => {
      tl.kill();
      titleSplit.revert();
      subtitleSplit.revert();
      descriptionSplit.revert();
      subtitleCharsRef.current = [];
      descriptionCharsRef.current = [];
    };
  }, []);

  return {
    bgRef,
    imageRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    socialLinksRef,
    statRef,
    foregroundImgRef,
    handleForegroundImageLoad,
  };
}
