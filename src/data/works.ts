import {
  FeaturedWork1Img,
  FeaturedWork2Img,
  FeaturedWork3Img,
  FeaturedWork4Img,
  FeaturedWork5Img,
} from "@/assets/images";
import { ROUTES } from "@/constants/routes";
import { IFeaturedWork } from "@/interfaces";

export const FEATURED_WORKS: IFeaturedWork[] = [
  {
    title: "Kayya Financing Platform",
    description:
      "Kayya lets businesses offer in-house financing, payment plans, and memberships, with a borrower app, live payment tracking, payouts, and a super admin view over every location.",
    image: FeaturedWork1Img,
    href: ROUTES.WORKS,
    paneColor: "#BFE8D6",
    imagePaneColor: "#81CFB8",
  },
  {
    title: "eBrainGo Event Platform",
    description:
      "eBrainGo runs events end to end, a company portal to plan them, an attendee app to live them, plus sponsor and speaker portals, gamification, and an AI event assistant built in.",
    image: FeaturedWork2Img,
    href: ROUTES.WORKS,
    paneColor: "#D3C8F3",
    imagePaneColor: "#9B82E3",
  },
  {
    title: "GearUp MMA Booking Platform",
    description:
      "GearUp MMA connects fighters with martial arts gyms, letting users find and book classes by discipline while gym admins manage classes, members, payments, and growth in one place.",
    image: FeaturedWork3Img,
    href: ROUTES.WORKS,
    paneColor: "#EADBA4",
    imagePaneColor: "#DAC068",
  },
  {
    title: "Clinics FloClinic CRM",
    description:
      "Clinics Flo gives clinics one place to manage leads, appointments, and patient conversations, with automated workflows, review requests, campaigns, and a full finance center.",
    image: FeaturedWork4Img,
    href: ROUTES.WORKS,
    paneColor: "#B5E3D3",
    imagePaneColor: "#30B795",
  },
  {
    title: "Mr. Delivery On Demand App",
    description:
      "Mr. Delivery makes parcel and food delivery simple, from booking a rider and live tracking to in-app chat and payments, with a rider onboarding flow and a super admin to run it.",
    image: FeaturedWork5Img,
    href: ROUTES.WORKS,
    paneColor: "#FFC8A6",
    imagePaneColor: "#FF8A4C",
  },
];
