import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("articles", "routes/articles.tsx"),
  route("articles/:slug", "routes/article-detail.tsx"),
  route("projects", "routes/projects.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
