import { ROUTES } from "@/constants/routes";

export const SITE_URL = "https://ahmedhive.com";
export const SITE_NAME = "Ahmed Hive";
export const SITE_ROLE = "Product Manager and Product Designer";

// The one-line bio, worded the same wherever it is quoted (metadata,
// structured data, llms.txt) so every source agrees.
export const SITE_BIO = `${SITE_NAME}, ${SITE_ROLE}`;

export const SITE_SUMMARY =
  "Freelance product manager and product designer helping founders and startups go from idea to MVP with product strategy, product discovery and design. 8+ years building products, 200+ projects shipped for founders and product teams.";

// Where the business is based and who it serves; the same facts appear in the
// About and Contact copy.
export const SITE_LOCATION = {
  locality: "Lahore",
  country: "Pakistan",
  remoteNote: "Works remotely with founders and teams worldwide.",
} as const;

// External profiles that carry the same bio, linked from the structured data.
export const SITE_PROFILE_URLS = [
  "https://www.linkedin.com/in/ahmedhive/",
  "https://instagram.com/ahmedhiivee",
] as const;

export const SITE_SERVICES = [
  {
    name: "Product discovery",
    description:
      "User research, competitive analysis, usability testing, personas, discovery workshops and journey mapping.",
  },
  {
    name: "Product strategy",
    description:
      "Roadmap planning, PRD writing, user stories, feature prioritization, OKRs, go-to-market strategy and product vision.",
  },
  {
    name: "Product design and alignment",
    description:
      "Product design for mobile and web apps, from the first wireframe to the final screen, kept in step with the roadmap.",
  },
  {
    name: "AI-native flows",
    description:
      "AI features and assistants planned and designed into the product from the start.",
  },
] as const;

const SITE_BASE = `${SITE_LOCATION.locality}, ${SITE_LOCATION.country}`;

interface IPageSeo {
  title: string;
  description: string;
}

// Titles and descriptions for the fixed pages. Claims here are limited to
// what the site itself shows (years, project count, the five case studies).
export const PAGE_SEO = {
  home: {
    title: "Ahmed Hive | Freelance Product Manager & Product Designer",
    description:
      "Freelance product manager and designer helping founders and startups go from idea to MVP with strategy, discovery and design. 8+ years, 200+ projects.",
  },
  about: {
    title: "About Ahmed | Product Manager Who Designs",
    description: `8+ years turning ideas into shipped products. Product management first, design second, based in ${SITE_BASE} and working remotely with founders worldwide.`,
  },
  services: {
    title: "Product Strategy, Discovery & MVP Design Services | Ahmed Hive",
    description:
      "Product discovery, roadmaps, PRDs and product design for startups and product teams. One person from first idea to final screen.",
  },
  works: {
    title: "Product Case Studies: SaaS, Mobile & Web Apps | Ahmed Hive",
    description:
      "Real products I planned and designed: fintech, events, fitness, healthcare CRM and delivery apps, from the first roadmap to the shipped product.",
  },
  contact: {
    title: "Hire a Product Manager for Your Startup | Ahmed Hive",
    description: `Have an idea or an MVP to shape? Get in touch and get a clear plan for what to build first. Remote-friendly, based in ${SITE_BASE}.`,
  },
} satisfies Record<string, IPageSeo>;

// Case-study headings lead with the project and name what kind of product it
// is, following "[Project]: [Keyword] Case Study".
const WORK_SEO_HEADINGS: Record<string, string> = {
  "kayya-in-house-financing-platform":
    "Kayya: Fintech Financing Platform Case Study",
  "ebraingo-end-to-end-event-platform":
    "eBrainGo: Event Platform Product Case Study",
  "gearup-mma-martial-arts-booking":
    "GearUp MMA: Fitness Booking App Case Study",
  "clinics-flo-all-in-one-clinic-crm": "Clinics Flo: Healthcare CRM Case Study",
  "mr-delivery-on-demand-delivery-app":
    "Mr. Delivery: On-Demand Delivery App Case Study",
};

export function getWorkSeoHeading(slug: string, fallbackTitle: string) {
  return WORK_SEO_HEADINGS[slug] ?? `${fallbackTitle} Case Study`;
}

export function getWorkSeoTitle(slug: string, fallbackTitle: string) {
  return `${getWorkSeoHeading(slug, fallbackTitle)} | ${SITE_NAME}`;
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export const SITEMAP_STATIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.SERVICES,
  ROUTES.WORKS,
  ROUTES.CONTACT,
] as const;
