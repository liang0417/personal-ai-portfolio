import { constants } from "node:fs";
import { access, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const examplePath = join(projectRoot, "app/data/site.config.example.json");
const activeConfigPath = join(projectRoot, "app/data/site.config.json");

try {
  await access(activeConfigPath, constants.F_OK);
} catch (error) {
  if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
  await copyFile(examplePath, activeConfigPath);
  console.log("已从示例创建本地配置：app/data/site.config.json");
}
