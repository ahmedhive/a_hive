import { KeyboardEvent, useRef, useState } from "react";
import { CONTACT_TABS } from "./contact-tabs.data";

export default function useContactTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  // Arrow keys move between tabs, Home and End jump to the ends.
  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    const last = CONTACT_TABS.length - 1;
    if (event.key === "ArrowRight") select(index === last ? 0 : index + 1);
    else if (event.key === "ArrowLeft") select(index === 0 ? last : index - 1);
    else if (event.key === "Home") select(0);
    else if (event.key === "End") select(last);
    else return;
    event.preventDefault();
  };

  return { tabRefs, activeIndex, setActiveIndex, onTabKeyDown };
}
