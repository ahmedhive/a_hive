import { ITabItem } from "@/components/tabs/tabs.interface";
import { QuoteForm, SayHelloForm } from "../contact-form/components";

export const CONTACT_TABS_LABEL = "Contact form";
export const CONTACT_TABS: ITabItem[] = [
  { id: "say-hello", label: "Say hello", Content: SayHelloForm },
  { id: "get-a-quote", label: "Get a quote", Content: QuoteForm },
];

// The tab row's spacing: gaps between tabs and the space above the form
// follow the reference (28px / 60px apart; 24 / 36 / 48px above).
export const CONTACT_TABS_LIST_CLASS = "mb-6 gap-7 md:mb-9 lg:mb-12 lg:gap-15";
