"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";

/**
 * Shared navigation bar – rendered on dashboard pages.
 * Shows the Sentinel logo, nav links, and a sign-out button.
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = email ? email[0].toUpperCase() : "?";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-main)] bg-[var(--bg-page)]/80 backdrop-blur-md">
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

        {/* Right – Theme toggle + User menu */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* User avatar */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-sm font-semibold text-green-400 ring-1 ring-green-500/30 transition hover:bg-green-500/25"
              title={email ?? "Account"}
            >
              {initial}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-[var(--border-main)] bg-[var(--bg-card-solid)] shadow-xl shadow-black/40">
                {/* Email */}
                <div className="border-b border-[var(--border-main)] px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Signed in as
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-[var(--text-primary)]">
                    {email ?? "\u2014"}
                  </p>
                </div>
                {/* Sign out */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--bg-input)] hover:text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
