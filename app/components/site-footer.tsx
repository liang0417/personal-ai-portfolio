import { Link } from "react-router";
import { siteIdentity } from "~/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">让想法成为可交付的产品。</p>
        <p className="muted">开放交流 AI、工程、产品与长期创造。</p>
      </div>
      <div className="footer-links">
        <a href={siteIdentity.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        <a href={siteIdentity.repositoryUrl} target="_blank" rel="noreferrer">Source</a>
        <Link to="/projects" reloadDocument>Projects</Link>
      </div>
      <p className="footer-meta">© 2026 {siteIdentity.name} · Built in public with React & Vite</p>
    </footer>
  );
}
