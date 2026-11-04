import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { PAGE_SEO } from "@/data/site";
import { Contact } from "@/features";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  ...PAGE_SEO.contact,
  path: ROUTES.CONTACT,
});

export default function Page() {
  return <Contact />;
}
