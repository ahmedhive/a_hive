import { InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/assets/icons";
import { ISocialLink } from "@/interfaces";

export const BRAND_NAME = "AHMEDHIVE";
export const BRAND_TEXT = `// ${BRAND_NAME}`;

// Single source for the WhatsApp number — the wa.me link (social icon, about
// CTA) and the display/tel: format (menu contact bar) both derive from this
// rather than each hardcoding their own copy of the same digits.
const WHATSAPP_COUNTRY_CODE = "92";
const WHATSAPP_LOCAL_NUMBER = "3340050391";
export const WHATSAPP_LINK = `https://wa.me/+${WHATSAPP_COUNTRY_CODE}${WHATSAPP_LOCAL_NUMBER}`;
export const WHATSAPP_PHONE_INTL = `+${WHATSAPP_COUNTRY_CODE} ${WHATSAPP_LOCAL_NUMBER}`;

export const SOCIAL_LINKS: ISocialLink[] = [
  {
    label: "Whatsapp",
    href: WHATSAPP_LINK,
    Icon: WhatsappIcon,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/ahmedhiivee",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahmedhive/",
    Icon: LinkedinIcon,
  },
];
