import { KeyboardEvent, useId, useRef, useState } from "react";

export default function useTabs(count: number) {
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  // Arrow keys move between tabs (wrapping), Home and End jump to the ends.
  // Combined with a modifier they are left to the browser (Alt+arrows is back
  // and forward).
  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const last = count - 1;
    if (event.key === "ArrowRight") select(index === last ? 0 : index + 1);
    else if (event.key === "ArrowLeft") select(index === 0 ? last : index - 1);
    else if (event.key === "Home") select(0);
    else if (event.key === "End") select(last);
    else return;
    event.preventDefault();
  };

  return { baseId, tabRefs, activeIndex, setActiveIndex, onTabKeyDown };
}
