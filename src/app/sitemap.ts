import type { MetadataRoute } from "next";
import { ROUTES } from "@/constants/routes";
import { SITEMAP_STATIC_ROUTES, getAbsoluteUrl } from "@/data/site";
import { WORK_DETAIL_SLUGS } from "@/data/work-details";
import { getWorkHref } from "@/data/work";

// Tag pages are left out on purpose: they only re-list projects that have
// their own pages, and are marked noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = WORK_DETAIL_SLUGS.map((slug) => ({
    url: getAbsoluteUrl(getWorkHref(slug)),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const pages = SITEMAP_STATIC_ROUTES.map((path) => ({
    url: getAbsoluteUrl(path),
    changeFrequency:
      path === ROUTES.HOME ? ("monthly" as const) : ("yearly" as const),
    priority: path === ROUTES.HOME ? 1 : 0.8,
  }));

  return [...pages, ...caseStudies];
}
