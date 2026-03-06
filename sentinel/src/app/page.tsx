"use client";

import Link from "next/link";
import { Shield, Eye, BarChart3, Globe } from "lucide-react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { MetalButton } from "@/components/ui/metal-button";

export default function Home() {
  return (
    <>
      {/* Full-screen WebGL shader background */}
      <WebGLShader />

      {/* Floating glassmorphism navbar */}
      <nav className="fixed top-4 left-1/2 z-50 flex w-[90%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-6 py-3 shadow-lg backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-zinc-100" />
          <span className="text-sm font-bold tracking-tight text-white">
            Sentinel
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-300 transition hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero section — on top of shader */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Logo mark */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md">
          <Shield className="h-8 w-8 text-zinc-100" />
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
          Sentinel-Vision
        </h1>

        <p className="mt-4 max-w-lg text-lg leading-relaxed text-zinc-300">
          Next-Gen Resume Analytics &amp; Insight.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <LiquidButton size="lg">Analyze Resume</LiquidButton>
          </Link>
          <a
            href="https://github.com/Dhruv-Mann/Sentinel-Vision"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MetalButton variant="gold">View on GitHub</MetalButton>
          </a>
        </div>

        {/* Feature pills */}
        <div className="mt-20 grid w-full max-w-xl gap-4 sm:grid-cols-3">
          {[
            { icon: Eye, label: "Real-time Views" },
            { icon: Globe, label: "Geo Tracking" },
            { icon: BarChart3, label: "Duration Analytics" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300 backdrop-blur-md transition hover:border-white/20 hover:text-white"
            >
              <Icon className="h-4 w-4 text-zinc-100" />
              {label}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-20 text-xs text-zinc-500">
          Built with Next.js, Supabase &amp; Tailwind CSS
        </p>
      </main>
    </>
  );
}
