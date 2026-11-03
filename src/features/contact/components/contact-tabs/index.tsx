"use client";

import { cn } from "@/lib";
import {
  CONTACT_TAB_ACTIVE_CLASS,
  CONTACT_TAB_CLASS,
  CONTACT_TAB_INACTIVE_CLASS,
  CONTACT_TABS,
} from "./contact-tabs.data";
import { getPanelId, getTabId } from "./contact-tabs.utils";
import useContactTabs from "./use-contact-tabs";

export default function ContactTabs() {
  const { tabRefs, activeIndex, setActiveIndex, onTabKeyDown } =
    useContactTabs();

  return (
    <section className="px-[5%] pb-16 text-black-secondary sm:pb-20 md:pb-25 lg:pb-37.5">
      <div className="mx-auto max-w-250">
        <div
          role="tablist"
          className="mb-6 flex gap-7 md:mb-9 lg:mb-12 lg:gap-15"
        >
          {CONTACT_TABS.map(({ id, label }, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={getTabId(id)}
                aria-selected={active}
                aria-controls={getPanelId(id)}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cn(
                  CONTACT_TAB_CLASS,
                  active
                    ? CONTACT_TAB_ACTIVE_CLASS
                    : CONTACT_TAB_INACTIVE_CLASS,
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {CONTACT_TABS.map(({ id, Form }, index) => (
          <div
            key={id}
            role="tabpanel"
            id={getPanelId(id)}
            aria-labelledby={getTabId(id)}
            hidden={index !== activeIndex}
          >
            <Form />
          </div>
        ))}
      </div>
    </section>
  );
}
