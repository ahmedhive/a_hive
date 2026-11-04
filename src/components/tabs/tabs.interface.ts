import { ComponentType } from "react";

export interface ITabItem {
  id: string;
  label: string;
  // What the tab's panel shows. Every panel stays mounted (the inactive ones
  // are hidden), so what a visitor typed survives switching tabs.
  Content: ComponentType;
}

export interface ITabsProps {
  items: ITabItem[];
  // Names the tab list for assistive tech.
  label?: string;
  className?: string;
  // Spacing around the row of tab buttons.
  listClassName?: string;
  panelClassName?: string;
}
