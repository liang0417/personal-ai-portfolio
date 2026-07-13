export const navigation = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/articles" },
  { label: "作品", href: "/projects" },
  { label: "关于", href: "/about" },
];

export const projects = [
  {
    name: "AI Proposal Studio",
    description: "把检索、推理、文档生成与可追溯证据编排成一条可交付的业务工作流。",
    impact: "从想法到可审阅方案",
    stack: ["React", "FastAPI", "RAG", "Agent"],
    status: "持续迭代",
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
    role: "AI Product Engineer",
    summary: "关注 Agent、RAG、知识工程与可靠交付，让 AI 能力真正进入业务流程。",
  },
  {
    period: "2024—2025",
    role: "Full-stack Builder",
    summary: "从需求、交互、前后端实现到部署验证，持续构建完整产品闭环。",
  },
  {
    period: "EARLIER",
    role: "Backend Engineer",
    summary: "打下服务端、数据建模、系统集成和工程质量的技术基础。",
  },
];
