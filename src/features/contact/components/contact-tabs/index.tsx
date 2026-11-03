import { Tabs } from "@/components";
import {
  CONTACT_TABS,
  CONTACT_TABS_LABEL,
  CONTACT_TABS_LIST_CLASS,
} from "./contact-tabs.data";

export default function ContactTabs() {
  return (
    <section className="px-[5%] pb-16 text-black-secondary sm:pb-20 md:pb-25 lg:pb-37.5">
      <Tabs
        items={CONTACT_TABS}
        label={CONTACT_TABS_LABEL}
        className="mx-auto max-w-250"
        listClassName={CONTACT_TABS_LIST_CLASS}
      />
    </section>
  );
}
