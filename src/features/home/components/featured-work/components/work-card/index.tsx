import Image from "next/image";
import Link from "next/link";
import { CustomButton } from "@/components";
import { cn } from "@/lib";
import { WORK_CTA_LABEL } from "../../featured-work.data";
import { IWorkCardProps } from "./work-card.interface";
import { RADIUS_CLASS } from "./work-card.data";

export default function WorkCard(props: IWorkCardProps) {
  const { work, index, total } = props;

  return (
    // Pinned (768px+, motion allowed): every card after the first overlaps it
    // from the top, earlier cards stacked higher (zIndex), and the hook
    // offsets/peels them. Otherwise cards sit in normal flow and the zIndex
    // has no effect.
    <article
      style={{ backgroundColor: work.paneColor, zIndex: total - index }}
      className={cn(
        "group relative mx-auto grid w-full max-w-370 grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] overflow-clip md:grid-cols-2",
        RADIUS_CLASS,
        index > 0 &&
          "motion-safe:md:absolute motion-safe:md:inset-x-0 motion-safe:md:top-0",
      )}
    >
      <div className="flex flex-col items-start justify-center px-5 py-8 sm:px-8 sm:py-10 md:py-15 lg:px-15 lg:py-20">
        <h3 className="max-w-none text-(length:--_typography---font-sizes--heading--h4) leading-none font-normal tracking-[-0.01em] text-black-secondary uppercase md:max-w-[18ch]">
          <Link
            href={work.href}
            className="underline decoration-transparent decoration-[3px] transition-[text-decoration-color] duration-300 hover:decoration-black-secondary"
          >
            {work.title}
          </Link>
        </h3>

        <p className="mt-4 mb-8 max-w-130 text-base leading-6 text-black-secondary sm:mt-5 sm:mb-12 lg:mt-6 lg:mb-15 lg:text-xl lg:leading-7.5 2xl:max-w-151.75">
          {work.description}
        </p>

        <CustomButton
          label={WORK_CTA_LABEL}
          href={work.href}
          notchColor={work.paneColor}
        />
      </div>

      <div
        style={{ backgroundColor: work.imagePaneColor }}
        className="flex items-center justify-center p-6 sm:px-8 sm:py-13 md:p-8 xl:py-20"
      >
        <div
          className={cn(
            "relative aspect-square w-full max-w-125 overflow-clip",
            RADIUS_CLASS,
          )}
        >
          <Image
            src={work.image}
            alt={work.title}
            fill
            sizes="(min-width: 768px) 500px, 90vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </article>
  );
}
