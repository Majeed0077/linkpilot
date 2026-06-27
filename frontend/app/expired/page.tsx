import Link from "next/link";

export default function ExpiredPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[color:var(--foreground)]">
      <header className="glass-panel mx-auto max-w-5xl px-5 py-5 md:px-8">
        <Link className="flex items-center" href="/" aria-label="LinkPilot">
          <img src="/Logo-bust.png" alt="LinkPilot" className="h-12 w-auto" />
        </Link>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        <div className="glass-panel p-8 md:p-12">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-[color:var(--accent)]">Expired link</p>
        <h1 className="max-w-4xl text-3xl font-black leading-tight md:text-5xl">
          This short link is no longer available.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          LinkPilot links expire after three days. Create a fresh short link if you still have the original destination.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex border-b border-[var(--foreground)] pb-2 text-sm font-semibold uppercase tracking-[0.14em]"
        >
          Create a new link
        </Link>
        </div>
      </section>
    </main>
  );
}
