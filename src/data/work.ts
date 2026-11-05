import {
  Project1FeaturedImg,
  Project1ListImg,
  Project2FeaturedImg,
  Project2ListImg,
  Project3FeaturedImg,
  Project3ListImg,
  Project4FeaturedImg,
  Project4ListImg,
  Project5FeaturedImg,
  Project5ListImg,
} from "@/assets/work";
import { ROUTES } from "@/constants/routes";
import { IFeaturedWork, IWork } from "@/interfaces";

export const MAX_FEATURED_WORK = 5;

// Every project, in the order they were added. The work page shows them in a
// random order on each visit; the home page's stack shows the featured ones in
// this order.
export const WORK: IWork[] = [
  {
    slug: "kayya-in-house-financing-platform",
    title: "Kayya In-House Financing Platform",
    description:
      "Kayya lets businesses offer in-house financing, payment plans, and memberships, with a borrower app, live payment tracking, payouts, and a super admin view over every location.",
    tags: ["Planning", "Design", "Fintech"],
    listImage: Project1ListImg,
    featured: true,
    featuredImage: Project1FeaturedImg,
    paneColor: "#BFE8D6",
    imagePaneColor: "#81CFB8",
  },
  {
    slug: "ebraingo-end-to-end-event-platform",
    title: "eBrainGo End To End Event Platform",
    description:
      "eBrainGo runs events end to end, a company portal to plan them, an attendee app to live them, plus sponsor and speaker portals, gamification, and an AI event assistant built in.",
    tags: ["Planning", "Design", "Build", "PMM"],
    listImage: Project2ListImg,
    featured: true,
    featuredImage: Project2FeaturedImg,
    paneColor: "#D3C8F3",
    imagePaneColor: "#9B82E3",
  },
  {
    slug: "gearup-mma-martial-arts-booking",
    title: "GearUp MMA Martial Arts Booking",
    description:
      "GearUp MMA connects fighters with martial arts gyms, letting users find and book classes by discipline while gym admins manage classes, members, payments, and growth in one place.",
    tags: ["Strategy", "Design", "Build", "Fitness"],
    listImage: Project3ListImg,
    featured: true,
    featuredImage: Project3FeaturedImg,
    paneColor: "#EADBA4",
    imagePaneColor: "#DAC068",
  },
  {
    slug: "clinics-flo-all-in-one-clinic-crm",
    title: "Clinics Flo - All In One Clinic CRM",
    description:
      "Clinics Flo gives clinics one place to manage leads, appointments, and patient conversations, with automated workflows, review requests, campaigns, and a full finance center.",
    tags: ["Strategy", "Design", "Build", "Complexity"],
    listImage: Project4ListImg,
    featured: true,
    featuredImage: Project4FeaturedImg,
    paneColor: "#B5E3D3",
    imagePaneColor: "#30B795",
  },
  {
    slug: "mr-delivery-on-demand-delivery-app",
    title: "Mr. Delivery On Demand Delivery App",
    description:
      "Mr. Delivery makes parcel and food delivery simple, from booking a rider and live tracking to in-app chat and payments, with a rider onboarding flow and a super admin to run it.",
    tags: ["PMM", "Strategies", "Team Handling", "Build"],
    listImage: Project5ListImg,
    featured: true,
    featuredImage: Project5FeaturedImg,
    paneColor: "#FFC8A6",
    imagePaneColor: "#FF8A4C",
  },
];

export function getWorkHref(slug: string) {
  return `${ROUTES.WORK}/${slug}`;
}

export function getWorkBySlug(slug: string) {
  return WORK.find((work) => work.slug === slug);
}

// The home page's stacked cards. A project without a page yet sends its
// visitors on to the work list.
export const FEATURED_WORK: IFeaturedWork[] = WORK.flatMap((work) =>
  work.featured
    ? [
        {
          title: work.title,
          description: work.description,
          image: work.featuredImage,
          href: getWorkHref(work.slug),
          paneColor: work.paneColor,
          imagePaneColor: work.imagePaneColor,
        },
      ]
    : [],
);

// These run when the module loads, so a mistake in the list above fails the
// build and the dev server instead of showing up as a broken page.
if (FEATURED_WORK.length > MAX_FEATURED_WORK) {
  throw new Error(
    `At most ${MAX_FEATURED_WORK} projects can be featured, found ${FEATURED_WORK.length}.`,
  );
}
if (new Set(WORK.map((work) => work.slug)).size !== WORK.length) {
  throw new Error("Every work needs its own slug.");
}
