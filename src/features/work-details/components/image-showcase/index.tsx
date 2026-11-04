import Image from "next/image";
import { cn } from "@/lib/utils";
import { IImageShowcaseProps } from "./image-showcase.interface";

export default function ImageShowcase(props: IImageShowcaseProps) {
  const { images } = props;

  return (
    <section className="px-[5%]">
      <div className="mx-auto grid w-full max-w-420 grid-cols-2 gap-4 sm:gap-6 lg:gap-15">
        {images.map((image, index) => (
          <div
            key={index}
            // The second image sits lower, more so on wider screens.
            className={cn(
              "relative aspect-9/10 overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[40px]",
              index === 1 && "sm:mt-10 md:mt-15 xl:mt-20 2xl:mt-30",
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1680px) 810px, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
