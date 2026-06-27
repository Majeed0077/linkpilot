import dns from "node:dns/promises";
import net from "node:net";
import { badRequest } from "./httpError.js";

const allowedProtocols = new Set(["http:", "https:"]);
const blockedHostnames = new Set(["localhost", "localhost.localdomain"]);
const maxUrlLength = 2048;

function isPrivateIp(address) {
  if (net.isIPv4(address)) {
    const [first, second, third] = address.split(".").map(Number);

    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 0 && third === 0) ||
      (first === 192 && second === 0 && third === 2) ||
      (first === 192 && second === 168) ||
      (first === 198 && second === 18) ||
      (first === 198 && second === 19) ||
      (first === 198 && second === 51 && third === 100) ||
      (first === 203 && second === 0 && third === 113) ||
      first >= 224
    );
  }

  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    const ipv4Mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);

    if (ipv4Mapped) {
      return isPrivateIp(ipv4Mapped[1]);
    }

    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:") ||
      normalized.startsWith("2001:db8:")
    );
  }

  return false;
}

async function assertPublicHost(hostname) {
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw badRequest("Private, loopback, and unspecified IP addresses are not allowed.");
    }

    return;
  }

  let records;
  try {
    records = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw badRequest("URL host could not be resolved.");
  }

  if (records.length === 0 || records.some((record) => isPrivateIp(record.address))) {
    throw badRequest("URLs resolving to private networks are not allowed.");
  }
}

export async function validateUrl(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw badRequest("originalUrl is required.");
  }

  if (value.length > maxUrlLength) {
    throw badRequest("URL is too long.");
  }

  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw badRequest("originalUrl must be a valid absolute URL.");
  }

  if (!parsed.hostname) {
    throw badRequest("URL hostname is required.");
  }

  if (!allowedProtocols.has(parsed.protocol)) {
    throw badRequest("Only http and https URLs are allowed.");
  }

  if (parsed.username || parsed.password) {
    throw badRequest("URLs with embedded credentials are not allowed.");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (blockedHostnames.has(hostname) || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw badRequest("Localhost URLs are not allowed.");
  }

  await assertPublicHost(hostname);

  parsed.hash = "";
  parsed.hostname = hostname;
  return parsed.toString();
}
