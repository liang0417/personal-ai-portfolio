import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const projectRoot = process.cwd();
const activeConfigPath = join(projectRoot, "app/data/site.config.json");
const setupTemplatePath = join(projectRoot, "tools/setup/index.html");
const storePath = join(projectRoot, ".portfolio-config");
const profilesPath = join(storePath, "profiles");
const historyPath = join(storePath, "history");
const indexPath = join(storePath, "index.json");
const historyLimit = 30;

type ConfigIndex = {
  version: number;
  activeProfileId: string;
  profiles: { id: string; name: string; updatedAt: string }[];
  history: { id: string; label: string; createdAt: string }[];
};

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function writeJsonAtomically(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

function requireText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} 不能为空。`);
}

function validateConfig(config: unknown) {
  if (!config || typeof config !== "object" || Array.isArray(config)) throw new Error("配置格式无效。");
  const value = config as { site?: Record<string, unknown>; projects?: unknown[]; experience?: unknown[] };
  if (!value.site || !Array.isArray(value.projects) || !Array.isArray(value.experience)) throw new Error("配置缺少站点、项目或经历数据。");

  requireText(value.site.name, "姓名");
  requireText(value.site.role, "职业定位");
  requireText(value.site.email, "邮箱");
  requireText(value.site.githubUrl, "GitHub 地址");
  requireText(value.site.description, "站点描述");
  const home = value.site.home as Record<string, unknown> | undefined;
  requireText(home?.headline, "首页标题");
  requireText(home?.intro, "首页简介");

  for (const project of value.projects) {
    const item = project as Record<string, unknown> | undefined;
    requireText(item?.name, "项目名称");
    requireText(item?.description, "项目说明");
    requireText(item?.impact, "项目成果");
    requireText(item?.status, "项目状态");
    if (!Array.isArray(item?.stack) || item.stack.some((entry) => typeof entry !== "string")) {
      throw new Error("项目技术栈必须是文本列表。");
    }
  }
}

function profileFile(id: string) {
  return join(profilesPath, `${id}.json`);
}

function historyFile(id: string) {
  return join(historyPath, `${id}.json`);
}

async function ensureStore(): Promise<ConfigIndex> {
  await Promise.all([mkdir(profilesPath, { recursive: true }), mkdir(historyPath, { recursive: true })]);
  try {
    return await readJson<ConfigIndex>(indexPath);
  } catch {
    const config = await readJson(activeConfigPath);
    const index: ConfigIndex = {
      version: 1,
      activeProfileId: "default",
      profiles: [{ id: "default", name: "默认方案", updatedAt: new Date().toISOString() }],
      history: [],
    };
    await writeJsonAtomically(profileFile("default"), config);
    await writeJsonAtomically(indexPath, index);
    return index;
  }
}

async function snapshot(index: ConfigIndex, config: unknown, label: string) {
  const id = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  index.history.unshift({ id, label, createdAt: new Date().toISOString() });
  await writeJsonAtomically(historyFile(id), config);
  const removed = index.history.splice(historyLimit);
  await Promise.all(removed.map((item) => rm(historyFile(item.id), { force: true })));
}

async function currentState() {
  const index = await ensureStore();
  return { config: await readJson(activeConfigPath), activeProfileId: index.activeProfileId, profiles: index.profiles, history: index.history };
}

function sendJson(response: ServerResponse, statusCode: number, value: unknown) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(value));
}

async function readRequestBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error("请求内容过大。");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as { config?: unknown; name?: unknown };
}

function isTrustedRequest(request: IncomingMessage) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1";
  } catch {
    return false;
  }
}

async function handleApi(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  if (!isTrustedRequest(request)) return sendJson(response, 403, { error: "只允许本机配置向导访问。" });

  try {
    if (request.method === "GET" && url.pathname === "/api/setup/state") return sendJson(response, 200, await currentState());
    if (request.method !== "POST") return sendJson(response, 405, { error: "不支持的操作。" });

    const payload = await readRequestBody(request);
    const index = await ensureStore();
    const active = await readJson(activeConfigPath);

    if (url.pathname === "/api/setup/save") {
      validateConfig(payload.config);
      const profile = index.profiles.find((item) => item.id === index.activeProfileId);
      await snapshot(index, active, `保存前：${profile?.name ?? "当前方案"}`);
      await writeJsonAtomically(activeConfigPath, payload.config);
      await writeJsonAtomically(profileFile(index.activeProfileId), payload.config);
      if (profile) profile.updatedAt = new Date().toISOString();
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    if (url.pathname === "/api/setup/profiles") {
      const name = String(payload.name ?? "").trim();
      if (!name) throw new Error("请输入方案名称。");
      if (index.profiles.some((item) => item.name === name)) throw new Error("已存在同名方案。");
      const id = `profile-${Date.now().toString(36)}`;
      const profile = { id, name, updatedAt: new Date().toISOString() };
      await writeJsonAtomically(profileFile(id), active);
      index.profiles.push(profile);
      index.activeProfileId = id;
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    const activateMatch = url.pathname.match(/^\/api\/setup\/profiles\/(profile-[a-z0-9-]+|default)\/activate$/);
    if (activateMatch) {
      const profile = index.profiles.find((item) => item.id === activateMatch[1]);
      if (!profile) throw new Error("找不到该配置方案。");
      const nextConfig = await readJson(profileFile(profile.id));
      validateConfig(nextConfig);
      await snapshot(index, active, `切换前：${index.profiles.find((item) => item.id === index.activeProfileId)?.name ?? "当前方案"}`);
      await writeJsonAtomically(activeConfigPath, nextConfig);
      index.activeProfileId = profile.id;
      profile.updatedAt = new Date().toISOString();
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    const restoreMatch = url.pathname.match(/^\/api\/setup\/history\/(\d+-[a-f0-9-]+)\/restore$/);
    if (restoreMatch) {
      const entry = index.history.find((item) => item.id === restoreMatch[1]);
      if (!entry) throw new Error("找不到该历史版本。");
      const restored = await readJson(historyFile(entry.id));
      validateConfig(restored);
      await snapshot(index, active, `恢复前：${entry.label}`);
      await writeJsonAtomically(activeConfigPath, restored);
      await writeJsonAtomically(profileFile(index.activeProfileId), restored);
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    return sendJson(response, 404, { error: "找不到配置接口。" });
  } catch (error) {
    return sendJson(response, 400, { error: error instanceof Error ? error.message : "保存失败。" });
  }
}

export function localConfigPlugin(): Plugin {
  return {
    name: "local-config-manager",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "/", "http://127.0.0.1");
        if (url.pathname.startsWith("/api/setup/")) {
          await handleApi(request, response);
          return;
        }
        if (request.method === "GET" && (url.pathname === "/setup" || url.pathname === "/setup/")) {
          try {
            const html = await readFile(setupTemplatePath, "utf8");
            const transformed = await server.transformIndexHtml("/setup", html);
            response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
            response.end(transformed);
          } catch (error) {
            next(error);
          }
          return;
        }
        next();
      });
    },
  };
}
