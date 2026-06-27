import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(currentDir, "..");
const rootDir = path.resolve(backendDir, "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });

const required = ["MONGODB_URI", "FRONTEND_URL", "BASE_URL"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI,
  frontendUrl: process.env.FRONTEND_URL.replace(/\/+$/, ""),
  frontendUrls: [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS || "").split(",")
  ]
    .map((url) => url?.trim().replace(/\/+$/, ""))
    .filter(Boolean),
  baseUrl: process.env.BASE_URL.replace(/\/+$/, ""),
  dnsServers: (process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean),
  linkTtlDays: 3,
  shortCodeLength: Number(process.env.SHORT_CODE_LENGTH || 8),
  mongoServerSelectionTimeoutMs: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 8000),
  redirectRateLimitWindowMs: Number(process.env.REDIRECT_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  redirectRateLimitMax: Number(process.env.REDIRECT_RATE_LIMIT_MAX || 120)
};
