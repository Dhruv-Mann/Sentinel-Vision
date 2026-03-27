"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, LogOut, Menu, Shield, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/", label: "Home", icon: Home },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initial = email ? email.charAt(0).toUpperCase() : "?";

  return (
    <nav className="page-frame pt-4">
      <div className="neo-panel px-3 py-3 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-accent)] text-white">
              <Shield className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold tracking-tight">Sentinel</span>
              <span className="neo-label text-[var(--color-text-muted)]">workspace</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 border-2 px-3 py-2 text-xs font-bold transition-colors ${
                    active
                      ? "border-[var(--color-border-main)] bg-[var(--color-accent)] text-white"
                      : "border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] hover:bg-[var(--color-bg-hover)]"
                  }`}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="inline-flex h-9 w-9 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] text-sm font-extrabold"
                title={email ?? "Account"}
              >
                {initial}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-11 z-20 w-64 border-2 border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] p-3 shadow-[5px_5px_0_var(--color-border-main)]">
                  <p className="neo-label text-[var(--color-text-muted)]">Signed in as</p>
                  <p className="mt-1 truncate text-sm font-semibold">{email ?? "-"}</p>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 border-2 border-[var(--color-border-main)] bg-[var(--color-error-bg)] px-3 py-2 text-xs font-bold text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-3 border-t-2 border-[var(--color-border-main)] pt-3 md:hidden">
            <div className="grid gap-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`inline-flex items-center gap-2 border-2 px-3 py-2 text-sm font-bold ${
                      active
                        ? "border-[var(--color-border-main)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)]"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}

              <div className="neo-panel-soft mt-1 p-3">
                <p className="neo-label text-[var(--color-text-muted)]">Account</p>
                <p className="mt-1 truncate text-sm font-semibold">{email ?? "Signed out"}</p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 border-2 border-[var(--color-border-main)] bg-[var(--color-error-bg)] px-3 py-2 text-xs font-bold text-[var(--color-error)]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
