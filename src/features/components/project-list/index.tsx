import { ProjectCard } from "./components";
import { PRIORITY_CARD_COUNT } from "./project-list.data";
import { IProjectListProps } from "./project-list.interface";

export default function ProjectList(props: IProjectListProps) {
  const { works } = props;

  return (
    <ul className="grid grid-cols-1 gap-y-9 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-0 lg:gap-x-9 xl:gap-x-15">
      {works.map((work, index) => (
        <ProjectCard
          key={work.slug}
          work={work}
          priority={index < PRIORITY_CARD_COUNT}
        />
      ))}
    </ul>
  );
}
