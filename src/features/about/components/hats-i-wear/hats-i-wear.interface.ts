import type { StaticImageData } from "next/image";

export interface IHat {
  title: string;
  description: string;
  image: StaticImageData;
  stairClassName: string;
}
