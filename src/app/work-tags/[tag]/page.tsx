import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { getTagBySlug, getWorksByTag } from "@/data/work-tags";
import { WorkTags } from "@/features";

interface IPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata(props: IPageProps): Promise<Metadata> {
  const { tag: slug } = await props.params;
  const tag = getTagBySlug(slug);
  if (!tag) return {};

  return {
    title: `${tag} Works | Ahmed Hive`,
    description: `Products shipped by Ahmed Hive tagged ${tag}.`,
    alternates: { canonical: `${ROUTES.WORK_TAGS}/${slug}` },
  };
}

export default async function Page(props: IPageProps) {
  const { tag: slug } = await props.params;
  const tag = getTagBySlug(slug);
  // A tag no work carries (a mistyped or old link) has nothing to show, so the
  // visitor lands on the full list instead of an error page.
  if (!tag) redirect(ROUTES.WORKS);

  return <WorkTags tag={tag} works={getWorksByTag(tag)} />;
}
