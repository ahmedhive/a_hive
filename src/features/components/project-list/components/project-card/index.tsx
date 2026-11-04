import Image from "next/image";
import Link from "next/link";
import { getWorkHref } from "@/data/works";
import TagList from "../../../tag-list";
import { IProjectCardProps } from "./project-card.interface";

export default function ProjectCard(props: IProjectCardProps) {
  const { work, priority } = props;
  const href = getWorkHref(work.slug);

  return (
    // Hovering anywhere on the card zooms its image, as in the reference.
    // Every second card sits lower, which staggers the two columns; the
    // columns collapse to one below 640px, where the offset goes.
    <li className="group/card sm:nth-[2n]:mt-12 lg:nth-[2n]:mt-20">
      <Link
        href={href}
        aria-label={work.title}
        className="mb-5 block aspect-square overflow-hidden rounded-2xl sm:mb-6 sm:rounded-3xl lg:mb-8 lg:rounded-[40px]"
      >
        <Image
          src={work.listImage}
          alt=""
          priority={priority}
          sizes="(min-width: 1680px) 810px, (min-width: 640px) 45vw, 100vw"
          className="size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover/card:scale-115"
        />
      </Link>
      <div className="flex flex-col gap-4 lg:gap-5">
        <h3 className="text-[clamp(1.5rem,1.2573rem+1.0356vw,2.5rem)] leading-none font-normal uppercase">
          <Link
            href={href}
            className="underline decoration-transparent decoration-[3px] transition-[color,text-decoration-color] duration-300 hover:text-charcoal hover:decoration-charcoal"
          >
            {work.title}
          </Link>
        </h3>
        <TagList tags={work.tags} />
      </div>
    </li>
  );
}
