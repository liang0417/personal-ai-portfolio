import matter from "gray-matter";

export interface ArticleSummary {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
}

export interface Article extends ArticleSummary {
  content: string;
}

const articleModules = import.meta.glob<string>("../content/articles/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

function parseArticle(path: string, raw: string): Article {
  const { data, content } = matter(raw);
  const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "article";

  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    readingTime: String(data.readingTime ?? "5 min"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
    content,
  };
}

export function getArticles(): Article[] {
  return Object.entries(articleModules)
    .map(([path, raw]) => parseArticle(path, raw))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}
