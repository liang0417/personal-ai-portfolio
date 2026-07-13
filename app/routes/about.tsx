import { experience } from "~/data/site";

export function meta() {
  return [{ title: "关于 — YOUR.NAME" }, { name: "description", content: "AI Product Engineer 的经历、能力与工作方式。" }];
}

export default function About() {
  return (
    <main id="main-content" className="page section-frame">
      <header className="about-hero">
        <div>
          <p className="eyebrow">ABOUT / THE HUMAN IN THE LOOP</p>
          <h1>在技术、产品与真实问题之间，<span>持续搭桥。</span></h1>
        </div>
        <div className="portrait-placeholder" aria-label="个人照片占位区域">
          <span>PORTRAIT</span><small>你的照片将在这里</small>
        </div>
      </header>
      <div className="about-grid">
        <section className="about-copy">
          <h2>我在做什么</h2>
          <p>我是一名关注 AI 产品和工程落地的开发者。喜欢从复杂问题中找到清晰结构，也愿意深入到代码、数据和部署细节，把方案真正交付出去。</p>
          <p>这个网站会持续记录项目案例、技术判断、失败复盘和正在进行的实验。相比展示一串技术名词，我更希望它能说明我如何理解问题和完成工作。</p>
          <div className="skill-cloud">
            {["AI Agent", "RAG", "React", "TypeScript", "Python", "System Design", "Product Thinking"].map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </section>
        <section>
          <h2>经历</h2>
          <div className="timeline">
            {experience.map((item) => (
              <article key={item.period}><span className="timeline-dot" /><p className="mono">{item.period}</p><h3>{item.role}</h3><p>{item.summary}</p></article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
