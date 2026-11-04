import {
  Project1BannerImg,
  Project1DescImg,
  Project1LeftImg,
  Project1Result1Img,
  Project1Result2Img,
  Project1Result3Img,
  Project1RightImg,
} from "@/assets/works";
import { IWorkDetails } from "@/interfaces";

export const PROJECT_1_DETAILS: IWorkDetails = {
  slug: "kayya-in-house-financing-platform",
  meta: [
    { label: "Client", value: "Saen Caul" },
    { label: "Country", value: "United States" },
    { label: "Expertise", value: "Management & Design" },
    { label: "Duration", value: "4 Months, 2025" },
  ],
  bannerImage: Project1BannerImg,
  challenge: {
    title: "The Challenge",
    lead: "Businesses wanted to offer financing in house, but loans, memberships, and payments lived across spreadsheets and separate tools. Owners had no single view of who owed what, and borrowers had no simple way to pay.",
    text: "My job was to turn that into one product: a clear flow for creating loans and plans, a borrower app that makes paying effortless, and a super admin layer to run every business on the platform.",
  },
  showcaseImages: [Project1LeftImg, Project1RightImg],
  overview: {
    title: "Work Overview",
    text: "I led Kayya from discovery to handoff, mapping three user roles, defining every flow, and designing five connected apps on one shared design system, with an AI assistant built into the owner dashboard.",
    stats: [
      { value: "500+", label: "Screens designed" },
      { value: "05", label: "Connected apps" },
      { value: "03", label: "User Roles" },
      { value: "800+", label: "Click-up Tickets" },
    ],
  },
  descImage: Project1DescImg,
  quote: ["FINANCE", "THAT FEELS", "SIMPLE ON", "BOTH SIDES"],
  result: {
    title: "The Results",
    text: "Kayya gives business owners a live view of loans, payments, and payouts in one dashboard, while borrowers track balances, turn on Auto-Pay, and pay in a few taps from their phone.",
    images: [Project1Result1Img, Project1Result2Img, Project1Result3Img],
    bgClassName: "bg-mint",
  },
  visitSiteHref: "https://google.com",
};
