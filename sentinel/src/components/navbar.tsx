"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, LogOut, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabase";

/**
 * Shared navigation bar – rendered on dashboard pages.
 * Shows the Sentinel logo, nav links, and a sign-out button.
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Left – Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-400" />
          <span className="text-sm font-bold tracking-tight text-zinc-100">
            Sentinel
          </span>
        </Link>

        {/* Center – Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              pathname === "/dashboard"
                ? "bg-zinc-800 text-green-400"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </div>

        {/* Right – Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-red-500/30 hover:text-red-400"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
