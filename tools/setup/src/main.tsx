import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Project = { name: string; description: string; impact: string; stack: string[]; status: string; featured: boolean };
type Config = {
  site: {
    name: string; brandMark: string; role: string; email: string; githubUrl: string; description: string;
    navigation: { label: string; href: string }[];
    home: { availability: string; eyebrow: string; headline: string; headlineAccent: string; intro: string; proof: { value: string; label: string }[]; now: string; location: string };
    about: { description: string; paragraphs: string[]; skills: string[] };
    pages: { articlesDescription: string; projectsDescription: string };
    footer: { title: string; subtitle: string };
  };
  projects: Project[];
  experience: { period: string; role: string; summary: string }[];
};
type Profile = { id: string; name: string; updatedAt: string };
type History = { id: string; label: string; createdAt: string };
type State = { config: Config; activeProfileId: string; profiles: Profile[]; history: History[] };
const setupApi = "/api/setup";

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${setupApi}${path}`, body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : undefined);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "操作失败。");
  return data;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="field"><span>{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function App() {
  const [state, setState] = useState<State>();
  const [draft, setDraft] = useState<Config>();
  const [profileName, setProfileName] = useState("");
  const [message, setMessage] = useState("正在读取本地配置…");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const next = await request<State>("/state");
    setState(next);
    setDraft(clone(next.config));
    return next;
  };

  useEffect(() => { void refresh().then(() => setMessage("本地配置已载入。"), (error: Error) => setMessage(error.message)); }, []);

  const run = async (operation: () => Promise<State>, success: string) => {
    setBusy(true);
    try {
      const next = await operation();
      setState(next);
      setDraft(clone(next.config));
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败。");
    } finally {
      setBusy(false);
    }
  };

  if (!state || !draft) return <main className="loading">{message}</main>;

  const updateSite = <K extends keyof Config["site"]>(key: K, value: Config["site"][K]) => setDraft((current) => current ? { ...current, site: { ...current.site, [key]: value } } : current);
  const updateHome = <K extends keyof Config["site"]["home"]>(key: K, value: Config["site"]["home"][K]) => updateSite("home", { ...draft.site.home, [key]: value });
  const updateProject = (index: number, key: keyof Project, value: string | boolean | string[]) => setDraft((current) => {
    if (!current) return current;
    const projects = current.projects.map((project, itemIndex) => itemIndex === index ? { ...project, [key]: value } : project);
    return { ...current, projects };
  });

  return <main className="setup-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">A</span><span>CONFIG / LOCAL</span></div>
      <div className="sidebar-copy"><h1>配置管理器</h1><p>所有改动只写入当前项目本地文件。</p></div>
      <section className="profile-list" aria-label="配置方案">
        <div className="section-label">配置方案</div>
        {state.profiles.map((profile) => <button className={profile.id === state.activeProfileId ? "profile active" : "profile"} key={profile.id} disabled={busy || profile.id === state.activeProfileId} onClick={() => void run(() => request<State>(`/profiles/${profile.id}/activate`, {}), `已切换到“${profile.name}”。`)}><span>{profile.name}</span><small>{profile.id === state.activeProfileId ? "当前" : "切换"}</small></button>)}
      </section>
      <form className="new-profile" onSubmit={(event) => { event.preventDefault(); const name = profileName.trim(); if (name) void run(() => request<State>("/profiles", { name }), `已创建并启用“${name}”。`).then(() => setProfileName("")); }}>
        <input aria-label="新方案名称" data-testid="new-profile-name" placeholder="新方案名称" value={profileName} onChange={(event) => setProfileName(event.target.value)} />
        <button type="submit" data-testid="create-profile" disabled={busy || !profileName.trim()}>新建</button>
      </form>
      <p className="local-note"><span /> 仅限 127.0.0.1</p>
    </aside>

    <section className="editor">
      <header className="editor-header"><div><p className="section-label">当前方案 / {state.profiles.find((profile) => profile.id === state.activeProfileId)?.name}</p><h2>编辑网站资料</h2></div><button className="save" data-testid="save-config" disabled={busy} onClick={() => void run(() => request<State>("/save", { config: draft }), "已保存，并在保存前创建历史快照。")}><span>{busy ? "处理中" : "保存配置"}</span><b>↗</b></button></header>
      <p className="message" role="status">{message}</p>

      <section className="editor-section"><div className="section-heading"><h3>身份与联系</h3><span>会同步到网站标题、页头和页脚</span></div><div className="field-grid"><Field label="姓名" value={draft.site.name} onChange={(value) => updateSite("name", value)} /><Field label="品牌字母" value={draft.site.brandMark} onChange={(value) => updateSite("brandMark", value.slice(0, 2))} /><Field label="职业定位" value={draft.site.role} onChange={(value) => updateSite("role", value)} /><Field label="联系邮箱" value={draft.site.email} onChange={(value) => updateSite("email", value)} /><Field label="GitHub 地址" value={draft.site.githubUrl} onChange={(value) => updateSite("githubUrl", value)} /><Field label="站点描述" value={draft.site.description} onChange={(value) => updateSite("description", value)} /></div></section>

      <section className="editor-section"><div className="section-heading"><h3>首页文案</h3><span>实时保存在当前方案的草稿中</span></div><div className="field-grid"><Field label="主标题" value={draft.site.home.headline} onChange={(value) => updateHome("headline", value)} /><Field label="强调标题" value={draft.site.home.headlineAccent} onChange={(value) => updateHome("headlineAccent", value)} /><Field label="当前状态" value={draft.site.home.now} onChange={(value) => updateHome("now", value)} /><Field label="所在地" value={draft.site.home.location} onChange={(value) => updateHome("location", value)} /></div><Field label="首页简介" value={draft.site.home.intro} multiline onChange={(value) => updateHome("intro", value)} /></section>

      <section className="editor-section"><div className="section-heading"><h3>项目</h3><button className="quiet-button" type="button" onClick={() => setDraft((current) => current ? { ...current, projects: [...current.projects, { name: "新项目", description: "用一句话说明它解决的问题。", impact: "待补充成果", stack: [], status: "规划中", featured: false }] } : current)}>添加项目</button></div><div className="project-editor">{draft.projects.map((project, index) => <article className="project-row" key={index}><div className="project-number">{String(index + 1).padStart(2, "0")}</div><div className="project-fields"><Field label="项目名称" value={project.name} onChange={(value) => updateProject(index, "name", value)} /><Field label="状态" value={project.status} onChange={(value) => updateProject(index, "status", value)} /><Field label="成果" value={project.impact} onChange={(value) => updateProject(index, "impact", value)} /><Field label="技术栈（用逗号分隔）" value={project.stack.join(", ")} onChange={(value) => updateProject(index, "stack", value.split(",").map((item) => item.trim()).filter(Boolean))} /><Field label="项目说明" value={project.description} multiline onChange={(value) => updateProject(index, "description", value)} /></div><button className="remove" type="button" aria-label={`删除${project.name}`} disabled={draft.projects.length === 1} onClick={() => setDraft((current) => current ? { ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) } : current)}>×</button></article>)}</div></section>
    </section>

    <aside className="history"><header><p className="section-label">自动备份</p><h2>历史配置</h2><span>{state.history.length} 个快照</span></header><div className="history-list">{state.history.length === 0 ? <p className="empty">首次保存后，历史版本会显示在这里。</p> : state.history.map((entry) => <article key={entry.id}><i /><div><strong>{entry.label}</strong><time>{new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.createdAt))}</time></div><button disabled={busy} onClick={() => void run(() => request<State>(`/history/${entry.id}/restore`, {}), "已恢复历史版本，并已备份恢复前的配置。")}>恢复</button></article>)}</div></aside>
  </main>;
}

createRoot(document.getElementById("root")!).render(<App />);
