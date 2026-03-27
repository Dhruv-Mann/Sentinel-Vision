"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, Eye, FileText, TrendingUp, Upload } from "lucide-react";
import ResumeCard from "@/components/dashboard/resume-card";
import UploadButton from "@/components/dashboard/upload-button";
import { supabase } from "@/lib/supabase";

interface ResumeWithStats {
  id: string;
  title: string;
  slug: string | null;
  expiresAt: string | null;
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

  const fetchResumes = useCallback(async () => {
    setLoading(true);

    const { data: rows, error } = await supabase
      .from("resumes")
      .select("id, title, slug, expires_at, created_at")
      .order("created_at", { ascending: false });

    if (error || !rows) {
      console.error("Fetch resumes error:", error);
      setLoading(false);
      return;
    }

    const withStats: ResumeWithStats[] = await Promise.all(
      rows.map(async (r) => {
        const { count } = await supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("resume_id", r.id)
          .eq("event_type", "view");

        const { data: evts } = await supabase
          .from("analytics_events")
          .select("duration_seconds")
          .eq("resume_id", r.id)
          .eq("event_type", "view");

        const totalDur = evts?.reduce((s, e) => s + (e.duration_seconds ?? 0), 0) ?? 0;
        const avg = evts && evts.length > 0 ? Math.round(totalDur / evts.length) : 0;

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
          expiresAt: r.expires_at ?? null,
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

  const totalViews = resumes.reduce((sum, resume) => sum + resume.totalViews, 0);
  const totalResumes = resumes.length;
  const viewedResumes = resumes.filter((resume) => resume.totalViews > 0);
  const avgDuration =
    viewedResumes.length > 0
      ? Math.round(
          viewedResumes.reduce((sum, resume) => sum + resume.avgDuration, 0) /
            viewedResumes.length,
        )
      : 0;
  const topResume =
    resumes.length > 0
      ? resumes.reduce((best, item) => (item.totalViews > best.totalViews ? item : best))
      : null;

  if (loading) {
    return (
      <main className="page-frame pb-10 pt-6">
        <section className="neo-panel p-5 sm:p-6">
          <div className="h-3 w-24 animate-pulse bg-[var(--color-bg-hover)]" />
          <div className="mt-3 h-10 w-56 animate-pulse bg-[var(--color-bg-hover)]" />
          <div className="mt-2 h-4 w-80 max-w-full animate-pulse bg-[var(--color-bg-hover)]" />
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="neo-panel-soft h-28 animate-pulse bg-[var(--color-bg-card-solid)]" />
          ))}
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="neo-panel-soft h-56 animate-pulse bg-[var(--color-bg-card-solid)]" />
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="page-frame pb-10 pt-6">
      <section className="neo-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="neo-label text-[var(--color-text-muted)]">workspace</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)] sm:text-base">
              Upload resumes, share links, and check engagement without extra noise.
            </p>
          </div>
          <UploadButton onUploadComplete={fetchResumes} />
        </div>
      </section>

      {resumes.length > 0 && (
        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Eye} label="Total views" value={String(totalViews)} />
          <MetricCard icon={FileText} label="Resumes" value={String(totalResumes)} />
          <MetricCard icon={Clock} label="Avg. duration" value={formatDuration(avgDuration)} />
          <MetricCard
            icon={TrendingUp}
            label="Top resume"
            value={topResume && topResume.totalViews > 0 ? topResume.title : "-"}
          />
        </section>
      )}

      {resumes.length === 0 ? (
        <section className="neo-panel mt-5 p-8 text-center sm:p-10">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-bg-page)]">
            <Upload className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">No resumes yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
            Upload your first PDF to create a share link and start tracking views.
          </p>
          <div className="mt-6 flex justify-center">
            <UploadButton onUploadComplete={fetchResumes} />
          </div>
        </section>
      ) : (
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="neo-label text-[var(--color-text-muted)]">your resumes</p>
            <span className="neo-panel-soft px-2 py-1 text-xs font-bold">{resumes.length}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                id={resume.id}
                title={resume.title}
                slug={resume.slug}
                expiresAt={resume.expiresAt}
                totalViews={resume.totalViews}
                lastViewed={resume.lastViewed}
                onDelete={fetchResumes}
                onRename={fetchResumes}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <article className="neo-panel-soft bg-[var(--color-bg-card-solid)] p-4">
      <span className="inline-flex h-9 w-9 items-center justify-center border-2 border-[var(--color-border-main)] bg-[var(--color-bg-page)]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 truncate text-xl font-extrabold tracking-tight">{value}</p>
    </article>
  );
}
