"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ResumeCard from "@/components/dashboard/resume-card";
import UploadButton from "@/components/dashboard/upload-button";

interface ResumeWithStats {
  id: string;
  title: string;
  totalViews: number;
  lastViewed: string | null;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch resumes + aggregated view stats ────────────────
  const fetchResumes = useCallback(async () => {
    setLoading(true);

    // 1. Get resumes owned by the current user (RLS handles scoping)
    const { data: rows, error } = await supabase
      .from("resumes")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });

    if (error || !rows) {
      console.error("Fetch resumes error:", error);
      setLoading(false);
      return;
    }

    // 2. For each resume, get total view count + last viewed timestamp
    const withStats: ResumeWithStats[] = await Promise.all(
      rows.map(async (r) => {
        // Count view events
        const { count } = await supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("resume_id", r.id)
          .eq("event_type", "view");

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
          totalViews: count ?? 0,
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

  // ── Loading skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
            <div className="h-10 w-36 animate-pulse rounded-lg bg-zinc-800" />
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
    <main className="min-h-screen bg-zinc-950 px-6 py-12">
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
                totalViews={r.totalViews}
                lastViewed={r.lastViewed}
                onDelete={fetchResumes}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
