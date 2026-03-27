"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ChevronLeft,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  Shield,
  UserPlus,
} from "lucide-react";

type Mode = "signin" | "signup" | "verify" | "forgot" | "reset";

const PASSWORD_RULES = [
  (pw: string) => pw.length >= 8,
  (pw: string) => /[A-Z]/.test(pw),
  (pw: string) => /[a-z]/.test(pw),
  (pw: string) => /\d/.test(pw),
  (pw: string) => /[^A-Za-z0-9]/.test(pw),
];

function isPasswordValid(pw: string): boolean {
  return PASSWORD_RULES.every((rule) => rule(pw));
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!isPasswordValid(password)) {
      setError("Use 8+ chars with upper, lower, number, and symbol.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.signUp({ email, password });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setMessage("A verification code was sent to your email.");
    setMode("verify");
    setLoading(false);
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.resetPasswordForEmail(email);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setMessage("Recovery code sent. Check your email.");
    setMode("reset");
    setLoading(false);
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isPasswordValid(password)) {
      setError("Use 8+ chars with upper, lower, number, and symbol.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

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

    const { error: updateErr } = await supabase.auth.updateUser({ password });

    if (updateErr) {
      setError(updateErr.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  function goTo(target: Mode) {
    setMode(target);
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setShowPassword(false);
  }

  const titles: Record<Mode, { heading: string; sub: string }> = {
    signin: { heading: "Sign in", sub: "Access your dashboard." },
    signup: { heading: "Create account", sub: "Start tracking your resume links." },
    verify: { heading: "Verify email", sub: `Enter the code sent to ${email || "your email"}.` },
    forgot: { heading: "Forgot password", sub: "Get a recovery code by email." },
    reset: { heading: "Reset password", sub: "Use your code and set a new password." },
  };

  return (
    <main className="page-frame min-h-screen py-6 sm:py-10">
      <Link
        href="/"
        className="neo-panel-soft inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold hover:bg-[var(--color-bg-hover)]"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      <section className="mx-auto mt-5 w-full max-w-md neo-panel p-5 sm:p-7">
        <div className="mb-6 flex items-start gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-accent)] text-white">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <p className="neo-label text-[var(--color-text-muted)]">auth</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{titles[mode].heading}</h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{titles[mode].sub}</p>
          </div>
        </div>

        {message && <Notice tone="success" text={message} />}
        {error && <Notice tone="error" text={error} />}

        {mode === "signin" && (
          <form className="mt-4 space-y-3" onSubmit={handleSignIn}>
            <InputRow
              id="email"
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
            />
            <InputRow
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              icon={<Lock className="h-4 w-4" />}
              suffix={
                <button
                  type="button"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <PrimaryButton loading={loading} icon={<LogIn className="h-4 w-4" />}>
              {loading ? "Signing in..." : "Sign in"}
            </PrimaryButton>
            <div className="flex items-center justify-between pt-1 text-xs text-[var(--color-text-muted)]">
              <button type="button" onClick={() => goTo("forgot")} className="hover:text-[var(--color-text-primary)]">
                Forgot password?
              </button>
              <button type="button" onClick={() => goTo("signup")} className="font-semibold hover:text-[var(--color-text-primary)]">
                Create account
              </button>
            </div>
          </form>
        )}

        {mode === "signup" && (
          <form className="mt-4 space-y-3" onSubmit={handleSignUp}>
            <InputRow
              id="email-signup"
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
            />
            <InputRow
              id="password-signup"
              label="Password"
              value={password}
              onChange={setPassword}
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              icon={<Lock className="h-4 w-4" />}
              suffix={
                <button
                  type="button"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <p className="text-xs text-[var(--color-text-muted)]">Use 8+ chars with upper, lower, number, and symbol.</p>
            <PrimaryButton
              loading={loading}
              icon={<UserPlus className="h-4 w-4" />}
              disabled={!isPasswordValid(password)}
            >
              {loading ? "Creating account..." : "Create account"}
            </PrimaryButton>
            <button type="button" onClick={() => goTo("signin")} className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              Back to sign in
            </button>
          </form>
        )}

        {mode === "verify" && (
          <form className="mt-4 space-y-3" onSubmit={handleVerify}>
            <InputRow
              id="otp"
              label="Verification code"
              value={otp}
              onChange={setOtp}
              type="text"
              placeholder="Enter code"
              icon={<KeyRound className="h-4 w-4" />}
              maxLength={8}
              autoFocus
            />
            <PrimaryButton loading={loading} icon={<KeyRound className="h-4 w-4" />} disabled={otp.length < 6}>
              {loading ? "Verifying..." : "Verify"}
            </PrimaryButton>
            <button type="button" onClick={() => goTo("signup")} className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              Resend code
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form className="mt-4 space-y-3" onSubmit={handleForgot}>
            <InputRow
              id="email-forgot"
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
            />
            <PrimaryButton loading={loading} icon={<Mail className="h-4 w-4" />}>
              {loading ? "Sending..." : "Send recovery code"}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => goTo("signin")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form className="mt-4 space-y-3" onSubmit={handleReset}>
            <InputRow
              id="otp-reset"
              label="Recovery code"
              value={otp}
              onChange={setOtp}
              type="text"
              placeholder="Enter code"
              icon={<KeyRound className="h-4 w-4" />}
              maxLength={8}
              autoFocus
            />
            <InputRow
              id="password-reset"
              label="New password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="Create password"
              icon={<Lock className="h-4 w-4" />}
            />
            <InputRow
              id="password-confirm"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
              placeholder="Repeat password"
              icon={<Lock className="h-4 w-4" />}
            />
            <PrimaryButton
              loading={loading}
              icon={<Lock className="h-4 w-4" />}
              disabled={!isPasswordValid(password) || password !== confirmPassword || otp.length < 6}
            >
              {loading ? "Resetting..." : "Reset password"}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => goTo("signin")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function InputRow({
  id,
  label,
  value,
  onChange,
  type,
  placeholder,
  icon,
  suffix,
  maxLength,
  autoFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
  maxLength?: number;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-[var(--color-border-main)] bg-[var(--color-bg-input)] px-10 py-2.5 text-sm font-medium outline-none transition-colors focus:bg-[var(--color-bg-hover)]"
          placeholder={placeholder}
          required
          maxLength={maxLength}
          autoFocus={autoFocus}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  loading,
  icon,
  disabled,
}: {
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex w-full items-center justify-center gap-2 border-2 border-[var(--color-border-main)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-extrabold text-white shadow-[4px_4px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {icon}
      {children}
    </button>
  );
}

function Notice({ tone, text }: { tone: "error" | "success"; text: string }) {
  const isError = tone === "error";
  return (
    <p
      className="mb-3 border-2 px-3 py-2 text-xs font-semibold"
      style={{
        borderColor: isError ? "var(--color-error)" : "var(--color-success)",
        background: isError ? "var(--color-error-bg)" : "var(--color-success-bg)",
        color: isError ? "var(--color-error)" : "var(--color-success)",
      }}
    >
      {text}
    </p>
  );
}
