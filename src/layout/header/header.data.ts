import { ROUTES } from "@/constants/routes";
import { INavLink } from "./header.interface";

export const BRAND_HREF = ROUTES.HOME;

export const NAV_LINKS: INavLink[] = [
  { label: "ABOUT", href: ROUTES.ABOUT },
  { label: "WORKS", href: ROUTES.WORKS },
  { label: "SERVICES", href: ROUTES.SERVICES },
  { label: "CONTACT", href: ROUTES.CONTACT },
];
