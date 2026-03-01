"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Mail, Lock, LogIn, UserPlus, KeyRound } from "lucide-react";

type Mode = "signin" | "signup" | "verify";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  /* ── Sign In ──────────────────────────────────────────── */
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  /* ── Sign Up → sends OTP email ────────────────────────── */
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // Move to OTP verification step
    setMessage("A verification code has been sent to your email.");
    setMode("verify");
    setLoading(false);
  }

  /* ── Verify OTP code ──────────────────────────────────── */
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  /* ── Switch modes ─────────────────────────────────────── */
  function switchToSignUp() {
    setMode("signup");
    setError(null);
    setMessage(null);
    setOtp("");
  }

  function switchToSignIn() {
    setMode("signin");
    setError(null);
    setMessage(null);
    setOtp("");
  }

  /* ── Titles per mode ──────────────────────────────────── */
  const titles: Record<Mode, { heading: string; sub: string }> = {
    signin: {
      heading: "Welcome back",
      sub: "Sign in to your Sentinel account",
    },
    signup: {
      heading: "Create an account",
      sub: "Start tracking your resume views",
    },
    verify: {
      heading: "Verify your email",
      sub: `Enter the code sent to ${email}`,
    },
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl shadow-black/40">
        {/* Logo / Title */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            {titles[mode].heading}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {titles[mode].sub}
          </p>
        </div>

        {/* ─── SIGN IN FORM ─────────────────────────────── */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              icon={<Mail className="h-4 w-4" />}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              icon={<Lock className="h-4 w-4" />}
              minLength={6}
            />

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <p className="pt-2 text-center text-sm text-zinc-500">
              Not a user?{" "}
              <button
                type="button"
                onClick={switchToSignUp}
                className="font-medium text-green-400 transition hover:text-green-300"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* ─── SIGN UP FORM ─────────────────────────────── */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              icon={<Mail className="h-4 w-4" />}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={setPassword}
              icon={<Lock className="h-4 w-4" />}
              minLength={6}
            />

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating account…" : "Sign Up"}
            </button>

            <p className="pt-2 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={switchToSignIn}
                className="font-medium text-green-400 transition hover:text-green-300"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* ─── OTP VERIFICATION ─────────────────────────── */}
        {mode === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            {message && <SuccessMsg text={message} />}

            <InputField
              id="otp"
              label="Verification Code"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={setOtp}
              icon={<KeyRound className="h-4 w-4" />}
              maxLength={8}
              autoFocus
            />

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={loading || otp.length < 6}  // Supabase OTP can be 6-8 chars
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>

            <p className="pt-2 text-center text-sm text-zinc-500">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setMessage(null);
                }}
                className="font-medium text-green-400 transition hover:text-green-300"
              >
                Resend
              </button>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

/* ── Reusable sub-components ────────────────────────────── */

function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  minLength,
  maxLength,
  autoFocus,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  minLength?: number;
  maxLength?: number;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30"
        />
      </div>
    </div>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
      {text}
    </p>
  );
}

function SuccessMsg({ text }: { text: string }) {
  return (
    <p className="rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400">
      {text}
    </p>
  );
}
