"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BarChart3, Pencil, Check, X, Link2, Copy } from "lucide-react";

interface ResumeCardProps {
  id: string;
  title: string;
  slug: string | null;
  totalViews: number;
  lastViewed: string | null;
  onDelete: () => void;
  onRename: () => void;
}

export default function ResumeCard({
  id,
  title,
  slug,
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

  // ── Rename resume ────────────────────────────────────────
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

    if (error) {
      console.error("Rename error:", error);
      setNewTitle(title);
    }

    setEditing(false);
    onRename();
  }

  // ── Save slug ────────────────────────────────────────────
  async function handleSlugSave() {
    const sanitized = newSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!sanitized) {
      // Clear slug
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
        alert("This slug is already taken. Try a different one.");
      } else {
        console.error("Slug error:", error);
      }
      setNewSlug(slug ?? "");
    } else {
      setNewSlug(sanitized);
    }

    setEditingSlug(false);
    onRename();
  }

  // ── Copy shareable link ──────────────────────────────────
  const shareableId = slug || id;

  async function handleCopy() {
    const link = `${window.location.origin}/view/${shareableId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("Copy this link:", link);
    }
  }

  // ── Delete resume ────────────────────────────────────────
  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeleting(true);
    const { error } = await supabase.from("resumes").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete resume.");
      setDeleting(false);
      return;
    }

    onDelete();
  }

  // ── Format "Last viewed" date ────────────────────────────
  const lastViewedLabel = lastViewed
    ? new Date(lastViewed).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  return (
    <div
      className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 transition hover:border-zinc-700 hover:shadow-lg hover:shadow-green-500/5 cursor-pointer"
      onClick={() => router.push(`/dashboard/resume/${id}`)}
    >
      {/* Title */}
      {editing ? (
        <div className="mb-4 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") { setEditing(false); setNewTitle(title); }
            }}
            className="flex-1 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-green-500"
          />
          <button onClick={handleRename} className="rounded p-1 text-green-400 hover:bg-green-500/10">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={() => { setEditing(false); setNewTitle(title); }} className="rounded p-1 text-zinc-400 hover:bg-zinc-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mb-2 flex items-center gap-2 group/title">
          <h3 className="truncate text-base font-semibold text-zinc-100">{title}</h3>
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="shrink-0 rounded p-1 text-zinc-500 opacity-0 transition hover:bg-zinc-800 hover:text-zinc-300 group-hover/title:opacity-100"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Slug */}
      <div className="mb-4" onClick={(e) => e.stopPropagation()}>
        {editingSlug ? (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-zinc-600">/view/</span>
            <input
              ref={slugInputRef}
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSlugSave();
                if (e.key === "Escape") { setEditingSlug(false); setNewSlug(slug ?? ""); }
              }}
              placeholder="my-resume"
              className="flex-1 rounded border border-zinc-600 bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-300 outline-none focus:border-green-500"
            />
            <button onClick={handleSlugSave} className="rounded p-0.5 text-green-400 hover:bg-green-500/10">
              <Check className="h-3 w-3" />
            </button>
            <button onClick={() => { setEditingSlug(false); setNewSlug(slug ?? ""); }} className="rounded p-0.5 text-zinc-400 hover:bg-zinc-700">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingSlug(true)}
            className="flex items-center gap-1.5 text-[11px] text-zinc-500 transition hover:text-green-400"
          >
            <Link2 className="h-3 w-3" />
            {slug ? (
              <span className="truncate">/view/{slug}</span>
            ) : (
              <span className="italic">Set custom slug</span>
            )}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Total Views
          </p>
          <p className="mt-0.5 text-xl font-bold text-green-400">
            {totalViews}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Last Viewed
          </p>
          <p className="mt-0.5 text-sm font-medium text-zinc-300">
            {lastViewedLabel}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/resume/${id}`);
          }}
          className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-green-400 transition hover:border-green-500/40 hover:bg-green-500/10"
        >
          <BarChart3 className="h-3 w-3" />
          Analytics
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-green-500/40 hover:text-green-400"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copied!" : "Copy Link"}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={deleting}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 disabled:opacity-50"
        >
          {deleting ? "\u2026" : "Delete"}
        </button>
      </div>
    </div>
  );
}
