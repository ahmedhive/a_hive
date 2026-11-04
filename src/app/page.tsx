import type { Metadata } from "next";
import { JsonLd } from "@/components";
import { ROUTES } from "@/constants/routes";
import { PAGE_SEO } from "@/data/site";
import { getHomeStructuredData } from "@/data/structured-data";
import { Home } from "@/features";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  ...PAGE_SEO.home,
  path: ROUTES.HOME,
});

export default function Page() {
  return (
    <>
      <JsonLd data={getHomeStructuredData()} />
      <Home />
    </>
  );
}
