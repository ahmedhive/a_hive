import { IWorkDetails } from "@/interfaces";
import { PROJECT_1_DETAILS } from "./project-1";
import { PROJECT_2_DETAILS } from "./project-2";
import { PROJECT_3_DETAILS } from "./project-3";
import { PROJECT_4_DETAILS } from "./project-4";
import { PROJECT_5_DETAILS } from "./project-5";

// Only the projects whose page has been written; the rest of WORK has the
// list fields only, and their pages redirect to the work list.
const WORK_DETAILS: IWorkDetails[] = [
  PROJECT_1_DETAILS,
  PROJECT_2_DETAILS,
  PROJECT_3_DETAILS,
  PROJECT_4_DETAILS,
  PROJECT_5_DETAILS,
];

export const WORK_DETAIL_SLUGS = WORK_DETAILS.map((details) => details.slug);

export function getWorkDetails(slug: string) {
  return WORK_DETAILS.find((details) => details.slug === slug);
}
