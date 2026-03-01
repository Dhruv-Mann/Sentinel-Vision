"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

type Mode = "signin" | "signup" | "verify" | "forgot" | "reset";

/* ── Password rules ───────────────────────────────────────── */

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter (A-Z)", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a-z)", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "One number (0-9)", test: (pw: string) => /\d/.test(pw) },
  {
    label: "One special character (!@#$%…)",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
];

function isPasswordValid(pw: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(pw));
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!isPasswordValid(password)) {
      setError("Password does not meet all requirements.");
      setLoading(false);
      return;
    }

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

  /* ── Forgot password → send recovery code ─────────────── */
  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: err } = await supabase.auth.resetPasswordForEmail(email);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setMessage("A recovery code has been sent to your email.");
    setMode("reset");
    setLoading(false);
  }

  /* ── Reset password → verify OTP + set new password ───── */
  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!isPasswordValid(password)) {
      setError("Password does not meet all requirements.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Verify recovery OTP — this creates a session
    const { error: otpErr } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    if (otpErr) {
      setError(otpErr.message);
      setLoading(false);
      return;
    }

    // Now update the password
    const { error: updateErr } = await supabase.auth.updateUser({
      password,
    });

    if (updateErr) {
      setError(updateErr.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  /* ── Switch modes ─────────────────────────────────────── */
  function switchTo(target: Mode) {
    setMode(target);
    setError(null);
    setMessage(null);
    setOtp("");
    setPassword("");
    setConfirmPassword("");
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
    forgot: {
      heading: "Forgot password?",
      sub: "We\u2019ll send a recovery code to your email",
    },
    reset: {
      heading: "Reset your password",
      sub: `Enter the code sent to ${email}`,
    },
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-8 shadow-xl shadow-black/40">
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
            />

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in\u2026" : "Sign In"}
            </button>

            <div className="flex items-center justify-between pt-2 text-sm text-zinc-500">
              <button
                type="button"
                onClick={() => switchTo("forgot")}
                className="font-medium text-zinc-400 transition hover:text-green-400"
              >
                Forgot password?
              </button>
              <span>
                Not a user?{" "}
                <button
                  type="button"
                  onClick={() => switchTo("signup")}
                  className="font-medium text-green-400 transition hover:text-green-300"
                >
                  Sign Up
                </button>
              </span>
            </div>
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
              placeholder="Create a strong password"
              value={password}
              onChange={setPassword}
              icon={<Lock className="h-4 w-4" />}
            />

            {/* Live password checklist */}
            {password.length > 0 && <PasswordChecklist password={password} />}

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={loading || !isPasswordValid(password)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating account\u2026" : "Sign Up"}
            </button>

            <p className="pt-2 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchTo("signin")}
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
              placeholder="Enter code"
              value={otp}
              onChange={setOtp}
              icon={<KeyRound className="h-4 w-4" />}
              maxLength={8}
              autoFocus
            />

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              {loading ? "Verifying\u2026" : "Verify & Continue"}
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

        {/* ─── FORGOT PASSWORD ──────────────────────────── */}
        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <InputField
              id="forgot-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              icon={<Mail className="h-4 w-4" />}
            />

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <Mail className="h-4 w-4" />
              {loading ? "Sending\u2026" : "Send Recovery Code"}
            </button>

            <p className="pt-2 text-center text-sm text-zinc-500">
              <button
                type="button"
                onClick={() => switchTo("signin")}
                className="inline-flex items-center gap-1 font-medium text-green-400 transition hover:text-green-300"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </button>
            </p>
          </form>
        )}

        {/* ─── RESET PASSWORD ───────────────────────────── */}
        {mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            {message && <SuccessMsg text={message} />}

            <InputField
              id="recovery-code"
              label="Recovery Code"
              type="text"
              placeholder="Enter code from email"
              value={otp}
              onChange={setOtp}
              icon={<KeyRound className="h-4 w-4" />}
              maxLength={8}
              autoFocus
            />

            <InputField
              id="new-password"
              label="New Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={setPassword}
              icon={<Lock className="h-4 w-4" />}
            />

            {password.length > 0 && <PasswordChecklist password={password} />}

            <InputField
              id="confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              icon={<Lock className="h-4 w-4" />}
            />

            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}

            {error && <ErrorMsg text={error} />}

            <button
              type="submit"
              disabled={
                loading ||
                !isPasswordValid(password) ||
                password !== confirmPassword ||
                otp.length < 6
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {loading ? "Resetting\u2026" : "Reset Password"}
            </button>

            <p className="pt-2 text-center text-sm text-zinc-500">
              <button
                type="button"
                onClick={() => switchTo("signin")}
                className="inline-flex items-center gap-1 font-medium text-green-400 transition hover:text-green-300"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </button>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

/* ── Reusable sub-components ────────────────────────────── */

function PasswordChecklist({ password }: { password: string }) {
  return (
    <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 space-y-1.5">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        Password requirements
      </p>
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <div key={rule.label} className="flex items-center gap-2 text-xs">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                passed
                  ? "bg-green-500/20 text-green-400"
                  : "bg-zinc-700 text-zinc-500"
              }`}
            >
              {passed ? "\u2713" : "\u00b7"}
            </span>
            <span className={passed ? "text-green-400" : "text-zinc-500"}>
              {rule.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

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
