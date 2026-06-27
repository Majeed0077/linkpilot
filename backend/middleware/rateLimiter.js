import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const createLinkLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    error: {
      message: "Too many short links created from this IP. Try again later."
    }
  }
});

export const redirectLimiter = rateLimit({
  windowMs: env.redirectRateLimitWindowMs,
  limit: env.redirectRateLimitMax,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many redirect attempts from this IP. Try again later."
    }
  }
});
