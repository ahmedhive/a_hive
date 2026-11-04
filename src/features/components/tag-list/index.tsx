import Link from "next/link";
import { getWorkTagHref } from "@/data/work-tags";
import { cn } from "@/lib/utils";
import { ITagListProps } from "./tag-list.interface";

export default function TagList(props: ITagListProps) {
  const { tags, className } = props;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={getWorkTagHref(tag)}
            className="block rounded-full border border-black-secondary px-3 py-1 text-sm leading-none font-semibold uppercase hover:underline lg:px-5 lg:text-base lg:leading-[1.4]"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
