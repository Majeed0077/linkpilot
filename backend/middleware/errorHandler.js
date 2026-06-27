import { env } from "../config/env.js";

export function notFoundHandler(req, res) {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      error: {
        message: "API route not found."
      }
    });
  }

  return res.redirect(302, `${env.frontendUrl}/not-found`);
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const isProduction = env.nodeEnv === "production";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message: statusCode >= 500 ? "Internal server error." : error.message,
      ...(isProduction ? {} : { statusCode })
    }
  });
}
