import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { PAGE_SEO } from "@/data/site";
import { Services } from "@/features";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  ...PAGE_SEO.services,
  path: ROUTES.SERVICES,
});

export default function Page() {
  return <Services />;
}
