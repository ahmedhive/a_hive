import { IContactTab } from "./contact-tabs.interface";

// Each tab owns a form; the forms are not built yet, so each panel shows a
// short placeholder.
export const CONTACT_TABS: IContactTab[] = [
  { id: "say-hello", label: "Say hello", placeholder: "Hello form" },
  { id: "get-a-quote", label: "Get a quote", placeholder: "Quote form" },
];

export const CONTACT_TAB_CLASS =
  "cursor-pointer border-b-4 pb-2 font-heading text-(length:--_typography---font-sizes--heading--h5) leading-none uppercase transition-opacity duration-300";
export const CONTACT_TAB_ACTIVE_CLASS = "border-black-secondary opacity-100";
export const CONTACT_TAB_INACTIVE_CLASS =
  "border-transparent opacity-20 hover:opacity-60";
