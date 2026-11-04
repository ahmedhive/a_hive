import { ComponentType, SVGProps } from "react";

export interface IStat {
  value: string;
  label: string;
  // Box fill and text color classes.
  boxClassName: string;
  // Corner shape drawn in the box, with its placement and tablet size.
  Visual: ComponentType<SVGProps<SVGSVGElement>>;
  visualClassName: string;
}
