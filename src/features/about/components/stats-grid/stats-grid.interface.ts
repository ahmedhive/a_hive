import { StaticImageData } from "next/image";

export interface IStat {
  value: string;
  label: string;
  // Box fill and text color classes.
  boxClassName: string;
  // Corner shape drawn in the box, with its placement and tablet size.
  visual: StaticImageData;
  visualClassName: string;
}
