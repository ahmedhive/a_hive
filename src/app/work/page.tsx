import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { JsonLd } from "@/components";
import { PAGE_SEO } from "@/data/site";
import { getPageStructuredData } from "@/data/structured-data";
import { Work } from "@/features";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  ...PAGE_SEO.work,
  path: ROUTES.WORK,
});

export default function Page() {
  return (
    <>
      <JsonLd data={getPageStructuredData("work")} />
      <Work />
    </>
  );
}
