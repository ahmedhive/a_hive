import { ProjectCard } from "./components";
import { IProjectListProps } from "./project-list.interface";

export default function ProjectList(props: IProjectListProps) {
  const { works } = props;

  return (
    <ul className="grid grid-cols-1 gap-y-9 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-0 lg:gap-x-9 xl:gap-x-15">
      {works.map((work) => (
        <ProjectCard key={work.slug} work={work} />
      ))}
    </ul>
  );
}
