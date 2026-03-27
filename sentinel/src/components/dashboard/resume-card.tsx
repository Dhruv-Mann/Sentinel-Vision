"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BarChart3,
  Pencil,
  Check,
  X,
  Link2,
  Copy,
  Timer,
  ShieldOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface ResumeCardProps {
  id: string;
  title: string;
  slug: string | null;
  expiresAt: string | null;
  totalViews: number;
  lastViewed: string | null;
  onDelete: () => void;
  onRename: () => void;
}

type ConfirmAction = "delete" | "kill" | null;

export default function ResumeCard({
  id,
  title,
  slug,
  expiresAt,
  totalViews,
  lastViewed,
  onDelete,
  onRename,
}: ResumeCardProps) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [editingSlug, setEditingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState(slug ?? "");
  const [expiryOpen, setExpiryOpen] = useState(false);
  const [currentExpiry, setCurrentExpiry] = useState<string | null>(expiresAt);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  const expiryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (editingSlug && slugInputRef.current) {
      slugInputRef.current.focus();
      slugInputRef.current.select();
    }
  }, [editingSlug]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (expiryRef.current && !expiryRef.current.contains(e.target as Node)) {
        setExpiryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Expiry options ────────────────────────────────────────
  const EXPIRY_OPTIONS = [
    { label: "1 month", months: 1 },
    { label: "2 months", months: 2 },
    { label: "3 months", months: 3 },
    { label: "4 months", months: 4 },
    { label: "5 months", months: 5 },
    { label: "6 months", months: 6 },
    { label: "7 months", months: 7 },
    { label: "Permanent", months: 0 },
  ];

  async function handleSetExpiry(months: number) {
    const expiresAtValue =
      months === 0
        ? null
        : new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("resumes")
      .update({ expires_at: expiresAtValue })
      .eq("id", id);

    if (!error) setCurrentExpiry(expiresAtValue);
    setExpiryOpen(false);
  }

  function getExpiryLabel(): string {
    if (!currentExpiry) return "Permanent";
    const exp = new Date(currentExpiry);
    if (exp <= new Date()) return "Expired";
    return `Expires ${exp.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  const isLinkDead =
    currentExpiry !== null && new Date(currentExpiry) <= new Date();

  // ── Kill link ─────────────────────────────────────────────
  async function handleKillLink() {
    const { error } = await supabase
      .from("resumes")
      .update({ expires_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) setCurrentExpiry(new Date().toISOString());
    setConfirmAction(null);
  }

  // ── Rename ────────────────────────────────────────────────
  async function handleRename() {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === title) {
      setEditing(false);
      setNewTitle(title);
      return;
    }
    const { error } = await supabase
      .from("resumes")
      .update({ title: trimmed })
      .eq("id", id);
    if (error) setNewTitle(title);
    setEditing(false);
    onRename();
  }

  // ── Slug save ─────────────────────────────────────────────
  async function handleSlugSave() {
    setSlugError(null);
    const sanitized = newSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!sanitized) {
      await supabase.from("resumes").update({ slug: null }).eq("id", id);
      setNewSlug("");
      setEditingSlug(false);
      onRename();
      return;
    }

    const { error } = await supabase
      .from("resumes")
      .update({ slug: sanitized })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        setSlugError("This slug is already taken.");
      } else {
        setSlugError("Failed to update slug.");
      }
      setNewSlug(slug ?? "");
    } else {
      setNewSlug(sanitized);
      setEditingSlug(false);
    }
    onRename();
  }

  // ── Copy link ─────────────────────────────────────────────
  const shareableId = slug || id;

  async function handleCopy() {
    const link = `${window.location.origin}/view/${shareableId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  // ── Delete ────────────────────────────────────────────────
  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      setDeleting(false);
      return;
    }
    setConfirmAction(null);
    onDelete();
  }

  const lastViewedLabel = lastViewed
    ? new Date(lastViewed).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Never";

  return (
    <div
      className="neo-panel-soft group relative flex flex-col overflow-visible bg-[var(--color-bg-card-solid)] transition-transform duration-150 hover:-translate-y-0.5"
    >
      {/* Card body */}
      <div
        className="flex flex-1 flex-col p-5 cursor-pointer"
        onClick={() => router.push(`/dashboard/resume/${id}`)}
      >
        {/* Header: Title + Status badge */}
        <div className="mb-4 flex items-start justify-between gap-2">
          {editing ? (
            <div
              className="flex flex-1 items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setEditing(false);
                    setNewTitle(title);
                  }
                }}
                className="flex-1 rounded-lg border px-2.5 py-1.5 text-sm font-semibold text-zinc-100 outline-none transition-colors focus:border-zinc-400"
                style={{
                  background: "var(--color-bg-input)",
                  border: "2px solid var(--color-border-main)",
                  color: "var(--color-text-primary)",
                }}
              />
              <button
                onClick={handleRename}
                className="rounded-lg p-1.5 text-[var(--color-success)] transition-colors hover:bg-[var(--color-success-bg)]"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setNewTitle(title);
                }}
                className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-1 items-center gap-1.5 group/title">
              <h3 className="truncate text-sm font-semibold leading-5 text-[var(--color-text-primary)]">
                {title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="shrink-0 rounded p-1 text-[var(--color-text-muted)] opacity-0 transition-all duration-150 hover:text-[var(--color-text-primary)] group-hover/title:opacity-100"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Status badge */}
          <div
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={
              isLinkDead
                ? {
                    background: "var(--color-error-bg)",
                    color: "var(--color-error)",
                    border: "2px solid var(--color-error)",
                  }
                : {
                    background: "var(--color-success-bg)",
                    color: "var(--color-success)",
                    border: "2px solid var(--color-success)",
                  }
            }
          >
            {isLinkDead ? "Expired" : "Active"}
          </div>
        </div>

        {/* Slug */}
        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
          {editingSlug ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-[var(--color-text-muted)]">/view/</span>
                <input
                  ref={slugInputRef}
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSlugSave();
                    if (e.key === "Escape") {
                      setEditingSlug(false);
                      setNewSlug(slug ?? "");
                      setSlugError(null);
                    }
                  }}
                  placeholder="my-resume"
                  className="flex-1 rounded border-2 border-[var(--color-border-main)] bg-[var(--color-bg-input)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--color-text-primary)] outline-none"
                />
                <button
                  onClick={handleSlugSave}
                  className="rounded p-0.5 text-[var(--color-success)] hover:bg-[var(--color-success-bg)]"
                >
                  <Check className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    setEditingSlug(false);
                    setNewSlug(slug ?? "");
                    setSlugError(null);
                  }}
                  className="rounded p-0.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {slugError && (
                <p className="text-[10px] text-[var(--color-error)]">{slugError}</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setEditingSlug(true)}
              className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <Link2 className="h-3 w-3" />
              {slug ? (
                <span className="truncate font-mono">/view/{slug}</span>
              ) : (
                <span className="italic">Set custom slug</span>
              )}
            </button>
          )}
        </div>

        {/* Stats grid */}
        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <div
            className="neo-panel-soft rounded-xl bg-[var(--color-bg-page)] p-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Views
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {totalViews}
            </p>
          </div>
          <div
            className="neo-panel-soft rounded-xl bg-[var(--color-bg-page)] p-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Last Seen
            </p>
            <p className="mt-1 text-xs font-medium leading-tight text-[var(--color-text-secondary)]">
              {lastViewedLabel}
            </p>
          </div>
        </div>

        {/* Expiry picker */}
        <div onClick={(e) => e.stopPropagation()} className="mb-1">
          <div className="relative" ref={expiryRef}>
            <button
              onClick={() => setExpiryOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 border-2 border-transparent px-1 py-0.5 text-[11px] font-semibold transition-colors hover:border-[var(--color-border-main)] hover:bg-[var(--color-bg-hover)] ${
                isLinkDead ? "text-[var(--color-error)]" : "text-[var(--color-text-muted)]"
              }`}
            >
              <Timer className="h-3 w-3" />
              {getExpiryLabel()}
            </button>

            {expiryOpen && (
              <div className="absolute left-0 top-full z-[80] mt-2 w-48 border-2 border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] shadow-[4px_4px_0_var(--color-border-main)]">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSetExpiry(opt.months)}
                    className="flex w-full items-center justify-between border-b border-[var(--color-grid)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)] transition-colors last:border-b-0 hover:bg-[var(--color-bg-hover)]"
                  >
                    <span>{opt.label}</span>
                    {opt.months === 0 && <span className="neo-label text-[var(--color-text-muted)]">No expiry</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Inline confirmation overlay ──────────────────────── */}
      {confirmAction && (
        <div
          className="animate-fade-in absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] p-6 text-center"
          style={{
            background: "color-mix(in oklab, var(--color-bg-card-solid) 96%, transparent)",
          }}
        >
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "var(--color-error-bg)",
              border: "2px solid var(--color-error)",
            }}
          >
            <AlertTriangle className="h-5 w-5 text-[var(--color-error)]" />
          </div>
          <p className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {confirmAction === "delete" ? "Delete Resume?" : "Kill Link?"}
          </p>
          <p className="mb-5 max-w-[220px] text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {confirmAction === "delete"
              ? "This will permanently delete this resume and all its analytics. This cannot be undone."
              : "Viewers will see an expiry page immediately. You won't be able to restore this link."}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--color-bg-page)] px-4 py-2 text-xs font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-hover)]"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction === "delete" ? handleDelete : handleKillLink}
              disabled={deleting}
              className="rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--color-error)] px-4 py-2 text-xs font-extrabold text-white transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              style={{
                boxShadow: "3px 3px 0 var(--color-border-main)",
              }}
            >
              {deleting
                ? "Deleting..."
                : confirmAction === "delete"
                ? "Delete"
                : "Kill Link"}
            </button>
          </div>
        </div>
      )}

      {/* ── Action bar ──────────────────────────────────────── */}
      <div
        className="flex items-center gap-1.5 px-4 pb-4 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Analytics */}
        <button
          type="button"
          onClick={() => router.push(`/dashboard/resume/${id}`)}
          className="flex items-center gap-1.5 rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--color-bg-page)] px-3 py-2 text-xs font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-hover)]"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Analytics
        </button>

        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-2 text-xs font-bold transition-colors duration-150"
          style={
            copied
              ? {
                  background: "var(--color-success-bg)",
                  borderColor: "var(--color-success)",
                  color: "var(--color-success)",
                }
              : {
                  background: "var(--color-bg-page)",
                  borderColor: "var(--color-border-main)",
                  color: "var(--color-text-primary)",
                }
          }
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy"}
        </button>

        {/* Kill link */}
        {!isLinkDead && (
          <button
            type="button"
            onClick={() => setConfirmAction("kill")}
            className="flex items-center gap-1 rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--color-bg-page)] px-2.5 py-2 text-xs font-bold text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-error)]"
            title="Kill Link"
          >
            <ShieldOff className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Delete */}
        <button
          type="button"
          onClick={() => setConfirmAction("delete")}
          disabled={deleting}
          className="flex items-center gap-1 rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--color-bg-page)] px-2.5 py-2 text-xs font-bold text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-error)] disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
