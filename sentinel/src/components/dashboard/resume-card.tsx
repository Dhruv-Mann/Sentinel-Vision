"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BarChart3 } from "lucide-react";

interface ResumeCardProps {
  id: string;
  title: string;
  totalViews: number;
  lastViewed: string | null; // ISO date or null
  /** Called after a successful delete so the parent can refresh. */
  onDelete: () => void;
}

export default function ResumeCard({
  id,
  title,
  totalViews,
  lastViewed,
  onDelete,
}: ResumeCardProps) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // ── Copy shareable link ──────────────────────────────────
  async function handleCopy() {
    const link = `${window.location.origin}/view/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for insecure contexts
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
      <h3 className="mb-4 truncate text-base font-semibold text-zinc-100">
        {title}
      </h3>

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
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-green-500/40 hover:text-green-400"
        >
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
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
