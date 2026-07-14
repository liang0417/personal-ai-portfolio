export const siteIdentity = {
  name: "Liangshanbobo",
  wordmark: "LIANGSHANBOBO",
  mark: "LSB",
  githubHandle: "liang0417",
  githubUrl: "https://github.com/liang0417",
  repositoryUrl: "https://github.com/liang0417/liangshanbobo",
} as const;

export const navigation = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/articles" },
  { label: "作品", href: "/projects" },
  { label: "关于", href: "/about" },
];

export const projects = [
  {
    name: "Shanbo Context",
    description: "本地优先、答案可验证的个人知识工作台，并为团队级 RAG 与 Agent 工作流保留清晰演进路径。",
    impact: "Private context. Verifiable answers.",
    stack: ["React", "FastAPI", "RAG", "Local-first"],
    status: "开放构建",
    featured: true,
  },
  {
    name: "Knowledge Workbench",
    description: "面向企业知识治理的诊断与维护工作台，让复杂状态可以被看见和处理。",
    impact: "统一问题发现与修复",
    stack: ["TypeScript", "React", "PostgreSQL"],
    status: "已交付",
    featured: false,
  },
  {
    name: "Agent Lab",
    description: "记录 ReAct、工具调用、质量评估与本地模型接入实验的开放实验室。",
    impact: "用证据理解 Agent",
    stack: ["LLM", "ReAct", "Evaluation"],
    status: "实验中",
    featured: false,
  },
];

export const experience = [
  {
    period: "NOW",
    role: "Independent AI Builder",
    summary: "用 Agent、RAG 与自动化构建可验证、可持续迭代的真实产品。",
  },
  {
    period: "BUILDING",
    role: "One-Person Company Explorer",
    summary: "探索一个人借助 AI、开源与系统化工作流可以走多远。",
  },
  {
    period: "FOUNDATION",
    role: "Systems Builder",
    summary: "把服务端、数据、产品与交付经验沉淀为可复用的构建能力。",
  },
];
