import { ROUTES } from "@/constants/routes";
import { INavLink } from "./header.interface";

export const BRAND_HREF = ROUTES.HOME;

export const HEADER_DEFAULT_INSET_PX = 0;
export const HEADER_SCROLLED_INSET_PX = 20;
export const HEADER_DEFAULT_TOP_INSET_PX = 0;
export const HEADER_SCROLLED_TOP_INSET_PX = 12;
export const HEADER_SCROLL_TWEEN_DURATION_S = 0.4;
export const HEADER_SCROLL_EASE = "power2.out";

export const NAV_LINKS: INavLink[] = [
  { label: "ABOUT", href: ROUTES.ABOUT },
  { label: "WORKS", href: ROUTES.WORKS },
  { label: "SERVICES", href: ROUTES.SERVICES },
  { label: "CONTACT", href: ROUTES.CONTACT },
];
