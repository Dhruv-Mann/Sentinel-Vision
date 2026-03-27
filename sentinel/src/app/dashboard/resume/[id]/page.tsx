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
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

/** Export analytics events as a CSV download */
function exportCSV(events: ViewEvent[], title: string) {
  const header = "Date,Location,Device,Browser,OS,Duration (s)\n";
  const rows = events
    .map((e) =>
      [
        new Date(e.timestamp).toISOString(),
        e.city && e.country ? `${e.city} ${e.country}` : "Unknown",
        e.device_type ?? "unknown",
        e.browser ?? "—",
        e.os ?? "—",
        e.duration_seconds,
      ].join(","),
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}_analytics.csv`;
  a.click();
  URL.revokeObjectURL(url);
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

  // ── Chart data: views per day ────────────────────────────
  const viewsByDay: Record<string, number> = {};
  events.forEach((e) => {
    const day = new Date(e.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    viewsByDay[day] = (viewsByDay[day] ?? 0) + 1;
  });
  const viewsOverTime = Object.entries(viewsByDay)
    .reverse()
    .map(([date, views]) => ({ date, views }));

  // ── Chart data: device pie ───────────────────────────────
  const devicePieData = Object.entries(deviceCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const DEVICE_COLORS = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ef4444"];

  // ── Chart data: browser pie ──────────────────────────────
  const browserPieData = Object.entries(browserCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const BROWSER_COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ef4444", "#eab308"];

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 pb-16" style={{ background: "var(--color-bg-page)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-zinc-800/60" />
          <div className="mb-2 h-7 w-64 animate-pulse rounded-lg bg-zinc-800/80" />
          <div className="mb-8 h-4 w-40 animate-pulse rounded bg-zinc-800/50" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl"
                style={{ background: "rgba(39,39,42,0.5)", border: "1px solid rgba(63,63,70,0.4)" }}
              />
            ))}
          </div>
          <div className="mt-8 h-64 animate-pulse rounded-2xl"
            style={{ background: "rgba(39,39,42,0.5)", border: "1px solid rgba(63,63,70,0.4)" }} />
        </div>
      </main>
    );
  }

  /* ── Main render ─────────────────────────────────────────── */
  return (
    <main className="min-h-screen px-6 pt-10 pb-16" style={{ background: "var(--color-bg-page)" }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            {resume?.title}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-sm text-zinc-600">
              Created {resume ? formatDate(resume.created_at) : ""}
            </p>
            {events.length > 0 && (
              <button
                onClick={() => exportCSV(events, resume?.title ?? "resume")}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all duration-150 hover:text-zinc-100"
                style={{
                  background: "rgba(39,39,42,0.6)",
                  border: "1px solid rgba(63,63,70,0.5)",
                }}
              >
                <Download className="h-3 w-3" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Eye />} label="Total Views" value={String(totalViews)} accent="#3b82f6" delay={0} />
          <StatCard icon={<Clock />} label="Avg. Duration" value={formatDuration(avgDuration)} accent="#10b981" delay={80} />
          <StatCard icon={<Globe />} label="Unique Locations" value={String(uniqueLocations)} accent="#8b5cf6" delay={160} />
          <StatCard
            icon={<Monitor />}
            label="Desktop / Mobile"
            value={`${deviceCounts["desktop"] ?? 0} / ${deviceCounts["mobile"] ?? 0}`}
            accent="#f59e0b"
            delay={240}
          />
        </div>

        {/* ── Charts ─────────────────────────────────────────── */}
        {totalViews > 0 && (
          <div className="mb-10 grid gap-5 lg:grid-cols-3">
            {/* Views over time – area chart */}
            <div
              className="lg:col-span-2 rounded-2xl p-5 animate-fade-up"
              style={{
                background: "rgba(18,18,20,0.9)",
                border: "1px solid rgba(63,63,70,0.5)",
              }}
            >
              <h3 className="mb-4 text-sm font-semibold text-zinc-200">
                Views Over Time
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={viewsOverTime}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#a1a1aa" }}
                    itemStyle={{ color: "#22c55e" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#viewsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Device & Browser donut charts */}
            <div className="flex flex-col gap-5">
              {/* Device donut */}
              <div
                className="rounded-2xl p-5 animate-fade-up stagger-2"
                style={{
                  background: "rgba(18,18,20,0.9)",
                  border: "1px solid rgba(63,63,70,0.5)",
                }}
              >
                <h3 className="mb-2 text-sm font-semibold text-zinc-200">
                  Devices
                </h3>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie
                      data={devicePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                      stroke="none"
                    >
                      {devicePieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-1 flex flex-wrap justify-center gap-3 text-[11px]">
                  {devicePieData.map((d, i) => (
                    <span key={d.name} className="flex items-center gap-1 capitalize text-zinc-400">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
                      />
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Browser donut */}
              <div
                className="rounded-2xl p-5 animate-fade-up stagger-3"
                style={{
                  background: "rgba(18,18,20,0.9)",
                  border: "1px solid rgba(63,63,70,0.5)",
                }}
              >
                <h3 className="mb-2 text-sm font-semibold text-zinc-200">
                  Browsers
                </h3>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie
                      data={browserPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                      stroke="none"
                    >
                      {browserPieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={BROWSER_COLORS[i % BROWSER_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-1 flex flex-wrap justify-center gap-3 text-[11px]">
                  {browserPieData.map((d, i) => (
                    <span key={d.name} className="flex items-center gap-1 text-zinc-400">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: BROWSER_COLORS[i % BROWSER_COLORS.length] }}
                      />
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown section */}
        <div className="mb-10 grid gap-5 lg:grid-cols-3">
          {/* Top Locations */}
          <BreakdownCard title="Top Locations" icon={<MapPin className="h-4 w-4 text-violet-400" />}>
            {topLocations.length === 0 ? (
              <p className="text-xs text-zinc-600">No location data yet</p>
            ) : (
              topLocations.map(([loc, count]) => (
                <BreakdownRow key={loc} label={loc} value={count} total={totalViews} color="#8b5cf6" />
              ))
            )}
          </BreakdownCard>

          {/* Browser breakdown */}
          <BreakdownCard title="Browsers" icon={<Globe className="h-4 w-4 text-blue-400" />}>
            {Object.entries(browserCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([browser, count]) => (
                <BreakdownRow key={browser} label={browser} value={count} total={totalViews} color="#3b82f6" />
              ))}
          </BreakdownCard>

          {/* Device breakdown */}
          <BreakdownCard title="Devices" icon={<Monitor className="h-4 w-4 text-orange-400" />}>
            {Object.entries(deviceCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([device, count]) => (
                <BreakdownRow key={device} label={device} value={count} total={totalViews} color="#f97316" />
              ))}
          </BreakdownCard>
        </div>

        {/* Views table */}
        <div
          className="overflow-hidden rounded-2xl animate-fade-up"
          style={{
            background: "rgba(18,18,20,0.9)",
            border: "1px solid rgba(63,63,70,0.5)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(63,63,70,0.4)" }}
          >
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">All Views</h2>
              <p className="text-[11px] text-zinc-600 mt-0.5">{totalViews} total view events</p>
            </div>
          </div>

          {events.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-zinc-600">
              No views yet. Share your resume link to start tracking.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr
                    className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600"
                    style={{ borderBottom: "1px solid rgba(63,63,70,0.4)" }}
                  >
                    <th className="px-5 py-3 font-semibold">When</th>
                    <th className="px-5 py-3 font-semibold">Location</th>
                    <th className="px-5 py-3 font-semibold">Device</th>
                    <th className="px-5 py-3 font-semibold">Browser / OS</th>
                    <th className="px-5 py-3 font-semibold text-right">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev, i) => (
                    <tr
                      key={ev.id}
                      className="text-sm transition-colors duration-100"
                      style={{
                        borderBottom: i < events.length - 1 ? "1px solid rgba(39,39,42,0.6)" : "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-xs text-zinc-400">
                        {formatDate(ev.timestamp)}
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-500">
                        {ev.city && ev.country ? `${ev.city}, ${ev.country}` : "Unknown"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs capitalize text-zinc-500">
                          {deviceIcon(ev.device_type)}
                          {ev.device_type ?? "unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-600">
                        {ev.browser ?? "—"} / {ev.os ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-xs font-semibold text-zinc-300">
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
  accent,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  delay: number;
}) {
  return (
    <div
      className="animate-fade-up relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: "rgba(18,18,20,0.9)",
        border: "1px solid rgba(63,63,70,0.5)",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-25 blur-xl"
        style={{ background: accent }}
      />
      <div
        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl"
        style={{
          background: `${accent}15`,
          border: `1px solid ${accent}25`,
          color: accent,
        }}
      >
        {icon}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-zinc-100">{value}</p>
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
    <div
      className="rounded-2xl p-5 animate-fade-up"
      style={{
        background: "rgba(18,18,20,0.9)",
        border: "1px solid rgba(63,63,70,0.5)",
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
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
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs capitalize text-zinc-400">{label}</span>
        <span className="text-xs text-zinc-600">
          {value} <span className="text-zinc-700">({pct}%)</span>
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ background: "rgba(63,63,70,0.4)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
