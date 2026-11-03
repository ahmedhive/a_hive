import { QuoteForm, SayHelloForm } from "../contact-form/components";
import { IContactTab } from "./contact-tabs.interface";

export const CONTACT_TABS: IContactTab[] = [
  { id: "say-hello", label: "Say hello", Form: SayHelloForm },
  { id: "get-a-quote", label: "Get a quote", Form: QuoteForm },
];

export const CONTACT_TAB_CLASS =
  "cursor-pointer border-b-4 pb-2 font-heading text-(length:--_typography---font-sizes--heading--h5) leading-none uppercase transition-opacity duration-300";
export const CONTACT_TAB_ACTIVE_CLASS = "border-black-secondary opacity-100";
export const CONTACT_TAB_INACTIVE_CLASS =
  "border-transparent opacity-20 hover:opacity-60";
