import {
  Project5BannerImg,
  Project5DescImg,
  Project5LeftImg,
  Project5Result1Img,
  Project5Result2Img,
  Project5Result3Img,
  Project5RightImg,
} from "@/assets/work";
import { IWorkDetails } from "@/interfaces";

export const PROJECT_5_DETAILS: IWorkDetails = {
  slug: "mr-delivery-on-demand-delivery-app",
  meta: [
    { label: "Client", value: "John Robert" },
    { label: "Country", value: "United Arab Emirates" },
    { label: "Expertise", value: "Strategy, Design & Build" },
    { label: "Duration", value: "4 Months, 2025" },
  ],
  bannerImage: Project5BannerImg,
  challenge: {
    title: "The Challenge",
    lead: "Sending a parcel or ordering food meant calling around for a rider, guessing arrival times, and paying cash at the door. Local restaurants and riders had no shared app to take orders, track trips, or get paid.",
    text: "My job was to build one app for both: book a rider or order from nearby restaurants, track every trip live, chat with the courier, and pay in app, with a rider onboarding flow and a super admin to run it.",
  },
  showcaseImages: [Project5LeftImg, Project5RightImg],
  overview: {
    title: "Work Overview",
    text: "I led Mr. Delivery across two phases, starting with rider booking and live tracking, then expanding into food ordering with menus, carts, and checkout, while managing the team and planning the launch.",
    stats: [
      { value: "190+", label: "Screen Designs" },
      { value: "02", label: "Connected Products" },
      { value: "02", label: "User Roles" },
      { value: "450+", label: "Click-up Tickets" },
    ],
  },
  descImage: Project5DescImg,
  quote: ["BOOK A RIDER", "TRACK IT LIVE", "PAY IN APP", "DONE"],
  result: {
    title: "The Result",
    text: "Mr. Delivery lets people send parcels or order food in a few taps, follow the rider live on a map, chat with the courier, and pay in app, while riders onboard themselves and admins manage it all.",
    images: [Project5Result1Img, Project5Result2Img, Project5Result3Img],
    bgColor: "#FFFBF8",
  },
};
