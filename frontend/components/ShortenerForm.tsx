"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Link2, LoaderCircle, QrCode } from "lucide-react";
import { createShortLink, type ShortLink } from "@/lib/api";

export function ShortenerForm() {
  const [mode, setMode] = useState<"shorten" | "qr">("shorten");
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [link, setLink] = useState<ShortLink | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const canSubmit = useMemo(() => url.trim().length > 0 && !isLoading, [url, isLoading]);
  const isQrMode = mode === "qr";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const originalUrl = url.trim();

    setError("");
    setCopied(false);
    setLink(null);
    setQrUrl("");

    if (!originalUrl) {
      setError("Paste your long URL first.");
      return;
    }

    if (isQrMode) {
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(originalUrl)}`);
      return;
    }

    const customAlias = alias.trim();
    if (customAlias && !/^[A-Za-z0-9_-]{4,32}$/.test(customAlias)) {
      setError("Alias must be 4-32 characters. Use letters, numbers, hyphens, or underscores.");
      return;
    }

    setIsLoading(true);
    try {
      const nextLink = await createShortLink(originalUrl, customAlias);
      setLink(nextLink);
    } catch (caught) {
      setLink(null);
      const message = caught instanceof Error ? caught.message : String(caught);

      if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError when attempting to fetch resource") ||
        message.includes("NetworkError")
      ) {
        setError("We could not reach the API. Check that the backend is running.");
      } else {
        setError(message || "We could not create this link. Please check the URL and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function copyShortUrl() {
    if (!link) {
      return;
    }

    await navigator.clipboard.writeText(link.shortUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="glass-panel lift-3d p-4 text-[color:var(--foreground)] md:p-5">
      <div className="grid grid-cols-2 gap-2 bg-white/55 p-1 text-sm font-black shadow-inner shadow-black/5">
        <button
          type="button"
          onClick={() => {
            setMode("shorten");
            setError("");
            setQrUrl("");
          }}
          className={`flex items-center justify-center gap-2 px-4 py-3 transition ${
            !isQrMode ? "bg-[var(--accent)] shadow-lg shadow-orange-500/20" : "text-slate-600 hover:text-slate-950"
          }`}
          style={!isQrMode ? { color: "#111827" } : undefined}
        >
          <Link2 className="h-4 w-4" />
          Shorten
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("qr");
            setError("");
            setLink(null);
          }}
          className={`flex items-center justify-center gap-2 px-4 py-3 transition ${
            isQrMode ? "bg-[var(--accent)] shadow-lg shadow-orange-500/20" : "text-slate-600 hover:text-slate-950"
          }`}
          style={isQrMode ? { color: "#111827" } : undefined}
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div>
          <label htmlFor="url" className="mb-2 block text-sm font-black">
            {isQrMode ? "Destination URL" : "Long URL"} <span className="text-red-600">*</span>
          </label>
          <input
            id="url"
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste long URL here"
            className="h-12 w-full border border-white/70 bg-white/75 px-3 text-sm text-slate-950 outline-none shadow-inner shadow-black/5 transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div>
            <label className="mb-2 block text-sm font-black">Domain</label>
            <select className="h-12 w-full border border-white/70 bg-white/75 px-3 text-sm text-slate-950 outline-none shadow-inner shadow-black/5">
              <option>linkpilot.local</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-black">Alias</label>
            <input
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              disabled={isQrMode || isLoading}
              placeholder="my-custom-link"
              className="h-12 w-full border border-white/70 bg-white/75 px-3 text-sm text-slate-950 outline-none shadow-inner shadow-black/5 placeholder:text-slate-400 disabled:bg-slate-100/70"
            />
            <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
              Optional. 4-32 letters, numbers, hyphens, or underscores.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="lift-3d flex h-12 w-full items-center justify-center gap-2 bg-[var(--accent)] px-4 text-sm font-black uppercase tracking-[0.08em] shadow-xl shadow-orange-500/20 transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          style={{ color: "#111827" }}
        >
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Shortening..." : isQrMode ? "Generate QR Code" : "Shorten Link"}
        </button>

        <p className="text-xs leading-5 text-[color:var(--muted)]">
          {isQrMode ? "QR codes are generated in your browser." : "Short links expire automatically after 3 days."}
        </p>
      </form>

      {error ? <p className="mt-5 border-t border-[var(--line)] pt-4 text-sm font-semibold text-red-700">{error}</p> : null}

      {link ? (
        <section className="mt-5 border-t border-[var(--line)] pt-5" aria-live="polite">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Short link ready</p>
          <a href={link.shortUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm font-black leading-6 text-[color:var(--accent)] hover:underline">
            {link.shortUrl}
          </a>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-[color:var(--muted)]">Expires in 3 days.</p>
            <button type="button" onClick={copyShortUrl} className="flex items-center gap-2 text-sm font-black text-slate-950 hover:text-orange-500">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>
      ) : null}

      {qrUrl ? (
        <section className="mt-5 border-t border-[var(--line)] pt-5" aria-live="polite">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">QR code ready</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src={qrUrl} alt="Generated QR code" className="h-36 w-36 border border-[var(--line)] bg-white p-2" />
            <div>
              <p className="max-w-xs text-sm leading-6 text-[color:var(--muted)]">Scan this code to open your destination URL.</p>
              <a href={qrUrl} download="linkpilot-qr.png" className="mt-3 inline-flex items-center text-sm font-black text-[color:var(--accent)] hover:underline">
                Download QR Code
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
