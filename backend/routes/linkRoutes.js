import { Router } from "express";
import { createLink, deleteLink, listLinks, redirectLink } from "../controllers/linkController.js";
import { createLinkLimiter, redirectLimiter } from "../middleware/rateLimiter.js";

export const linkRoutes = Router();

const shortCodePattern = /^[A-Za-z0-9_-]{4,32}$/;
const reservedPaths = new Set(["api", "health", "not-found", "expired", "dashboard", "blocked"]);

function validateShortCodeParam(req, res, next) {
  const { shortCode } = req.params;

  if (!shortCodePattern.test(shortCode) || reservedPaths.has(shortCode.toLowerCase())) {
    return next("route");
  }

  return next();
}

linkRoutes.get("/api/links", listLinks);
linkRoutes.post("/api/links", createLinkLimiter, createLink);
linkRoutes.delete("/api/links/:id", deleteLink);

// Redirects only use database-backed short codes. There is no /redirect?url= endpoint.
linkRoutes.get("/:shortCode", redirectLimiter, validateShortCodeParam, redirectLink);
