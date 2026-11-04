import { IWorkDetails } from "@/interfaces";
import { PROJECT_1_DETAILS } from "./project-1";
import { PROJECT_2_DETAILS } from "./project-2";

// Only the projects whose page has been written; the rest of WORKS has the
// list fields only, and their pages redirect to the works list.
const WORK_DETAILS: IWorkDetails[] = [PROJECT_1_DETAILS, PROJECT_2_DETAILS];

export const WORK_DETAIL_SLUGS = WORK_DETAILS.map((details) => details.slug);

export function getWorkDetails(slug: string) {
  return WORK_DETAILS.find((details) => details.slug === slug);
}
