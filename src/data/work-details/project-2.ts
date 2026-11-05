import {
  Project2BannerImg,
  Project2DescImg,
  Project2LeftImg,
  Project2Result1Img,
  Project2Result2Img,
  Project2Result3Img,
  Project2RightImg,
} from "@/assets/work";
import { IWorkDetails } from "@/interfaces";

export const PROJECT_2_DETAILS: IWorkDetails = {
  slug: "ebraingo-end-to-end-event-platform",
  meta: [
    { label: "Client", value: "Marko Haffman" },
    { label: "Country", value: "Germany" },
    { label: "Expertise", value: "Strategy, Design, Launch" },
    { label: "Duration", value: "10 Months, 2026" },
  ],
  bannerImage: Project2BannerImg,
  challenge: {
    title: "The Challenge",
    lead: "Event teams were juggling separate tools for registration, agendas, sponsors, speakers, and on site check in. Attendees bounced between apps, and organizers had no single place to see what was working during the event.",
    text: "My job was to bring every role into one connected platform: a portal to plan events, an app attendees actually open, dedicated spaces for sponsors and speakers, and a super admin to run it all as a SaaS.",
  },
  showcaseImages: [Project2LeftImg, Project2RightImg],
  overview: {
    title: "Work Overview",
    text: "I led eBrainGo from the MVP to a full platform, defining five products for five roles, shaping gamification and an AI event assistant, and shipping the website, pitch decks, and launch marketing around it.",
    stats: [
      { value: "1000+", label: "Screen Designs" },
      { value: "05", label: "Connected Products" },
      { value: "05", label: "User Roles" },
      { value: "1200+", label: "Click-up Tickets" },
    ],
  },
  descImage: Project2DescImg,
  quote: ["ONE EVENT", "EVERY ROLE", "ONE PLATFORM", "NO SWITCHING"],
  result: {
    title: "The Result",
    text: "eBrainGo gives organizers one portal to plan, run, and measure events, while attendees follow agendas, meet speakers, chat, and earn points in one app, and sponsors and speakers get spaces of their own.",
    images: [Project2Result1Img, Project2Result2Img, Project2Result3Img],
    bgColor: "#F8F5FF",
  },
};
