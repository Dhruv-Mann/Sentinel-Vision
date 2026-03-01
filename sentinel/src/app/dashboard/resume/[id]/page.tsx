"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Globe,
  Monitor,
  Clock,
  Eye,
  Smartphone,
  Tablet,
  MapPin,
} from "lucide-react";

/* ── types ─────────────────────────────────────────────────── */

interface Resume {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}

interface ViewEvent {
  id: string;
  event_type: string;
  ip_address: string | null;
  city: string | null;
  country: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  duration_seconds: number;
  timestamp: string;
}

/* ── helpers ───────────────────────────────────────────────── */

function deviceIcon(type: string | null) {
  switch (type) {
    case "mobile":
      return <Smartphone className="h-4 w-4" />;
    case "tablet":
      return <Tablet className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── component ─────────────────────────────────────────────── */

export default function ResumeAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [events, setEvents] = useState<ViewEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch resume
    const { data: r, error: rErr } = await supabase
      .from("resumes")
      .select("id, title, file_url, created_at")
      .eq("id", id)
      .single();

    if (rErr || !r) {
      router.push("/dashboard");
      return;
    }
    setResume(r);

    // Fetch all analytics events for this resume
    const { data: ev } = await supabase
      .from("analytics_events")
      .select(
        "id, event_type, ip_address, city, country, device_type, browser, os, duration_seconds, timestamp",
      )
      .eq("resume_id", id)
      .eq("event_type", "view")
      .order("timestamp", { ascending: false });

    setEvents(ev ?? []);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Stats ────────────────────────────────────────────────
  const totalViews = events.length;
  const totalDuration = events.reduce((s, e) => s + e.duration_seconds, 0);
  const avgDuration =
    totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;
  const uniqueLocations = new Set(
    events.filter((e) => e.country).map((e) => `${e.city}, ${e.country}`),
  ).size;

  // Device breakdown
  const deviceCounts: Record<string, number> = {};
  events.forEach((e) => {
    const d = e.device_type ?? "unknown";
    deviceCounts[d] = (deviceCounts[d] ?? 0) + 1;
  });

  // Browser breakdown
  const browserCounts: Record<string, number> = {};
  events.forEach((e) => {
    const b = e.browser ?? "unknown";
    browserCounts[b] = (browserCounts[b] ?? 0) + 1;
  });

  // Top locations
  const locationCounts: Record<string, number> = {};
  events.forEach((e) => {
    if (e.city && e.country) {
      const loc = `${e.city}, ${e.country}`;
      locationCounts[loc] = (locationCounts[loc] ?? 0) + 1;
    }
  });
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60"
              />
            ))}
          </div>
          <div className="mt-8 h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60" />
        </div>
      </main>
    );
  }

  /* ── Main render ─────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            {resume?.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Created {resume ? formatDate(resume.created_at) : ""}
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Eye className="h-5 w-5 text-green-400" />}
            label="Total Views"
            value={String(totalViews)}
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-blue-400" />}
            label="Avg. Duration"
            value={formatDuration(avgDuration)}
          />
          <StatCard
            icon={<Globe className="h-5 w-5 text-purple-400" />}
            label="Unique Locations"
            value={String(uniqueLocations)}
          />
          <StatCard
            icon={<Monitor className="h-5 w-5 text-orange-400" />}
            label="Desktop / Mobile"
            value={`${deviceCounts["desktop"] ?? 0} / ${deviceCounts["mobile"] ?? 0}`}
          />
        </div>

        {/* Breakdown section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Top Locations */}
          <BreakdownCard title="Top Locations" icon={<MapPin className="h-4 w-4 text-purple-400" />}>
            {topLocations.length === 0 ? (
              <p className="text-sm text-zinc-600">No location data yet</p>
            ) : (
              topLocations.map(([loc, count]) => (
                <BreakdownRow key={loc} label={loc} value={count} total={totalViews} color="bg-purple-500" />
              ))
            )}
          </BreakdownCard>

          {/* Browser breakdown */}
          <BreakdownCard title="Browsers" icon={<Globe className="h-4 w-4 text-blue-400" />}>
            {Object.entries(browserCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([browser, count]) => (
                <BreakdownRow key={browser} label={browser} value={count} total={totalViews} color="bg-blue-500" />
              ))}
          </BreakdownCard>

          {/* Device breakdown */}
          <BreakdownCard title="Devices" icon={<Monitor className="h-4 w-4 text-orange-400" />}>
            {Object.entries(deviceCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([device, count]) => (
                <BreakdownRow key={device} label={device} value={count} total={totalViews} color="bg-orange-500" />
              ))}
          </BreakdownCard>
        </div>

        {/* Views table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
          <div className="border-b border-zinc-800 px-5 py-3">
            <h2 className="text-sm font-semibold text-zinc-200">
              All Views ({totalViews})
            </h2>
          </div>

          {events.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-zinc-600">
              No views yet. Share your resume link to start tracking.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-5 py-3 font-medium">When</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Device</th>
                    <th className="px-5 py-3 font-medium">Browser / OS</th>
                    <th className="px-5 py-3 font-medium text-right">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr
                      key={ev.id}
                      className="border-b border-zinc-800/50 transition hover:bg-zinc-800/30"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-zinc-300">
                        {formatDate(ev.timestamp)}
                      </td>
                      <td className="px-5 py-3 text-zinc-400">
                        {ev.city && ev.country
                          ? `${ev.city}, ${ev.country}`
                          : "Unknown"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-zinc-400">
                          {deviceIcon(ev.device_type)}
                          {ev.device_type ?? "unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400">
                        {ev.browser ?? "—"} / {ev.os ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-green-400">
                        {formatDuration(ev.duration_seconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ── Reusable sub-components ───────────────────────────────── */

function StatCard({
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
      <div>
        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className="text-lg font-bold text-zinc-100">{value}</p>
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-zinc-300 capitalize">{label}</span>
        <span className="text-zinc-500">
          {value} ({pct}%)
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
