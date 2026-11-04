import { IWorkDetails } from "@/interfaces";

export interface IWorkHeroProps {
  title: string;
  tags: string[];
  meta: IWorkDetails["meta"];
  visitSiteHref?: string;
}
