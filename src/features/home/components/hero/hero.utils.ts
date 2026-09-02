export type TObjectFit = "cover" | "contain";

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Given a Y coordinate in the image's natural pixel space, returns where that
// row of pixels currently renders in client (viewport) space, given the
// image's rendered box (boxRect, e.g. img.getBoundingClientRect()) and the
// current object-fit mode.
//
// This assumes object-position: bottom — the hero foreground image's actual,
// always-on "object-bottom" class, confirmed via getComputedStyle: whatever
// the correct anchor is, the scaled image's bottom edge aligns with the
// box's bottom edge in both cover and contain, so a single offset formula
// (no cover/contain branch needed here) is correct for both.
// Returns null when boxRect is degenerate (not yet laid out).
export function mapNaturalYToClientY(
  naturalY: number,
  boxRect: IRect,
  naturalWidth: number,
  naturalHeight: number,
  objectFit: TObjectFit,
): number | null {
  if (boxRect.width <= 0 || boxRect.height <= 0) return null;

  const scale =
    objectFit === "cover"
      ? Math.max(boxRect.width / naturalWidth, boxRect.height / naturalHeight)
      : Math.min(boxRect.width / naturalWidth, boxRect.height / naturalHeight);
  if (!Number.isFinite(scale) || scale <= 0) return null;

  const offsetY = boxRect.height - naturalHeight * scale;
  const localY = naturalY * scale + offsetY;

  // Clamp into the visible box: an extreme crop could in theory place the
  // requested natural-Y off-screen; clamp to a safe, in-bounds fallback
  // rather than returning a client-Y outside the image's own rendered box.
  const clampedLocalY = Math.max(0, Math.min(localY, boxRect.height));

  return boxRect.y + clampedLocalY;
}
