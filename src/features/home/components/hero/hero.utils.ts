export type TObjectFit = "cover" | "contain";

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Given a Y coordinate in the image's natural pixel space, returns where that
// row of pixels currently renders in client (viewport) space, given the
// image's rendered box (boxRect, e.g. img.getBoundingClientRect()), the
// current object-fit mode, and the object-position Y anchor (0 = top-aligned,
// 1 = bottom-aligned, matching the CSS object-position percentage /100 —
// defaults to 1 since the hero foreground image is bottom-anchored by
// default; pass the live value when something has changed it, e.g.
// recomputeHeadClearance's object-position lever below).
// Returns null when boxRect is degenerate (not yet laid out).
export function mapNaturalYToClientY(
  naturalY: number,
  boxRect: IRect,
  naturalWidth: number,
  naturalHeight: number,
  objectFit: TObjectFit,
  objectPositionY = 1,
): number | null {
  if (boxRect.width <= 0 || boxRect.height <= 0) return null;

  const scale =
    objectFit === "cover"
      ? Math.max(boxRect.width / naturalWidth, boxRect.height / naturalHeight)
      : Math.min(boxRect.width / naturalWidth, boxRect.height / naturalHeight);
  if (!Number.isFinite(scale) || scale <= 0) return null;

  const offsetY = (boxRect.height - naturalHeight * scale) * objectPositionY;
  const localY = naturalY * scale + offsetY;

  // Clamp into the visible box: an extreme crop could in theory place the
  // requested natural-Y off-screen; clamp to a safe, in-bounds fallback
  // rather than returning a client-Y outside the image's own rendered box.
  const clampedLocalY = Math.max(0, Math.min(localY, boxRect.height));

  return boxRect.y + clampedLocalY;
}

// Parses the Y component (0-1) out of a computed `object-position` string
// (e.g. "50% 65%" -> 0.65). Falls back to 1 (bottom-anchored, this image's
// default) if the value isn't the "X% Y%" shape we ever actually set —
// keeps mapNaturalYToClientY's assumption correct even if the live style
// hasn't been touched yet.
export function parseObjectPositionY(computedObjectPosition: string): number {
  const parts = computedObjectPosition.trim().split(/\s+/);
  const yPart = parts[1];
  if (!yPart || !yPart.endsWith("%")) return 1;
  const value = parseFloat(yPart) / 100;
  return Number.isFinite(value) ? value : 1;
}

// Computes the two mutually-exclusive levers that can push the hero photo's
// "head" landmark down to clear the title above it, without ever cropping
// content off the bottom of the photo (a plain translate would slide the
// whole box down and lose whatever slides past the section's bottom edge —
// see the "bring the image down" thread this was built for). Which lever
// applies depends entirely on which dimension "cover" is bound by for the
// current box shape:
//  - Height-bound (box is relatively tall/narrow vs. the photo, the
//    "standard desktop" 1024-1450px-ish range in practice): cover already
//    shows the photo's full vertical extent with zero crop, so there's no
//    crop to redistribute — object-position can't do anything here (see
//    parseObjectPositionY's caller for why). Instead, shrink the box's
//    height from the TOP only (bottom stays put) via topInsetPx: this
//    forces a smaller cover scale, zooming the whole photo out a bit and
//    moving everything in it — head included — down, with the bottom edge
//    never moving and therefore never losing content.
//  - Width-bound (very wide screens): cover already crops some of the top
//    off to fit, so redistributing part of that existing crop toward the
//    bottom via objectPositionY reveals more headroom above the head — free,
//    since the box is always 100% covered either way, nothing new is lost.
// Returns the current baseline (topInsetPx: 0, objectPositionY: 1) if the
// head is already clear of the target, or if boxRect is degenerate.
export function computeHeadClearanceAdjustment(params: {
  boxRect: IRect;
  naturalWidth: number;
  naturalHeight: number;
  headTopNaturalY: number;
  targetClientY: number;
  maxShrinkPx: number;
}): { topInsetPx: number; objectPositionY: number } {
  const {
    boxRect,
    naturalWidth,
    naturalHeight,
    headTopNaturalY,
    targetClientY,
    maxShrinkPx,
  } = params;
  const baseline = { topInsetPx: 0, objectPositionY: 1 };
  if (boxRect.width <= 0 || boxRect.height <= 0) return baseline;

  const scaleW = boxRect.width / naturalWidth;
  const scaleH = boxRect.height / naturalHeight;
  const boxBottom = boxRect.y + boxRect.height;
  const naturalBelowHead = naturalHeight - headTopNaturalY;

  if (scaleH >= scaleW) {
    // Height-bound: current head-top position at the default bottom anchor.
    const currentHeadTopY = boxBottom - naturalBelowHead * scaleH;
    if (currentHeadTopY >= targetClientY) return baseline;

    const desiredScale = (boxBottom - targetClientY) / naturalBelowHead;
    const desiredBoxHeight = desiredScale * naturalHeight;
    const shrinkPx = Math.max(0, boxRect.height - desiredBoxHeight);
    return { topInsetPx: Math.min(shrinkPx, maxShrinkPx), objectPositionY: 1 };
  }

  // Width-bound: redistribute existing crop via object-position instead.
  const renderedHeight = naturalHeight * scaleW;
  const cropBudget = renderedHeight - boxRect.height;
  if (cropBudget <= 0) return baseline; // nothing to redistribute

  const currentHeadTopY = boxBottom - naturalBelowHead * scaleW;
  if (currentHeadTopY >= targetClientY) return baseline;

  const posY =
    (targetClientY - boxRect.y - headTopNaturalY * scaleW) /
    (boxRect.height - renderedHeight);
  return { topInsetPx: 0, objectPositionY: Math.max(0, Math.min(1, posY)) };
}
