import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), "..", ".env.local") });

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
