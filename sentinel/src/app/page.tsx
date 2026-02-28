import Link from "next/link";
import { Shield, ArrowRight, Eye, BarChart3, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 text-center">
      {/* Gradient glow behind hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 h-[500px] w-[700px] rounded-full bg-green-500/10 blur-[140px]"
      />

      {/* Logo mark */}
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-green-500/5">
        <Shield className="h-7 w-7 text-green-400" />
      </div>

      {/* Heading */}
      <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-zinc-100 sm:text-5xl md:text-6xl">
        <span className="text-green-400">Sentinel</span>: Resume Analytics
      </h1>

      <p className="mt-4 max-w-lg text-lg leading-relaxed text-zinc-400">
        Share your resume with a trackable link. Know{" "}
        <span className="text-zinc-200">who</span> viewed it,{" "}
        <span className="text-zinc-200">where</span> from, on{" "}
        <span className="text-zinc-200">what device</span>, and for{" "}
        <span className="text-zinc-200">how long</span>.
      </p>

      {/* CTA */}
      <Link
        href="/dashboard"
        className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-500"
      >
        Launch Dashboard
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* Feature pills */}
      <div className="mt-16 grid w-full max-w-xl gap-4 sm:grid-cols-3">
        {[
          { icon: Eye, label: "Real-time Views" },
          { icon: Globe, label: "Geo Tracking" },
          { icon: BarChart3, label: "Duration Analytics" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <Icon className="h-4 w-4 text-green-400" />
            {label}
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-20 text-xs text-zinc-700">
        Built with Next.js, Supabase &amp; Tailwind CSS
      </p>
    </main>
  );
}
