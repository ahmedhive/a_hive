import type { Flip } from "@/lib";

export type TQuoteCaption = "person" | "label";

export interface IQuote {
  stat: string;
  quote: string;
  title: string;
  subtitle: string;
  variant: TQuoteCaption;
}

// What select() records about the pieces that are about to change cells, taken
// before React moves them so Flip knows where each one was.
export interface IPlacedPiece {
  el: HTMLElement;
  state: Flip.FlipState;
  rect: DOMRect;
}
export interface IMove {
  box: IPlacedPiece;
  tiles: (IPlacedPiece & { ghost: HTMLElement })[];
}
