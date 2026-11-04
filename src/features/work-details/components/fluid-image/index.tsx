import Image from "next/image";
import { cn } from "@/lib/utils";
import { IFluidImageProps } from "./fluid-image.interface";

// A full-width image cropped to the box the className describes.
export default function FluidImage(props: IFluidImageProps) {
  const { image, alt, className, priority } = props;

  return (
    <div className={cn("relative w-full", className)}>
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
