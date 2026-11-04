import { IWork } from "@/interfaces";

export interface IProjectCardProps {
  work: IWork;
  // Set for the cards that are on screen when the page loads.
  priority?: boolean;
}
