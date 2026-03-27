import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

/**
 * Custom 404 page – premium dark aesthetic.
 */
export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#09090b" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #c0c0d0 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative animate-fade-up">
        {/* Icon */}
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(39,39,42,0.6)",
            border: "1px solid rgba(63,63,70,0.5)",
          }}
        >
          <Shield className="h-8 w-8 text-zinc-600" />
        </div>

        {/* 404 number */}
        <p
          className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-700"
        >
          Error 404
        </p>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-zinc-100">
          Page not found
        </h1>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-500">
          This page doesn&apos;t exist — or the link may have expired. Check the
          URL or head back home.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-all duration-150 hover:scale-[1.02] active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e4e4e7 100%)",
              boxShadow: "0 4px 16px rgba(255,255,255,0.08)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-150 hover:text-zinc-200"
            style={{
              background: "rgba(39,39,42,0.6)",
              border: "1px solid rgba(63,63,70,0.5)",
            }}
          >
            Dashboard
          </Link>
        </div>

        {/* Attribution */}
        <p className="mt-16 text-xs text-zinc-800">
          Sentinel — by Dhruv Mann
        </p>
      </div>
    </main>
  );
}
