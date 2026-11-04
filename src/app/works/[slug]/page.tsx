import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { WORK_DETAIL_SLUGS, getWorkDetails } from "@/data/work-details";
import { getWorkBySlug } from "@/data/works";
import { WorkDetails } from "@/features";

interface IPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return WORK_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: IPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);
  if (!work || !getWorkDetails(slug)) return {};

  return {
    title: `${work.title} | Ahmed Hive`,
    description: work.description,
    alternates: { canonical: `${ROUTES.WORKS}/${slug}` },
  };
}

export default async function Page(props: IPageProps) {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);
  const details = getWorkDetails(slug);
  // A project whose page isn't written yet (or a mistyped link) lands on the
  // full list of works.
  if (!work || !details) redirect(ROUTES.WORKS);

  return <WorkDetails work={work} details={details} />;
}
