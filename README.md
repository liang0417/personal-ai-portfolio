# Personal AI Portfolio

一个面向文章、个人简历、项目案例和未来实验的开源个人网站。

项目使用 React、Vite、TypeScript 与 React Router Framework Mode。内容页面会在构建阶段预渲染为独立 HTML，适合部署到腾讯云 COS、CloudBase、CDN 或其他静态托管平台。

## 当前功能

- AI 科技感响应式首页
- 文章归档与 Markdown 正文
- 作品集和项目摘要
- 关于与经历页面
- 明暗主题切换
- 全局命令面板
- 静态预渲染和路由级 SEO 元信息
- 移动端布局与 reduced-motion 支持

## 本地开发

要求 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。

## 验证与构建

```bash
npm run typecheck
npm run build
```

静态文件输出到 `build/client`。文章、项目和其他公开页面应在部署前全部出现在构建日志的 `Prerender` 列表中。

## 内容维护

文章保存在：

```text
app/content/articles/*.md
```

每篇文章包含以下 frontmatter：

```yaml
---
title: "文章标题"
summary: "文章摘要"
publishedAt: "2026-07-13"
readingTime: "8 min"
tags: ["React", "AI"]
featured: false
---
```

项目和经历的示例数据位于 `app/data/site.ts`。

## 个性化清单

正式发布前需要替换：

- `YOUR.NAME`
- `hello@example.com`
- GitHub 地址
- 首页个人定位和项目数据
- 关于页照片与真实经历
- 域名确定后的 canonical、Open Graph、Sitemap 和 RSS 地址

## 中国大陆部署路线

推荐链路：

```text
GitHub → CI 构建 → build/client → 腾讯云 COS/CloudBase → 国内 CDN → 已备案域名
```

域名、ICP备案、HTTPS 和 CDN 尚未在本仓库中配置。不要在没有真实线上验证的情况下宣称部署完成。

## 开源与内容版权

程序代码使用 [MIT License](LICENSE)。文章、个人简历、照片、项目描述和个人品牌素材不随代码使用 MIT 授权，详见 [CONTENT_LICENSE.md](CONTENT_LICENSE.md)。
