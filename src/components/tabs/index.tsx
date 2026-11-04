"use client";

import { cn } from "@/lib";
import {
  TAB_ACTIVE_CLASS,
  TAB_CLASS,
  TAB_INACTIVE_CLASS,
  TABS_LIST_CLASS,
} from "./tabs.data";
import { ITabsProps } from "./tabs.interface";
import { getPanelId, getTabId } from "./tabs.utils";
import useTabs from "./use-tabs";

export default function Tabs(props: ITabsProps) {
  const { items, label, className, listClassName, panelClassName } = props;
  const { baseId, tabRefs, activeIndex, setActiveIndex, onTabKeyDown } =
    useTabs(items.length);

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className={cn(TABS_LIST_CLASS, listClassName)}
      >
        {items.map(({ id, label: tabLabel }, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={getTabId(baseId, id)}
              aria-selected={active}
              aria-controls={getPanelId(baseId, id)}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={cn(
                TAB_CLASS,
                active ? TAB_ACTIVE_CLASS : TAB_INACTIVE_CLASS,
              )}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {items.map(({ id, Content }, index) => (
        <div
          key={id}
          role="tabpanel"
          id={getPanelId(baseId, id)}
          aria-labelledby={getTabId(baseId, id)}
          hidden={index !== activeIndex}
          className={panelClassName}
        >
          <Content />
        </div>
      ))}
    </div>
  );
}
