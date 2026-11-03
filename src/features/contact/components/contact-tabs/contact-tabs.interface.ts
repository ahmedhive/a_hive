import { ComponentType } from "react";

export interface IContactTab {
  id: string;
  label: string;
  // The form this tab's panel shows.
  Form: ComponentType;
}
