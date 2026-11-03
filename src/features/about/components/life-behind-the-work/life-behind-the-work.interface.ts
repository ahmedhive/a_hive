import type { StaticImageData } from "next/image";

export interface ILifeMoment {
  image: StaticImageData;
  // Resting tilt in degrees, kept at every size.
  tiltDeg: number;
  // On the list item: from `lg`, how far it tucks under the card before it.
  overlapClassName: string;
}
