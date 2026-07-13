import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Config } from "@react-router/dev/config";

function getArticlePaths() {
  const directory = resolve("app/content/articles");

  try {
    return readdirSync(directory)
      .filter((file) => file.endsWith(".md"))
      .map((file) => `/articles/${file.replace(/\.md$/, "")}`);
  } catch {
    return [];
  }
}

export default {
  ssr: false,
  prerender: [
    "/",
    "/articles",
    "/projects",
    "/about",
    ...getArticlePaths(),
  ],
} satisfies Config;
