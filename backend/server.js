import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { pathToFileURL } from "node:url";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { mongoSanitize } from "./middleware/mongoSanitize.js";
import { linkRoutes } from "./routes/linkRoutes.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "no-referrer" }
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isConfiguredOrigin = env.frontendUrls.includes(origin);
      const isLocalDevOrigin = env.nodeEnv !== "production" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

      if (isConfiguredOrigin || isLocalDevOrigin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
    maxAge: 600
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(mongoSanitize);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(linkRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`LinkPilot API running at ${env.baseUrl}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    console.error("Failed to start LinkPilot API", error);
    process.exit(1);
  });
}

export { app };
