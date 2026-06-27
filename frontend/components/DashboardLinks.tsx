"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Search, Trash2 } from "lucide-react";
import { deleteShortLink, getLinks, type DashboardLink } from "@/lib/api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function statusClass(status: DashboardLink["status"]) {
  return status === "blocked" ? "bg-red-100 text-red-800" : "bg-[var(--accent-soft)] text-slate-950";
}

export function DashboardLinks() {
  const [links, setLinks] = useState<DashboardLink[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLinks() {
      try {
        const nextLinks = await getLinks();
        if (isMounted) {
          setLinks(nextLinks);
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load short links.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return links.filter((link) => {
      const matchesStatus = status === "all" || link.status === status;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        link.originalUrl.toLowerCase().includes(normalizedQuery) ||
        link.shortUrl.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [links, query, status]);

  async function copyLink(link: DashboardLink) {
    await navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  async function removeLink(id: string) {
    setError("");
    setDeletingId(id);

    try {
      await deleteShortLink(id);
      setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete short link.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-12">
      <div className="glass-panel px-5 py-5 md:px-7">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-md">
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]" htmlFor="link-filter">
            Search links
          </label>
          <div className="flex h-11 items-center gap-3 border-b border-[var(--line)]">
            <Search className="h-4 w-4 text-[color:var(--muted)]" />
            <input
              id="link-filter"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by original or short URL"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--muted)]"
            />
          </div>
        </div>

        <div className="flex gap-2 text-sm font-bold">
          {(["all", "active", "blocked"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={`lift-3d px-3 py-2 capitalize transition ${
                status === option ? "bg-[var(--ink)] text-white" : "bg-white/55 text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="border-b border-[var(--line)] py-4 text-sm font-semibold text-red-700">{error}</p> : null}

      {isLoading ? <p className="border-b border-[var(--line)] py-10 text-sm text-[color:var(--muted)]">Loading short links...</p> : null}

      {!isLoading && filteredLinks.length === 0 ? (
        <div className="border-b border-[var(--line)] py-16">
          <p className="text-xl font-black md:text-2xl">No links found.</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
            Shorten a URL from the homepage and it will appear here until it expires or is deleted.
          </p>
        </div>
      ) : null}

      {filteredLinks.length > 0 ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  <th className="py-4 pr-5 font-black">Original URL</th>
                  <th className="px-5 py-4 font-black">Short URL</th>
                  <th className="px-5 py-4 font-black">Clicks</th>
                  <th className="px-5 py-4 font-black">Created</th>
                  <th className="px-5 py-4 font-black">Expires</th>
                  <th className="px-5 py-4 font-black">Status</th>
                  <th className="py-4 pl-5 text-right font-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="border-b border-[var(--line)] align-top transition hover:bg-[var(--surface)]">
                    <td className="max-w-[300px] truncate py-5 pr-5 text-sm font-semibold">{link.originalUrl}</td>
                    <td className="max-w-[220px] truncate px-5 py-5 text-sm font-bold text-[color:var(--accent)]">{link.shortUrl}</td>
                    <td className="px-5 py-5 text-sm font-bold">{link.clicks}</td>
                    <td className="px-5 py-5 text-sm text-[color:var(--muted)]">{formatDate(link.createdAt)}</td>
                    <td className="px-5 py-5 text-sm text-[color:var(--muted)]">{formatDate(link.expiresAt)}</td>
                    <td className="px-5 py-5 text-sm">
                      <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusClass(link.status)}`}>{link.status}</span>
                    </td>
                    <td className="py-5 pl-5">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => copyLink(link)} className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--muted)] transition hover:text-[color:var(--accent)]">
                          {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copiedId === link.id ? "Copied" : "Copy"}
                        </button>
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--muted)] transition hover:text-[color:var(--accent)]">
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </a>
                        <button type="button" onClick={() => removeLink(link.id)} disabled={deletingId === link.id} className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--muted)] transition hover:text-red-700 disabled:opacity-45">
                          <Trash2 className="h-4 w-4" />
                          {deletingId === link.id ? "Deleting" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[var(--line)] md:hidden">
            {filteredLinks.map((link) => (
              <article key={link.id} className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">{link.originalUrl}</p>
                    <p className="mt-1 truncate text-sm font-bold text-[color:var(--accent)]">{link.shortUrl}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black capitalize ${statusClass(link.status)}`}>{link.status}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-[color:var(--muted)]">
                  <div><span className="block font-black text-[color:var(--foreground)]">{link.clicks}</span>Clicks</div>
                  <div><span className="block font-black text-[color:var(--foreground)]">{formatDate(link.createdAt)}</span>Created</div>
                  <div><span className="block font-black text-[color:var(--foreground)]">{formatDate(link.expiresAt)}</span>Expires</div>
                </div>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => copyLink(link)} className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--muted)]">
                    {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedId === link.id ? "Copied" : "Copy"}
                  </button>
                  <a href={link.shortUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--muted)]">
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </a>
                  <button type="button" onClick={() => removeLink(link.id)} disabled={deletingId === link.id} className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--muted)] disabled:opacity-45">
                    <Trash2 className="h-4 w-4" />
                    {deletingId === link.id ? "Deleting" : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}
      </div>
    </section>
  );
}
