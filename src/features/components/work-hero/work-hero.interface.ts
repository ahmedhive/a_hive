export interface IWorkHeroProps {
  title: string;
  // The button under the title; left out, the hero is just caption and title.
  cta?: { label: string; href: string };
}
