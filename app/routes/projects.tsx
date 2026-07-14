import { ProjectCard } from "~/components/project-card";
import { projects, siteConfig } from "~/data/site";

export function meta() {
  return [{ title: `作品 — ${siteConfig.name}` }, { name: "description", content: siteConfig.pages.projectsDescription }];
}

export default function Projects() {
  return (
    <main id="main-content" className="page section-frame">
      <header className="page-hero">
        <p className="eyebrow">PROJECTS / SHIPPED & EXPERIMENTAL</p>
        <h1>作品不是截图，<span>而是解决问题的证据。</span></h1>
        <p className="lede">这里记录背景、决策、实现、结果与复盘。首版先展示项目摘要，后续逐个补齐完整案例页和在线 Demo。</p>
      </header>
      <div className="projects-page-grid">
        {projects.map((project, index) => (
          <div key={project.name} className="project-page-item">
            <span className="project-number">0{index + 1}</span>
            <ProjectCard project={project} large={index === 0} />
          </div>
        ))}
      </div>
    </main>
  );
}
