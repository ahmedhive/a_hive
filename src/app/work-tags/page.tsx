import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

// There is no list of tags, only a page per tag, so the bare path goes to the
// full list of works.
export default function Page() {
  redirect(ROUTES.WORKS);
}
