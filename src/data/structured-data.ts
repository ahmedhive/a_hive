import { ROUTES } from "@/constants/routes";
import { IWork } from "@/interfaces";
import { getWorkHref } from "./work";
import {
  SITE_BIO,
  SITE_LOCATION,
  SITE_NAME,
  SITE_PROFILE_URLS,
  SITE_ROLE,
  SITE_SERVICES,
  SITE_SUMMARY,
  SITE_URL,
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
