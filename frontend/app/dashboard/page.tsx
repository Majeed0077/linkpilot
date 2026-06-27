import Link from "next/link";
import { DashboardLinks } from "@/components/DashboardLinks";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[color:var(--foreground)]">
      <header className="glass-panel sticky top-0 z-30 border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8 lg:px-12">
          <Link className="flex items-center" href="/" aria-label="LinkPilot">
            <img src="/Logo-bust.png" alt="LinkPilot" className="h-12 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-bold text-[color:var(--muted)] md:flex">
            <Link href="/" className="hover:text-[color:var(--foreground)]">Shortener</Link>
            <Link href="/dashboard" className="hover:text-[color:var(--foreground)]">Dashboard</Link>
          </nav>
          <Link href="/#shorten" className="brand-button lift-3d bg-[var(--accent)] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] hover:bg-[var(--accent-strong)]">
            New Link
          </Link>
        </div>
      </header>

      <section className="glass-dark text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 lg:px-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">Dashboard</p>
          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight md:text-5xl">Your short links</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Links are stored for 3 days, then removed automatically.
          </p>
        </div>
      </section>

      <DashboardLinks />
    </main>
  );
}
