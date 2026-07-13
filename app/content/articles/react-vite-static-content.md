---
title: "用 React + Vite 做内容站，关键不在 SPA"
summary: "保留 React 生态，同时用静态预渲染获得更好的首屏、SEO 和部署能力。"
publishedAt: "2026-07-08"
readingTime: "6 min"
tags: ["React", "Vite", "Architecture"]
featured: false
---

React 很适合构建复杂交互，但个人博客首先是内容产品。如果所有页面都等浏览器下载 JavaScript 后才渲染，访问速度、搜索收录和链接预览都会受到影响。

## 更合适的组合

React Router Framework Mode 可以在构建阶段遍历文章和项目路径，为每个 URL 输出真实 HTML。部署平台只需托管生成结果，导航后仍然保留 React 的浏览器端体验。

这让架构形成了清晰的分工：

- Markdown 负责长期内容；
- 路由 loader 负责读取和校验数据；
- React 组件负责页面呈现；
- Vite 负责开发体验和生产构建；
- CDN 负责稳定交付。

## 不要让框架替代内容

个人网站最重要的不是技术栈标签，而是能否持续积累文章、案例和公开成果。架构应该降低发布一篇文章的成本，而不是让每次更新都变成一次开发任务。
