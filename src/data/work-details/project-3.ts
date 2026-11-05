import {
  Project3BannerImg,
  Project3DescImg,
  Project3LeftImg,
  Project3Result1Img,
  Project3Result2Img,
  Project3Result3Img,
  Project3RightImg,
} from "@/assets/work";
import { IWorkDetails } from "@/interfaces";

export const PROJECT_3_DETAILS: IWorkDetails = {
  slug: "gearup-mma-martial-arts-booking",
  meta: [
    { label: "Client", value: "Roberto Kaane" },
    { label: "Country", value: "France" },
    { label: "Expertise", value: "Strategy, Design, Deliver" },
    { label: "Duration", value: "3 Months, 2025" },
  ],
  bannerImage: Project3BannerImg,
  challenge: {
    title: "The Challenge",
    lead: "Fighters were finding classes through word of mouth, DMs, and gym walk ins, with no easy way to compare disciplines, times, or prices. Gyms had no simple way to fill open slots or track who showed up and paid.",
    text: "My job was to make booking a class as quick as ordering food: discover gyms nearby, filter by discipline, pick a slot, and pay, while giving admins one place to run gyms, classes, members, and payments.",
  },
  showcaseImages: [Project3LeftImg, Project3RightImg],
  overview: {
    title: "Work Overview",
    text: "I shaped GearUp MMA from first concept to handoff, defining the booking flow for fighters, a guided profile setup, in app chat with gyms, and an admin dashboard tracking bookings, revenue, and growth by gym.",
    stats: [
      { value: "300+", label: "Screen Designs" },
      { value: "02", label: "Connected Products" },
      { value: "07+", label: "User Roles" },
      { value: "200+", label: "Click-up Tickets" },
    ],
  },
  descImage: Project3DescImg,
  quote: ["FIND A GYM", "BOOK A SLOT", "SHOW UP", "AND FIGHT"],
  result: {
    title: "The Result",
    text: "GearUp MMA lets fighters find nearby gyms, book classes by discipline and time, and chat with gyms in one app, while admins track bookings, revenue, and top gyms from a single dashboard.",
    images: [Project3Result1Img, Project3Result2Img, Project3Result3Img],
    bgColor: "#FFFAED",
  },
};
