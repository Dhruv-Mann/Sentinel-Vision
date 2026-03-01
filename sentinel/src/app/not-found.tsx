import Link from "next/link";
import { Shield } from "lucide-react";

/**
 * Custom 404 page – matches the app's dark cyberpunk aesthetic.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      <Shield className="mb-4 h-10 w-10 text-zinc-700" />
      <h1 className="text-6xl font-extrabold tracking-tight text-zinc-100">
        404
      </h1>
      <p className="mt-3 text-lg text-zinc-500">
        This page doesn&apos;t exist — or the link has expired.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-green-500/30 hover:text-green-400"
      >
        Go Home
      </Link>
    </main>
  );
}
