import { CURSOR_SHAPES } from "./custom-cursor.data";
import { TCursorShape } from "./custom-cursor.interface";

export function isCursorShape(value: string | null): value is TCursorShape {
  return !!value && (CURSOR_SHAPES as readonly string[]).includes(value);
}
