import { ROUTES } from "@/constants/routes";
import {
  PAGE_SEO,
  SITE_BIO,
  SITE_LOCATION,
  SITE_NAME,
  SITE_PROFILE_URLS,
  SITE_SERVICES,
  SITE_SUMMARY,
  getAbsoluteUrl,
  getWorkSeoHeading,
} from "@/data/site";
import { WORK_DETAIL_SLUGS } from "@/data/work-details";
import { getWorkBySlug, getWorkHref } from "@/data/work";

export const dynamic = "force-static";

// A plain-text summary for AI crawlers: who this is, what is offered, and
// where the case studies live. Built from the same facts as the metadata.
export function GET() {
  const caseStudies = WORK_DETAIL_SLUGS.flatMap((slug) => {
    const work = getWorkBySlug(slug);
    if (!work) return [];
    return [
      `- [${getWorkSeoHeading(slug, work.title)}](${getAbsoluteUrl(getWorkHref(slug))}): ${work.description}`,
    ];
  });

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_BIO}. ${SITE_SUMMARY}`,
    "",
    `Based in ${SITE_LOCATION.locality}, ${SITE_LOCATION.country}. ${SITE_LOCATION.remoteNote}`,
    "",
    "## Services",
    "",
    ...SITE_SERVICES.map(
      (service) => `- ${service.name}: ${service.description}`,
    ),
    "",
    "## Pages",
    "",
    `- [Home](${getAbsoluteUrl(ROUTES.HOME)}): ${PAGE_SEO.home.description}`,
    `- [About](${getAbsoluteUrl(ROUTES.ABOUT)}): ${PAGE_SEO.about.description}`,
    `- [Services](${getAbsoluteUrl(ROUTES.SERVICES)}): ${PAGE_SEO.services.description}`,
    `- [Work](${getAbsoluteUrl(ROUTES.WORK)}): ${PAGE_SEO.work.description}`,
    `- [Contact](${getAbsoluteUrl(ROUTES.CONTACT)}): ${PAGE_SEO.contact.description}`,
    "",
    "## Case studies",
    "",
    ...caseStudies,
    "",
    "## Profiles",
    "",
    ...SITE_PROFILE_URLS.map((url) => `- ${url}`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
