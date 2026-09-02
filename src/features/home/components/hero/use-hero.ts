import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  DESCRIPTION_REVEAL_DURATION_S,
  DESCRIPTION_REVEAL_EASE,
  DESCRIPTION_REVEAL_STAGGER_AMOUNT_S,
  DESCRIPTION_REVEAL_START_S,
  HERO_HEAD_CLEARANCE_BUFFER_PX,
  HERO_HEAD_CLEARANCE_MAX_SHRINK_PX,
  HERO_HEAD_TITLE_CLEARANCE_FRACTION,
  HERO_HEAD_TOP_RATIO,
  HERO_LAYOUT_RESIZE_DEBOUNCE_MS,
  HERO_NECK_LINE_BUFFER_PX,
  HERO_NECK_LINE_MAX_SHRINK_PASSES,
  HERO_NECK_LINE_RATIO,
  IMAGE_REVEAL_DURATION_S,
  IMAGE_REVEAL_EASE,
  IMAGE_REVEAL_SCALE_X_FROM,
  IMAGE_REVEAL_SCALE_Y_FROM,
  IMAGE_REVEAL_START_S,
  PARALLAX_MAX_OFFSET_X_PX,
  PARALLAX_MAX_OFFSET_Y_PX,
  PARALLAX_QUICK_TO_DURATION_S,
  PARALLAX_QUICK_TO_EASE,
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
  computeHeadClearanceAdjustment,
  mapNaturalYToClientY,
  parseObjectPositionY,
  TObjectFit,
} from "./hero.utils";

gsap.registerPlugin(SplitText);

// Runs before paint so the SplitText mask/GSAP "from" state is applied
// before the browser ever shows the raw, unsplit text.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function useHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const neckLineSpacerRef = useRef<HTMLDivElement>(null);
  const subtitleRowRef = useRef<HTMLDivElement>(null);
  const contentBlockRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const foregroundImgRef = useRef<HTMLImageElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keeps the photo's head clear of the title above it on desktop, where
  // cover-fit naturally places the person right up against (or over) it.
  // Picks whichever of two mutually-exclusive levers actually has room to
  // work, based on which dimension "cover" is bound by for the current box
  // shape (see computeHeadClearanceAdjustment for the full explanation):
  // shrinking the box from the top (bottom stays anchored, so nothing ever
  // crops off the bottom) when height-bound, or redistributing already-
  // happening crop via object-position when width-bound. Must run before
  // recomputeNeckLineGap at every shared trigger point (image load, resize,
  // the mid-timeline GSAP call) since that function reads the image's
  // resulting geometry to place the content block below it.
  const recomputeHeadClearance = () => {
    const img = foregroundImgRef.current;
    const wrapper = imageWrapperRef.current;
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!img || !wrapper || !section || !title) return;

    // Reset to baseline before measuring — otherwise a previous pass's
    // adjustment would be baked into the "current" box rect this pass
    // measures against.
    wrapper.style.top = "";
    img.style.objectPosition = "";

    // Measured off the section, not img.getBoundingClientRect(): imageRef
    // (img's transformed ancestor) carries the intro's GSAP scale-reveal
    // tween (0.3/0.2 -> 1, see the timeline below) and, post-intro, the
    // cursor parallax's x/y — img's own rendered rect reflects whichever of
    // those happens to be live at call time, which is wrong to build a
    // *layout* decision on. imageRef and imageWrapperRef are both
    // `inset-0` with zero border on the section, so pre-transform their
    // layout box is exactly the section's own border box — using that
    // instead makes this correct regardless of animation state, which is
    // what lets this run immediately at mount (before the reveal tween
    // even starts) instead of needing to wait for it to settle: applying a
    // position change to an already-visible image (as this would be for
    // the entire 1.6-3.1s reveal window otherwise) reads as a jarring
    // snap right as the intro finishes, not just a "safety net for a
    // never-shown state" the way recomputeNeckLineGap's later commit is.
    const boxRect = section.getBoundingClientRect();
    if (boxRect.width <= 0 || boxRect.height <= 0 || img.naturalWidth <= 0)
      return;

    const titleRect = title.getBoundingClientRect();
    const targetClientY =
      titleRect.bottom -
      HERO_HEAD_TITLE_CLEARANCE_FRACTION * titleRect.height +
      HERO_HEAD_CLEARANCE_BUFFER_PX;

    const { topInsetPx, objectPositionY } = computeHeadClearanceAdjustment({
      boxRect,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      headTopNaturalY: img.naturalHeight * HERO_HEAD_TOP_RATIO,
      targetClientY,
      maxShrinkPx: HERO_HEAD_CLEARANCE_MAX_SHRINK_PX,
    });

    wrapper.style.top = `${topInsetPx}px`;
    img.style.objectPosition = `50% ${(objectPositionY * 100).toFixed(2)}%`;
  };

  // Guarantees the subtitle/description/socials/stats block never renders
  // over the person's face/beard, at any breakpoint or aspect ratio, as a
  // safety net with three tiers, tried in order, each only ever moving
  // things further in the safe direction and never past its own natural
  // limit:
  //  0. Grow neckLineSpacerRef into space that already exists but sits
  //     unused below the content (see below).
  //  1. Shrink subtitleRowRef's margin-bottom (the gap to the socials/stat
  //     row below it) — only while the section is already min-height-
  //     clamped (see below); a no-op otherwise.
  //  2. Shrink subtitleRowRef's row-gap (the gap between the subtitle and
  //     description themselves — only relevant at the base breakpoint's
  //     flex-col layout, where they stack; sm:+ lays them out side by side,
  //     so row-gap has no visual effect there) — same gating as tier 1.
  //
  // Deliberately doesn't touch font-size: an earlier version added a 4th/5th
  // tier shrinking the subtitle's and description's own font-size as a
  // last resort (tiers 1-2 alone are structurally capped short of what's
  // needed on some viewports — see below), but that visibly shrank the text
  // more than wanted. Left out for now; tiers 1-2 alone won't guarantee
  // zero overlap on every possible viewport the way the full version did.
  //
  // Growing the section itself (e.g. its min-height) is not an option: the
  // foreground photo is object-position: bottom (index.tsx's always-on
  // "object-bottom" class) inside a box that tracks the section's own
  // rendered height 1:1, so a bottom-anchored image slides down at the same
  // rate the section grows — any "make the section actually taller"
  // mechanism chases its own growth and can never open up separation
  // (confirmed both by proof and by an earlier, reverted attempt at exactly
  // that).
  //
  // Tier 0 is different: at sm:+ (block layout), when natural content is
  // shorter than the CSS min-height floor (min-h-258), the browser still
  // clamps the section to that floor, but block layout — unlike the base
  // breakpoint's flex layout — doesn't redistribute that leftover space
  // toward the content; it just sits unused below it. Growing
  // neckLineSpacer to consume that *already-existing, already-paid-for*
  // slack doesn't change the section's actual rendered height at all (still
  // clamped at the same min-height), so it doesn't move the image either —
  // genuinely free, up to the exact amount of that slack.
  //
  // Tiers 1-2 (shrinking) are gated on that same min-height clamp actually
  // being active right now (see isMinHeightClamped below) — that's what
  // makes shrinking free in exactly the same way tier 0's growth is: with
  // the clamp active, shrinking margin/row-gap doesn't reduce the section's
  // rendered height at all, so it can't move the image. The moment natural
  // content instead exceeds the floor, the clamp isn't active — the
  // section's height *is* the content's height, with no slack to absorb a
  // shrink, so every px shaved off there shaves the same px off the
  // (bottom-anchored) image too, for *zero* benefit: in that regime the
  // content column's own top is set by whatever sits above it, not by its
  // own height, so shrinking it can't move it down at all — confirmed
  // empirically (an earlier version that didn't gate on this pulled the
  // photo visibly upward, and caused a mid-intro layout jump, exactly on
  // the viewports where this regime applies). So on those viewports, this
  // safety net now does less — no image movement, but also no guarantee of
  // fully closing the gap — a known, accepted trade-off.
  const recomputeNeckLineGap = () => {
    const img = foregroundImgRef.current;
    const imageContainer = imageRef.current;
    const section = sectionRef.current;
    const spacer = neckLineSpacerRef.current;
    const subtitleRow = subtitleRowRef.current;
    const contentBlock = contentBlockRef.current;
    if (
      !img ||
      !imageContainer ||
      !section ||
      !spacer ||
      !subtitleRow ||
      !contentBlock
    )
      return;

    const scaleX = gsap.getProperty(imageContainer, "scaleX") as number;
    const scaleY = gsap.getProperty(imageContainer, "scaleY") as number;
    if (Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01) return;

    spacer.style.height = "0px";
    subtitleRow.style.marginBottom = "";
    subtitleRow.style.rowGap = "";
    const baselineMarginPx =
      parseFloat(getComputedStyle(subtitleRow).marginBottom) || 0;
    const baselineRowGapPx =
      parseFloat(getComputedStyle(subtitleRow).rowGap) || 0;
    const totalBudgetPx = baselineMarginPx + baselineRowGapPx;

    const measureDeficit = (): number | null => {
      const boxRect = img.getBoundingClientRect();
      if (boxRect.width <= 0 || boxRect.height <= 0) return null;
      const computedStyle = getComputedStyle(img);
      const objectFit = computedStyle.objectFit as TObjectFit;
      // recomputeHeadClearance (run just before this, see below) may have
      // shifted the live object-position off its bottom-anchored default —
      // read whatever it actually is rather than assuming, so this stays
      // correct regardless of which lever (if either) fired this pass.
      const objectPositionY = parseObjectPositionY(
        computedStyle.objectPosition,
      );
      const naturalY = img.naturalHeight * HERO_NECK_LINE_RATIO;
      const neckLineClientY = mapNaturalYToClientY(
        naturalY,
        boxRect,
        img.naturalWidth,
        img.naturalHeight,
        objectFit,
        objectPositionY,
      );
      if (neckLineClientY === null) return null;

      const contentTop = contentBlock.getBoundingClientRect().top;
      return neckLineClientY + HERO_NECK_LINE_BUFFER_PX - contentTop;
    };

    // Tier 0: how much room already sits unused, right now, between the
    // end of the actual content and the section's own (already-min-height-
    // clamped) bottom edge — measured directly rather than computed
    // algebraically, since the browser has already applied the min-height
    // clamp by the time anything here can observe it. Grows the spacer to
    // consume it, capped at whatever's actually needed.
    //
    // Called twice: once up front, and again after tiers 1-3 (which is why
    // it *grows* spacer relative to its current value rather than resetting
    // to 0 first) — shrinking margin/row-gap/font-size reduces natural
    // content height further, which in block layout can reopen more of
    // this same kind of unused slack that only a second pass can claim.
    const fillFreeSlack = (): number | null => {
      const deficit = measureDeficit();
      if (deficit === null || deficit <= 0) return deficit;

      const sectionPaddingBottomPx =
        parseFloat(getComputedStyle(section).paddingBottom) || 0;
      const freeSlackPx = Math.max(
        0,
        section.getBoundingClientRect().bottom -
          sectionPaddingBottomPx -
          contentBlock.getBoundingClientRect().bottom,
      );
      if (freeSlackPx <= 0) return deficit;

      const currentSpacerPx = parseFloat(spacer.style.height) || 0;
      const additionalSpacerPx = Math.min(freeSlackPx, Math.ceil(deficit));
      spacer.style.height = `${currentSpacerPx + additionalSpacerPx}px`;
      return measureDeficit();
    };

    if (fillFreeSlack() === null) return;

    // Tier 1+2 is only safe to run while the section is *already*
    // min-height-clamped (natural content ≤ the CSS min-height floor) — in
    // that regime shrinking margin/row-gap doesn't reduce the section's
    // actual rendered height at all (still clamped at the same floor), so
    // it can't move the image. The moment natural content instead exceeds
    // the floor (nothing clamping it), the section's height *is* the
    // content's height, with no slack to absorb a shrink — so every px
    // shaved off margin/row-gap there shaves the same px off the section,
    // and the bottom-anchored image right along with it, for zero benefit
    // to the content's position (in that regime the content column's own
    // top is set by what's *above* it, not by its own height — shrinking
    // it can't move it down at all). Skipping tier 1+2 there means some
    // viewports keep whatever margin the deficit check would otherwise
    // have tried to close — accepted for now in exchange for never
    // shrinking the photo.
    const minHeightPx = parseFloat(getComputedStyle(section).minHeight) || 0;
    const isMinHeightClamped =
      section.getBoundingClientRect().height <= minHeightPx + 1;

    if (isMinHeightClamped) {
      // Consumes the margin-bottom budget first, then the row-gap budget —
      // applied as one combined `shrink` total each pass so a single
      // measured deficit can span both knobs at once rather than needing
      // an extra pass per knob.
      let shrink = 0;
      for (let pass = 0; pass <= HERO_NECK_LINE_MAX_SHRINK_PASSES; pass++) {
        const deficit = measureDeficit();
        if (deficit === null || deficit <= 0) return;
        if (shrink >= totalBudgetPx) break; // tier 1+2 exhausted

        shrink = Math.min(totalBudgetPx, shrink + Math.ceil(deficit));
        const marginShrink = Math.min(baselineMarginPx, shrink);
        const rowGapShrink = shrink - marginShrink;
        subtitleRow.style.marginBottom = `${baselineMarginPx - marginShrink}px`;
        subtitleRow.style.rowGap = `${baselineRowGapPx - rowGapShrink}px`;
      }

      // Tiers 1-2 each only ever shrink content, which can reopen the same
      // kind of unused slack tier 0 already claimed once — now that
      // content is as small as these tiers can make it, claim whatever's
      // left.
      fillFreeSlack();
    }
  };

  const handleForegroundImageLoad = () => {
    recomputeHeadClearance();
    recomputeNeckLineGap();
  };

  // Not gated by useIsomorphicLayoutEffect like the GSAP setup below: the
  // subtitle/description stay hidden behind their SplitText reveal mask
  // until several seconds into the intro (see SUBTITLE_REVEAL_START_S /
  // DESCRIPTION_REVEAL_START_S), which is ample time for the image to load
  // and the first recomputeNeckLineGap() to land before either is ever shown.
  useEffect(() => {
    const img = foregroundImgRef.current;
    if (!img) return;

    const debouncedRecompute = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        recomputeHeadClearance();
        recomputeNeckLineGap();
      }, HERO_LAYOUT_RESIZE_DEBOUNCE_MS);
    };

    const resizeObserver = new ResizeObserver(debouncedRecompute);
    resizeObserver.observe(img);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const socialLinks = socialLinksRef.current;
    const stat = statRef.current;
    if (
      !section ||
      !bg ||
      !image ||
      !title ||
      !subtitle ||
      !description ||
      !socialLinks ||
      !stat
    )
      return;

    // Cursor-follow parallax on the foreground image only — text refs above
    // are never touched. Deferred (via the tl.call below) until the intro's
    // scale-in settles, so it never fights that tween; imageRef is safe to
    // reuse as both targets since GSAP tracks x/y and scaleX/scaleY as
    // independent transform components (proven in this codebase already by
    // custom-cursor/index.tsx, which combines quickTo-driven x/y with a
    // separate scale tween on the same element).
    let removeParallaxListeners: (() => void) | null = null;
    const startParallax = () => {
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const xTo = gsap.quickTo(image, "x", {
        duration: reduceMotion ? 0 : PARALLAX_QUICK_TO_DURATION_S,
        ease: PARALLAX_QUICK_TO_EASE,
      });
      const yTo = gsap.quickTo(image, "y", {
        duration: reduceMotion ? 0 : PARALLAX_QUICK_TO_DURATION_S,
        ease: PARALLAX_QUICK_TO_EASE,
      });

      const handlePointerMove = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const nx = gsap.utils.clamp(
          -1,
          1,
          (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
        );
        const ny = gsap.utils.clamp(
          -1,
          1,
          (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
        );
        xTo(nx * PARALLAX_MAX_OFFSET_X_PX);
        yTo(ny * PARALLAX_MAX_OFFSET_Y_PX);
      };
      const handlePointerLeave = () => {
        xTo(0);
        yTo(0);
      };

      section.addEventListener("pointermove", handlePointerMove);
      section.addEventListener("pointerleave", handlePointerLeave);
      removeParallaxListeners = () => {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
      };
    };

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

    const tl = gsap.timeline();

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
      // Commits the neck-line safety gap as soon as the image reveal tween
      // settles at scale 1, and before the subtitle's char reveal starts
      // (SUBTITLE_REVEAL_START_S) — so the block never becomes visible in a
      // pre-safety-net position and then visibly jumps down.
      .call(
        () => {
          recomputeHeadClearance();
          recomputeNeckLineGap();
        },
        [],
        IMAGE_REVEAL_START_S + IMAGE_REVEAL_DURATION_S,
      )
      .call(startParallax, [], IMAGE_REVEAL_START_S + IMAGE_REVEAL_DURATION_S)
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
      removeParallaxListeners?.();
      gsap.killTweensOf(image, ["x", "y"]);
      titleSplit.revert();
      subtitleSplit.revert();
      descriptionSplit.revert();
    };
  }, []);

  return {
    sectionRef,
    bgRef,
    imageRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    socialLinksRef,
    statRef,
    neckLineSpacerRef,
    subtitleRowRef,
    contentBlockRef,
    imageWrapperRef,
    foregroundImgRef,
    handleForegroundImageLoad,
  };
}
