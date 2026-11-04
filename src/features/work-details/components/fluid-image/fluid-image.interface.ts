import { StaticImageData } from "next/image";

export interface IFluidImageProps {
  image: StaticImageData;
  alt: string;
  // Sets the box's shape (an aspect ratio per breakpoint).
  className: string;
  priority?: boolean;
}
