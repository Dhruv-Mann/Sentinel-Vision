"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ResumeCard from "@/components/dashboard/resume-card";
import UploadButton from "@/components/dashboard/upload-button";
import { Eye, Clock, FileText, TrendingUp } from "lucide-react";

interface ResumeWithStats {
  id: string;
  title: string;
  slug: string | null;
  totalViews: number;
  avgDuration: number;
  lastViewed: string | null;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch resumes + aggregated view stats ────────────────
  const fetchResumes = useCallback(async () => {
    setLoading(true);

    const { data: rows, error } = await supabase
      .from("resumes")
      .select("id, title, slug, created_at")
      .order("created_at", { ascending: false });

    if (error || !rows) {
      console.error("Fetch resumes error:", error);
      setLoading(false);
      return;
    }

    const withStats: ResumeWithStats[] = await Promise.all(
      rows.map(async (r) => {
        // Count view events
        const { count } = await supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("resume_id", r.id)
          .eq("event_type", "view");

        // Get events for avg duration
        const { data: evts } = await supabase
          .from("analytics_events")
          .select("duration_seconds")
          .eq("resume_id", r.id)
          .eq("event_type", "view");

        const totalDur = evts?.reduce((s, e) => s + (e.duration_seconds ?? 0), 0) ?? 0;
        const avg = evts && evts.length > 0 ? Math.round(totalDur / evts.length) : 0;

        // Last viewed timestamp
        const { data: latest } = await supabase
          .from("analytics_events")
          .select("timestamp")
          .eq("resume_id", r.id)
          .eq("event_type", "view")
          .order("timestamp", { ascending: false })
          .limit(1)
          .single();

        return {
          id: r.id,
          title: r.title,
          slug: r.slug ?? null,
          totalViews: count ?? 0,
          avgDuration: avg,
          lastViewed: latest?.timestamp ?? null,
        };
      }),
    );

    setResumes(withStats);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // ── Aggregated summary stats ─────────────────────────────
  const totalViews = resumes.reduce((s, r) => s + r.totalViews, 0);
  const totalResumes = resumes.length;
  const allDurations = resumes.filter((r) => r.totalViews > 0);
  const globalAvgDuration =
    allDurations.length > 0
      ? Math.round(
          allDurations.reduce((s, r) => s + r.avgDuration, 0) /
            allDurations.length,
        )
      : 0;
  const mostViewed = resumes.length > 0
    ? resumes.reduce((best, r) => (r.totalViews > best.totalViews ? r : best))
    : null;

  // ── Loading skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg-page)] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
            <div className="h-10 w-36 animate-pulse rounded-lg bg-zinc-800" />
          </div>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60"
              />
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── Main render ──────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--bg-page)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your resumes and track who&apos;s viewing them.
            </p>
          </div>
          <UploadButton onUploadComplete={fetchResumes} />
        </div>

        {/* ── Summary stat cards ────────────────────────────── */}
        {resumes.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={<Eye className="h-5 w-5 text-green-400" />}
              label="Total Views"
              value={String(totalViews)}
            />
            <SummaryCard
              icon={<FileText className="h-5 w-5 text-blue-400" />}
              label="Resumes"
              value={String(totalResumes)}
            />
            <SummaryCard
              icon={<Clock className="h-5 w-5 text-purple-400" />}
              label="Avg. View Duration"
              value={formatDuration(globalAvgDuration)}
            />
            <SummaryCard
              icon={<TrendingUp className="h-5 w-5 text-orange-400" />}
              label="Most Viewed"
              value={
                mostViewed && mostViewed.totalViews > 0
                  ? `${mostViewed.title.slice(0, 18)}${mostViewed.title.length > 18 ? "…" : ""} (${mostViewed.totalViews})`
                  : "—"
              }
            />
          </div>
        )}

        {/* Empty state */}
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 py-24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4 h-12 w-12 text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mb-6 text-zinc-500">
              No resumes yet. Upload your first one to start tracking.
            </p>
            <UploadButton onUploadComplete={fetchResumes} />
          </div>
        ) : (
          /* Resume grid */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r) => (
              <ResumeCard
                key={r.id}
                id={r.id}
                title={r.title}
                slug={r.slug}
                totalViews={r.totalViews}
                lastViewed={r.lastViewed}
                onDelete={fetchResumes}
                onRename={fetchResumes}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* ── Summary card sub-component ─────────────────────────────── */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className="truncate text-lg font-bold text-zinc-100">{value}</p>
      </div>
    </div>
  );
}
