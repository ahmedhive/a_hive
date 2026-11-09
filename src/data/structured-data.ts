import { ROUTES } from "@/constants/routes";
import { IWork } from "@/interfaces";
import { WORK_DETAIL_SLUGS } from "./work-details";
import { WORK, getWorkHref } from "./work";
import {
  SITE_BIO,
  SITE_LOCATION,
  SITE_NAME,
  SITE_PROFILE_URLS,
  SITE_ROLE,
  SITE_SERVICES,
  SITE_SUMMARY,
  SITE_URL,
  PAGE_SEO,
  getAbsoluteUrl,
} from "./site";

const PERSON_ID = `${SITE_URL}/#person`;
const SERVICE_ID = `${SITE_URL}/#service`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// The same person as on the home page, restated with a name so a case-study
// page still reads on its own.
const CREATOR = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
};

// Person, ProfessionalService and WebSite for the home page, linked by @id so
// a crawler reads them as one entity.
export function getHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_BIO,
        publisher: { "@id": PERSON_ID },
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE_NAME,
        jobTitle: SITE_ROLE,
        description: SITE_SUMMARY,
        url: SITE_URL,
        image: getAbsoluteUrl("/og-image.png"),
        sameAs: SITE_PROFILE_URLS,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_LOCATION.locality,
          addressCountry: SITE_LOCATION.country,
        },
        knowsAbout: SITE_SERVICES.map((service) => service.name),
      },
      {
        "@type": "ProfessionalService",
        "@id": SERVICE_ID,
        name: `${SITE_NAME} - Freelance Product Manager & Product Designer`,
        description: SITE_SUMMARY,
        url: SITE_URL,
        image: getAbsoluteUrl("/og-image.png"),
        founder: { "@id": PERSON_ID },
        areaServed: "Worldwide",
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_LOCATION.locality,
          addressCountry: SITE_LOCATION.country,
        },
        sameAs: SITE_PROFILE_URLS,
        makesOffer: SITE_SERVICES.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
          },
        })),
      },
    ],
  };
}

export function getWorkStructuredData(work: IWork) {
  const url = getAbsoluteUrl(getWorkHref(work.slug));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: getAbsoluteUrl(ROUTES.WORK),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: work.title,
            item: url,
          },
        ],
      },
      getWorkCreativeWork(work, url),
    ],
  };
}

function getWorkCreativeWork(work: IWork, url: string) {
  return {
    "@type": "CreativeWork",
    name: work.title,
    description: work.description,
    url,
    keywords: work.tags.join(", "),
    author: CREATOR,
    publisher: CREATOR,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
  };
}

const FIXED_PAGES = {
  about: {
    type: "AboutPage",
    path: ROUTES.ABOUT,
    crumb: "About",
    about: { "@id": PERSON_ID },
  },
  services: {
    type: "WebPage",
    path: ROUTES.SERVICES,
    crumb: "Services",
    about: { "@id": SERVICE_ID },
  },
  work: {
    type: "CollectionPage",
    path: ROUTES.WORK,
    crumb: "Work",
    about: { "@id": PERSON_ID },
  },
  contact: {
    type: "ContactPage",
    path: ROUTES.CONTACT,
    crumb: "Contact",
    about: { "@id": PERSON_ID },
  },
} as const;

// Page type plus breadcrumb for About, Services, Work and Contact, tied to the
// same Person and service entities as the home page.
export function getPageStructuredData(page: keyof typeof FIXED_PAGES) {
  const { type, path, crumb, about } = FIXED_PAGES[page];
  const url = getAbsoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        url,
        name: PAGE_SEO[page].title,
        description: PAGE_SEO[page].description,
        about,
        ...(page === "work" && { mainEntity: getWorkItemList() }),
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: crumb, item: url },
        ],
      },
    ],
  };
}

// The case studies that have a page of their own, in the order the list shows.
function getWorkItemList() {
  const published = WORK.filter((work) =>
    WORK_DETAIL_SLUGS.includes(work.slug),
  );

  return {
    "@type": "ItemList",
    itemListElement: published.map((work, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: work.title,
      url: getAbsoluteUrl(getWorkHref(work.slug)),
    })),
  };
}
