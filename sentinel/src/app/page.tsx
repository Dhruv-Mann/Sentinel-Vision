import Link from "next/link";
import { ArrowRight, Github, ShieldCheck, Upload, Link2, BarChart3 } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    title: "Upload",
    text: "Drop your PDF once. Sentinel hosts it and keeps it ready to share.",
  },
  {
    icon: Link2,
    title: "Share",
    text: "Send one controlled link. Set custom slugs and expiry when needed.",
  },
  {
    icon: BarChart3,
    title: "Track",
    text: "See views, attention time, and simple activity trends in one place.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="page-frame pt-5">
        <div className="neo-panel flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-accent)] text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-extrabold tracking-tight">Sentinel Vision</span>
              <span className="neo-label text-[var(--color-text-muted)]">resume analytics</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="neo-panel-soft px-3 py-2 text-xs font-semibold transition-colors hover:bg-[var(--color-bg-hover)]"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 border-2 border-[var(--color-border-main)] bg-[var(--color-accent)] px-3 py-2 text-xs font-extrabold text-white shadow-[3px_3px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="page-frame section-gap">
        <section className="neo-panel animate-fade-up px-5 py-8 sm:px-8 sm:py-10">
          <h1 className="hero-title max-w-3xl">Know what happens after you share your resume.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
            Sentinel gives you a clear signal loop: upload a resume, share one link, and read
            engagement without noise.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border-2 border-[var(--color-border-main)] bg-[var(--color-accent)] px-5 py-3 text-sm font-extrabold text-white shadow-[4px_4px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/Dhruv-Mann/Sentinel-Vision"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] px-5 py-3 text-sm font-bold shadow-[4px_4px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5"
            >
              <Github className="h-4 w-4" />
              View GitHub
            </a>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="neo-label text-[var(--color-text-secondary)]">how it works</p>
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">3 simple steps</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <article key={step.title} className="neo-panel-soft bg-[var(--color-bg-card-solid)] p-5">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-bg-page)]">
                  <step.icon className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-extrabold tracking-tight">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="page-frame pb-8">
        <div className="neo-panel-soft flex flex-col gap-2 px-4 py-3 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Sentinel Vision</p>
          <p>Built by Dhruv Mann</p>
        </div>
      </footer>
    </div>
  );
}
