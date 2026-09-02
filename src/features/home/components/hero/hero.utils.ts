export type TObjectFit = "cover" | "contain";

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IRegionStats {
  photoCoverageRatio: number;
  darkRatio: number;
}

// Maps targetRect (client-space, e.g. a character span's getBoundingClientRect())
// into the natural-pixel-space of an image rendered into boxRect (client-space,
// e.g. the <img>'s own getBoundingClientRect()) under the given object-fit
// mode. Assumes object-position: 50% 50% (centered) — the only case used
// anywhere in this codebase. Returns null when the rects don't overlap at all.
export function mapRectToNaturalSpace(
  targetRect: IRect,
  boxRect: IRect,
  naturalWidth: number,
  naturalHeight: number,
  objectFit: TObjectFit,
): IRect | null {
  if (boxRect.width <= 0 || boxRect.height <= 0) return null;

  const scale =
    objectFit === "cover"
      ? Math.max(boxRect.width / naturalWidth, boxRect.height / naturalHeight)
      : Math.min(boxRect.width / naturalWidth, boxRect.height / naturalHeight);
  if (!Number.isFinite(scale) || scale <= 0) return null;

  const offsetX =
    objectFit === "cover"
      ? (naturalWidth * scale - boxRect.width) / 2
      : (boxRect.width - naturalWidth * scale) / 2;
  const offsetY =
    objectFit === "cover"
      ? (naturalHeight * scale - boxRect.height) / 2
      : (boxRect.height - naturalHeight * scale) / 2;

  const toNatural = (sx: number, sy: number) =>
    objectFit === "cover"
      ? { x: (sx + offsetX) / scale, y: (sy + offsetY) / scale }
      : { x: (sx - offsetX) / scale, y: (sy - offsetY) / scale };

  const startX = targetRect.x - boxRect.x;
  const startY = targetRect.y - boxRect.y;
  const endX = startX + targetRect.width;
  const endY = startY + targetRect.height;

  const topLeft = toNatural(startX, startY);
  const bottomRight = toNatural(endX, endY);

  const x = Math.max(0, Math.min(topLeft.x, naturalWidth));
  const y = Math.max(0, Math.min(topLeft.y, naturalHeight));
  const right = Math.max(0, Math.min(bottomRight.x, naturalWidth));
  const bottom = Math.max(0, Math.min(bottomRight.y, naturalHeight));

  const width = right - x;
  const height = bottom - y;
  if (width <= 0 || height <= 0) return null;

  return { x, y, width, height };
}

// Scales a natural-space rect into integer pixel coordinates on a canvas
// (possibly downscaled from the original image), clamped to the canvas
// bounds — required since ImageData is indexed by integer pixel.
export function naturalRectToCanvasRect(
  naturalRect: IRect,
  naturalWidth: number,
  naturalHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): IRect {
  const scaleX = canvasWidth / naturalWidth;
  const scaleY = canvasHeight / naturalHeight;

  const x = Math.max(0, Math.floor(naturalRect.x * scaleX));
  const y = Math.max(0, Math.floor(naturalRect.y * scaleY));
  const right = Math.min(
    canvasWidth,
    Math.ceil((naturalRect.x + naturalRect.width) * scaleX),
  );
  const bottom = Math.min(
    canvasHeight,
    Math.ceil((naturalRect.y + naturalRect.height) * scaleY),
  );

  return {
    x,
    y,
    width: Math.max(0, right - x),
    height: Math.max(0, bottom - y),
  };
}

// Reads stats for `region` (in imageData's own pixel coordinates) out of an
// already-fetched ImageData buffer — no canvas readback per call, so this is
// cheap enough to run once per character. Counts alpha-qualifying ("photo")
// pixels and, among those, perceptually-dark ones. Perceptual (not flat
// channel-average) luminance matters since hair/headphones aren't neutral gray.
export function getRegionStatsFromImageData(
  imageData: ImageData,
  region: IRect,
  alphaThreshold: number,
  darkLuminanceThreshold: number,
): IRegionStats {
  const { data, width: bufferWidth, height: bufferHeight } = imageData;

  const x0 = Math.max(0, Math.floor(region.x));
  const y0 = Math.max(0, Math.floor(region.y));
  const x1 = Math.min(bufferWidth, Math.ceil(region.x + region.width));
  const y1 = Math.min(bufferHeight, Math.ceil(region.y + region.height));

  let total = 0;
  let photoCount = 0;
  let darkCount = 0;

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * bufferWidth + x) * 4;
      total += 1;

      const alpha = data[i + 3];
      if (alpha < alphaThreshold) continue;
      photoCount += 1;

      const luminance =
        0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (luminance <= darkLuminanceThreshold) darkCount += 1;
    }
  }

  return {
    photoCoverageRatio: total > 0 ? photoCount / total : 0,
    darkRatio: photoCount > 0 ? darkCount / photoCount : 0,
  };
}

export function isRegionDark(
  stats: IRegionStats,
  minPhotoCoverageRatio: number,
  minDarkRatio: number,
): boolean {
  return (
    stats.photoCoverageRatio >= minPhotoCoverageRatio &&
    stats.darkRatio >= minDarkRatio
  );
}

// Inverse of mapRectToNaturalSpace's Y-axis math: given a Y coordinate in the
// image's natural pixel space, returns where that row of pixels currently
// renders in client (viewport) space, given the image's rendered box
// (boxRect, e.g. img.getBoundingClientRect()) and the current object-fit
// mode. Deliberately duplicates (does not share) the scale formula from
// mapRectToNaturalSpace: that function backs the working contrast feature
// and is intentionally left untouched here.
//
// Unlike mapRectToNaturalSpace (which assumes centered object-position —
// true everywhere it's actually used, since the contrast feature only ever
// samples in a regime with no vertical crop/letterbox slack, where the
// vertical anchor can't matter), this assumes object-position: bottom —
// the hero foreground image's actual, always-on "object-bottom" class,
// confirmed via getComputedStyle. This function IS exercised in regimes
// with real vertical slack (object-fit: contain, width-bound), where the
// anchor matters: whatever the correct anchor is, the scaled image's
// bottom edge aligns with the box's bottom edge in both cover and contain,
// so a single offset formula (no cover/contain branch needed here) is
// correct for both.
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
