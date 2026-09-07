import { CURSOR_SHAPES, LUMA_OVERRIDES } from "./custom-cursor.data";
import { TBackdrop, TCursorShape } from "./custom-cursor.interface";

export function isCursorShape(value: string | null): value is TCursorShape {
  return !!value && (CURSOR_SHAPES as readonly string[]).includes(value);
}

// Walks up to the nearest mostly-opaque background and reports a colour
// light or dark ink against whatever it's currently over.
//
// Some sections (e.g. the hero) paint their real background with an
// absolutely-positioned sibling layer (an image/gradient div) rather than a
// CSS background-color on an actual ancestor, so a plain ancestor colour
// walk would misread them via whatever background-color happens to sit
// further up (e.g. a fallback colour hidden underneath that layer). Such
// sections opt in with a `data-cursor-luma="dark"|"light"` attribute on
// their common ancestor, checked before the colour walk.
export function solidBgFrom(node: Element | null): TBackdrop | null {
  while (node) {
    const override = node.getAttribute("data-cursor-luma");
    if (override && override in LUMA_OVERRIDES) {
      return { luma: LUMA_OVERRIDES[override] };
    }

    const style = getComputedStyle(node);
    const bg = style.backgroundColor;
    const match = bg.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(",").map((n) => parseFloat(n));
      const alpha = parts[3] === undefined ? 1 : parts[3];
      if (alpha >= 0.5) {
        const [r, g, b] = parts;
        return { luma: 0.2126 * r + 0.7152 * g + 0.0722 * b };
      }
    }
    // An image/gradient paints here; its colour can't be read from CSS, so
    // stop climbing rather than mis-sample an unrelated ancestor further up
    // (e.g. a fallback background-color hidden beneath it). Callers should
    // mark such layers with data-cursor-luma to keep the cursor adaptive.
    if (style.backgroundImage !== "none") return null;

    node = node.parentElement;
  }
  return null;
}
