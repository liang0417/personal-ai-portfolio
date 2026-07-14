import type { Config } from "@react-router/dev/config";

export default {
  basename: process.env.GITHUB_ACTIONS ? "/liangshanbobo" : "/",
  ssr: true,
} satisfies Config;
