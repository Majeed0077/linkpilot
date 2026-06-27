import { BarChart3, Clock3, DatabaseZap, Edit3, ShieldCheck } from "lucide-react";
import { ShortenerForm } from "@/components/ShortenerForm";

const planFeatures = [
  {
    title: "Detailed Link Analytics",
    copy: "Track clicks, creation dates, expiry dates, and status from a focused dashboard.",
    icon: BarChart3
  },
  {
    title: "3-Day Auto Expiry",
    copy: "Every short link is temporary by design and is removed automatically after 3 days.",
    icon: Clock3
  },
  {
    title: "Safe Redirect Logic",
    copy: "Redirects resolve from database short codes only, never from raw query parameters.",
    icon: ShieldCheck
  },
  {
    title: "Link Management",
    copy: "Search, copy, open, and delete active links without a heavy admin interface.",
    icon: Edit3
  }
];

const managementItems = [
  ["Tracked Clicks", "See how often each short link is opened."],
  ["Temporary Sharing", "Ideal for previews, campaigns, social posts, and quick handoffs."],
  ["URL Validation", "Unsupported protocols and risky local targets are rejected."],
  ["QR Ready", "Generate a QR code for any destination URL in the browser."],
  ["TTL Cleanup", "MongoDB removes expired documents through the expiresAt index."],
  ["Abuse Ready", "Rate limits and blocked link status are already built in."]
];

const faqs = [
  ["What is LinkPilot?", "LinkPilot is a temporary URL shortener for creating clean links that expire automatically."],
  ["How long do links stay active?", "Links stay active for 3 days and are then removed by the database TTL index."],
  ["Can I generate QR codes?", "Yes. The QR tab creates a scannable QR image for the destination URL."],
  ["Can I manage links?", "Yes. The dashboard lists original URLs, short URLs, clicks, expiry, status, and actions."],
  ["Is redirect abuse prevented?", "Redirects only happen after a database lookup by short code."],
  ["Can auth be added later?", "Yes. The backend structure is ready for future auth and admin permissions."]
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[color:var(--foreground)]">
      <header className="glass-panel sticky top-0 z-30 border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
          <a href="/" aria-label="LinkPilot" className="flex items-center">
            <img src="/Logo-bust.png" alt="LinkPilot" className="h-12 w-auto" />
          </a>
          <nav className="hidden items-center gap-7 text-sm font-bold text-[color:var(--muted)] md:flex">
            <a href="#workflow" className="hover:text-[color:var(--foreground)]">Workflow</a>
            <a href="#features" className="hover:text-[color:var(--foreground)]">QR</a>
            <a href="#management" className="hover:text-[color:var(--foreground)]">Dashboard</a>
            <a href="#resources" className="hover:text-[color:var(--foreground)]">Security</a>
          </nav>
          <div className="flex items-center gap-4 text-sm font-bold">
            <a href="/dashboard" className="hidden hover:text-[color:var(--accent)] sm:inline">Log In</a>
            <a href="#shorten" className="brand-button lift-3d bg-[var(--accent)] px-4 py-2 font-bold hover:bg-[var(--accent-strong)]">
              Sign Up
            </a>
          </div>
        </div>
      </header>

      <section id="shorten" className="glass-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_430px] md:px-8 md:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-xl text-3xl font-black leading-tight md:text-5xl">
              Short links with QR, expiry, and cleanup built in
            </h1>
            <p className="mt-6 max-w-lg text-base font-semibold leading-7 text-slate-100">
              LinkPilot turns long URLs into clean links that are made for quick sharing, not permanent clutter.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
              Create short links, generate QR codes, track clicks, and let every link expire automatically after 3 days.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#workflow" className="brand-button lift-3d glass-panel bg-white px-5 py-3 text-sm font-bold hover:bg-[var(--accent-soft)]">
                See Workflow
              </a>
              <a href="#shorten" className="brand-button lift-3d bg-[var(--accent)] px-5 py-3 text-sm font-bold hover:bg-[var(--accent-strong)]">
                Create Free Account
              </a>
            </div>
          </div>

          <ShortenerForm />

          <div className="md:col-span-2">
            <h2 className="mb-3 text-lg font-black">Your Recent Links:</h2>
            <div className="glass-panel px-4 py-3 text-sm font-bold text-slate-800">
              No links yet in your history
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-black md:text-3xl">What every LinkPilot link includes</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {planFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-panel lift-3d group relative flex min-h-[330px] flex-col overflow-hidden p-6"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" />
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="max-w-[12rem] text-base font-black leading-tight md:text-lg">{feature.title}</h3>
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">{feature.copy}</p>
                  <div className="mt-auto flex h-32 items-end justify-center pt-8">
                    <div className="grid h-24 w-24 place-items-center bg-white/70 shadow-xl shadow-black/10 ring-1 ring-white/80">
                      <Icon className="h-11 w-11 text-slate-950 transition group-hover:scale-105" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="grid bg-[var(--accent)] text-slate-950 md:grid-cols-[1.05fr_0.95fr]">
        <div
          className="relative min-h-[390px] bg-cover bg-center md:min-h-[500px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/25" />
        </div>
        <div className="flex items-center px-5 py-14 md:px-16">
          <div className="glass-panel lift-3d max-w-xl border border-white/70 bg-white/78 p-8 md:p-10">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">Fast workflow</p>
            <h2 className="text-2xl font-black leading-tight md:text-3xl">Link shortening done quick and clean</h2>
            <p className="mt-6 text-sm font-bold leading-7 text-slate-950">
              Paste a long URL, shorten it, copy the result, and share it anywhere.
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-700">
              Use short links for campaigns, previews, event pages, product launches, social bios, and QR handoffs.
            </p>
            <div className="mt-7 flex gap-3">
              <a href="#workflow" style={{ color: "#111827" }} className="lift-3d bg-white px-5 py-3 text-sm font-bold shadow-lg shadow-black/10">
                See Workflow
              </a>
              <a href="/dashboard" style={{ color: "#ffffff" }} className="lift-3d bg-[var(--ink)] px-5 py-3 text-sm font-bold shadow-lg shadow-black/20">
                Open Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="management" className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-black md:text-3xl">Shorten, scan, manage, then let it expire</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[color:var(--muted)]">
            LinkPilot gives you the pieces needed to shorten, monitor, and clean up links without a complicated interface.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-[1fr_360px_1fr] md:items-stretch">
            <div className="space-y-4">
              {managementItems.slice(0, 3).map(([title, copy], index) => (
                <div key={title} className="glass-panel lift-3d p-5">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 text-xs font-black tracking-[0.18em] text-[color:var(--accent-strong)]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-black">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-panel lift-3d min-h-[420px] bg-white/74 p-8">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="grid h-24 w-24 place-items-center bg-[var(--accent)] shadow-xl shadow-black/10">
                  <DatabaseZap className="h-12 w-12 text-slate-950" />
                </div>
                <p className="mt-8 text-5xl font-black leading-none text-slate-950">3</p>
                <p className="text-4xl font-black leading-tight text-slate-950">days</p>
                <div className="my-6 h-px w-24 bg-[var(--line)]" />
                <p className="max-w-xs text-sm font-semibold leading-6 text-[color:var(--muted)]">
                  Automatic expiry keeps every short link focused, temporary, and clean.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {managementItems.slice(3).map(([title, copy], index) => (
                <div key={title} className="glass-panel lift-3d p-5">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 text-xs font-black tracking-[0.18em] text-[color:var(--accent-strong)]">
                      0{index + 4}
                    </span>
                    <div>
                      <h3 className="text-base font-black">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="glass-dark grid overflow-hidden text-white md:grid-cols-2">
        <div className="flex items-center px-5 py-16 md:px-20">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--accent)]">Temporary by design</p>
            <h2 className="text-2xl font-black leading-tight md:text-3xl">Built for links that should not live forever</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              LinkPilot is designed for creators, teams, small businesses, and campaigns that need clean links without permanent clutter.
            </p>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["3 days", "automatic expiry"],
                ["302", "safe redirects"],
                ["TTL", "Mongo cleanup"],
                ["Clicks", "tracked per link"]
              ].map(([value, label]) => (
                <div key={value} className="border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/10 backdrop-blur">
                  <dt className="text-3xl font-black text-[color:var(--accent)]">{value}</dt>
                  <dd className="mt-1 text-sm text-slate-300">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div
          className="relative min-h-[360px] bg-cover bg-center md:min-h-[470px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/15 via-transparent to-black/30" />
        </div>
      </section>

      <section id="resources" className="px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[300px_1fr]">
          <div className="glass-panel lift-3d p-7">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">Security notes</p>
            <h2 className="text-2xl font-black leading-tight md:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">
              Quick answers about expiry, QR codes, redirects, and future account controls.
            </p>
          </div>
          <div className="glass-panel divide-y divide-[var(--line)] px-6 shadow-2xl shadow-black/10">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-black">
                  {question}
                  <span className="grid h-7 w-7 shrink-0 place-items-center bg-[var(--accent)] text-base text-slate-950 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-dark px-5 py-18 text-white md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--accent)]">Start in seconds</p>
            <h2 className="max-w-2xl text-2xl font-black leading-tight md:text-4xl">Ready for shorter, smarter links?</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              Transform a long URL into a clean, temporary link with expiry, tracking, QR support, and safe redirects.
            </p>
          </div>
          <div className="glass-panel flex flex-col gap-3 bg-white/10 p-4 sm:flex-row">
            <a href="#workflow" style={{ color: "#111827" }} className="lift-3d bg-white px-5 py-3 text-center text-sm font-bold shadow-lg shadow-black/10">
              See Workflow
            </a>
            <a href="#shorten" style={{ color: "#111827" }} className="lift-3d bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold shadow-lg shadow-orange-500/20">
              Create Free Account
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#101419] px-5 py-14 text-white md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_2fr]">
            <div>
              <img src="/Logo-bust.png" alt="LinkPilot" className="h-14 w-auto bg-white/95 px-3 py-2" />
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
                Temporary short links with safe redirects, 3-day expiry, QR support, and lightweight click tracking.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Features", "Link Editor", "Link Management", "Short URL API", "QR Code Generator"],
                ["Resources", "Blog", "For Developers", "Our Process", "About Us"],
                ["Contact Us", "Help Desk", "Contact Sales", "Contact Support", "Report Abuse"],
                ["Legal", "Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility"]
              ].map(([heading, ...items]) => (
                <div key={heading}>
                  <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[color:var(--accent)]">{heading}</h3>
                  <ul className="mt-5 space-y-3 text-sm text-slate-300">
                    {items.map((item) => (
                      <li key={item}>
                        <a href="#shorten" className="transition hover:text-white">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>© 2026 LinkPilot. Built for clean temporary sharing.</p>
            <p>3-day expiry · Safe redirects · QR ready</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
