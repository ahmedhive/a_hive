import {
  Project4BannerImg,
  Project4DescImg,
  Project4LeftImg,
  Project4Result1Img,
  Project4Result2Img,
  Project4Result3Img,
  Project4RightImg,
} from "@/assets/work";
import { IWorkDetails } from "@/interfaces";

export const PROJECT_4_DETAILS: IWorkDetails = {
  slug: "clinics-flo-all-in-one-clinic-crm",
  meta: [
    { label: "Client", value: "M Turq Swaide" },
    { label: "Country", value: "Jordan" },
    { label: "Expertise", value: "Strategy & Design" },
    { label: "Duration", value: "6 Months, 2024" },
  ],
  bannerImage: Project4BannerImg,
  challenge: {
    title: "The Challenge",
    lead: "Clinics were losing leads between WhatsApp, Instagram, calls, and walk ins. Appointments, follow ups, reviews, and payments sat in separate tools, so staff spent more time chasing messages than caring for patients.",
    text: "My job was to pull it all into one CRM: every conversation in one inbox, a calendar that books itself, automated workflows and campaigns, review requests, and a finance center that closes the loop.",
  },
  showcaseImages: [Project4LeftImg, Project4RightImg],
  overview: {
    title: "Work Overview",
    text: "I shaped Clinics Flo from onboarding to the last settings screen, designing the lead pipeline, a unified inbox, a no code workflow builder, the campaign launcher, and the finance center, all on one design system.",
    stats: [
      { value: "450+", label: "Screen Designs" },
      { value: "12", label: "Connected Products" },
      { value: "02", label: "User Roles" },
      { value: "320+", label: "Click-up Tickets" },
    ],
  },
  descImage: Project4DescImg,
  quote: ["EVERY LEAD", "EVERY CHAT", "ONE CLINIC", "ONE FLOW"],
  result: {
    title: "The Result",
    text: "Clinics Flo gives clinics one place to capture leads, reply across every channel, book and confirm appointments, request reviews, run campaigns, and track every payment, without switching tabs.",
    images: [Project4Result1Img, Project4Result2Img, Project4Result3Img],
    bgColor: "#F2FFFA",
  },
};
