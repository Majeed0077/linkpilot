const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type ShortLink = {
  shortCode: string;
  shortUrl: string;
  expiresAt: string;
};

export type DashboardLink = {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt: string;
  status: "active" | "blocked";
};

export async function createShortLink(url: string, alias = ""): Promise<ShortLink> {
  const originalUrl = url.trim();
  const customAlias = alias.trim();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        originalUrl,
        ...(customAlias ? { alias: customAlias } : {})
      }),
      signal: controller.signal
    });
  } catch (err) {
    // Normalize network errors so callers don't receive raw messages like "Failed to fetch".
    throw new Error("NetworkError");
  } finally {
    window.clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Unable to create short link.");
  }

  const data = payload?.data ?? payload;

  if (!data?.shortUrl || !data?.shortCode || !data?.expiresAt) {
    throw new Error("The server returned an invalid short link response.");
  }

  return {
    shortUrl: data.shortUrl,
    shortCode: data.shortCode,
    expiresAt: data.expiresAt
  };
}

export async function getLinks(): Promise<DashboardLink[]> {
  const response = await fetch(`${apiBaseUrl}/api/links`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Unable to load short links.");
  }

  return payload?.data ?? payload ?? [];
}

export async function deleteShortLink(id: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/links/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message || "Unable to delete short link.");
  }
}
