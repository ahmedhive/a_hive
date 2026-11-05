import { ROUTES } from "@/constants/routes";
import { WORK } from "@/data/work";

// A tag's URL segment: "Team Handling" -> "team-handling".
export function getTagSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getWorkTagHref(tag: string) {
  return `${ROUTES.WORK_TAGS}/${getTagSlug(tag)}`;
}

// The tag as written on the work that carries it, or undefined when no work
// has a tag with this slug.
export function getTagBySlug(slug: string) {
  for (const work of WORK) {
    const tag = work.tags.find((candidate) => getTagSlug(candidate) === slug);
    if (tag) return tag;
  }
  return undefined;
}

export function getWorkByTag(tag: string) {
  return WORK.filter((work) => work.tags.includes(tag));
}
