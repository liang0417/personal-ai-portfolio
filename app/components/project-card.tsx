import { projects } from "~/data/site";

type Project = (typeof projects)[number];

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <article className={`project-card ${large ? "project-card-large" : ""}`}>
      <div className="card-topline">
        <span className="status-dot" />
        <span>{project.status}</span>
      </div>
      <div>
        <p className="project-impact">{project.impact}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <div className="tag-list">
        {project.stack.map((item) => <span key={item}>{item}</span>)}
      </div>
    </article>
  );
}
