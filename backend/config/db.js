import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);

  if (env.dnsServers.length > 0) {
    dns.setServers(env.dnsServers);
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production",
    serverSelectionTimeoutMS: env.mongoServerSelectionTimeoutMs
  });

  console.log("MongoDB connected");
}
