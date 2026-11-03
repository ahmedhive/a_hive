import { connection } from "next/server";
import { DecorativeLines } from "@/components";
import {
  TAPERED_LINE_GAP_PX,
  TAPERED_LINE_HEIGHTS_PX,
  TAPERED_LINE_RESPONSIVE_HEIGHTS,
} from "@/components/decorative-lines/decorative-lines.data";
import { cn, shuffle } from "@/lib/utils";
import { ProjectList, WorksHero } from "../components";
import { IWorkTagsProps } from "./work-tags.interface";

export default async function WorkTags(props: IWorkTagsProps) {
  const { tag, works } = props;

  // Like the works page, the projects come in a new random order on every
  // visit, so this page is rendered per request.
  await connection();

  return (
    <main>
      <WorksHero title={tag} />
      <DecorativeLines
        heights={TAPERED_LINE_HEIGHTS_PX}
        gap={TAPERED_LINE_GAP_PX}
        lineClassName="bg-wine"
        className={cn("mt-1 w-full", TAPERED_LINE_RESPONSIVE_HEIGHTS)}
      />
      <section className="px-[5%] py-16 text-black-secondary sm:py-20 md:py-25 lg:py-37.5">
        <div className="mx-auto w-full max-w-420">
          <ProjectList works={shuffle(works)} />
        </div>
      </section>
    </main>
  );
}
