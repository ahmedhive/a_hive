import { Flip } from "@/lib";
import { QUOTES_MOVING_SLOTS, QUOTES_PATH_SAMPLES } from "./quotes.data";
import { IMove } from "./quotes.interface";

// Whether a straight path between two rects passes through any of `boxes`.
export const crossesBox = (from: DOMRect, to: DOMRect, boxes: DOMRect[]) => {
  for (let i = 0; i <= QUOTES_PATH_SAMPLES; i++) {
    const t = i / QUOTES_PATH_SAMPLES;
    const x = from.left + from.width / 2 + (to.left - from.left) * t;
    const y = from.top + from.height / 2 + (to.top - from.top) * t;
    if (
      boxes.some((b) => x > b.left && x < b.right && y > b.top && y < b.bottom)
    ) {
      return true;
    }
  }
  return false;
};

// Record where the box and the movable tiles are now, before React moves them.
export const recordMove = (overlay: HTMLElement): IMove | null => {
  const box = overlay.querySelector<HTMLElement>('[data-quotes-area="quote"]');
  const tiles = QUOTES_MOVING_SLOTS.map((slot) =>
    overlay.querySelector<HTMLElement>(`[data-quotes-slot="${slot}"]`),
  );
  if (!box || !tiles.every((tile) => tile)) return null;

  const piece = (el: HTMLElement) => ({
    el,
    state: Flip.getState(el),
    rect: el.getBoundingClientRect(),
  });
  return {
    box: piece(box),
    tiles: (tiles as HTMLElement[]).map((el) => ({
      ...piece(el),
      ghost: el.cloneNode(true) as HTMLElement,
    })),
  };
};

// Drop a tile's copy back into the overlay, at the cell it is leaving, as an
// inert decoration (not a second button) that the caller then fades out.
export const placeGhost = (
  overlay: HTMLElement,
  { ghost, rect }: IMove["tiles"][number],
) => {
  const overlayRect = overlay.getBoundingClientRect();
  ghost.removeAttribute("data-quotes-slot");
  ghost.removeAttribute("aria-pressed");
  ghost.setAttribute("aria-hidden", "true");
  ghost.tabIndex = -1;
  Object.assign(ghost.style, {
    position: "absolute",
    gridArea: "auto",
    pointerEvents: "none",
    left: `${rect.left - overlayRect.left}px`,
    top: `${rect.top - overlayRect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });
  overlay.appendChild(ghost);
  return ghost;
};
