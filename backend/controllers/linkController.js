import { nanoid } from "nanoid";
import { env } from "../config/env.js";
import { Link } from "../models/Link.js";
import { badRequest, conflict, forbidden, gone, notFound } from "../utils/httpError.js";
import { validateUrl } from "../utils/validateUrl.js";

const aliasPattern = /^[A-Za-z0-9_-]{4,32}$/;
const reservedAliases = new Set(["api", "health", "not-found", "expired", "dashboard", "blocked"]);

function getExpiresAt() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.linkTtlDays);
  return expiresAt;
}

function getShortUrl(shortCode) {
  return `${env.baseUrl}/${shortCode}`;
}

function normalizeAlias(rawAlias) {
  const alias = String(rawAlias ?? "").trim();

  if (!alias) {
    return "";
  }

  if (!aliasPattern.test(alias)) {
    throw badRequest("Alias must be 4-32 characters and can only use letters, numbers, hyphens, and underscores.");
  }

  if (reservedAliases.has(alias.toLowerCase())) {
    throw badRequest("This alias is reserved. Choose a different alias.");
  }

  return alias;
}

export async function createLink(req, res, next) {
  try {
    const rawUrl = req.body?.originalUrl ?? req.body?.url;
    const requestedAlias = normalizeAlias(req.body?.alias ?? req.body?.customAlias ?? req.body?.shortCode);
    const originalUrl = await validateUrl(rawUrl);

    let link;
    if (requestedAlias) {
      try {
        link = await Link.create({
          originalUrl,
          shortCode: requestedAlias,
          expiresAt: getExpiresAt()
        });
      } catch (error) {
        if (error?.code === 11000) {
          throw conflict("This alias is already in use. Choose another one.");
        }

        throw error;
      }
    }

    if (!link) {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          link = await Link.create({
            originalUrl,
            shortCode: nanoid(env.shortCodeLength),
            expiresAt: getExpiresAt()
          });
          break;
        } catch (error) {
          if (error?.code !== 11000 || attempt === 4) {
            throw error;
          }
        }
      }
    }

    return res.status(201).json({
      data: {
        id: link._id,
        shortCode: link.shortCode,
        shortUrl: getShortUrl(link.shortCode),
        clicks: link.clicks,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function listLinks(req, res, next) {
  try {
    const links = await Link.find({})
      .select("originalUrl shortCode clicks createdAt expiresAt status")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      data: links.map((link) => ({
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: getShortUrl(link.shortCode),
        clicks: link.clicks,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt,
        status: link.status
      }))
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteLink(req, res, next) {
  try {
    const deleted = await Link.findByIdAndDelete(req.params.id).select("_id").lean();

    if (!deleted) {
      throw notFound("Short link not found.");
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function redirectLink(req, res, next) {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode }).select("originalUrl expiresAt status");

    if (!link) {
      throw notFound("Short link not found.");
    }

    if (link.status === "blocked") {
      throw forbidden("Short link is blocked.");
    }

    if (link.expiresAt <= new Date()) {
      throw gone("Short link has expired.");
    }

    await Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } });

    return res.redirect(302, link.originalUrl);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.redirect(302, `${env.frontendUrl}/not-found`);
    }

    if (error.statusCode === 410) {
      return res.redirect(302, `${env.frontendUrl}/expired`);
    }

    if (error.statusCode === 403) {
      return res.redirect(302, `${env.frontendUrl}/blocked`);
    }

    return next(error);
  }
}
