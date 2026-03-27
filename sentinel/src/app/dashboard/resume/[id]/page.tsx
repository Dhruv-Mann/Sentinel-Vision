"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

function exportCSV(events: ViewEvent[], title: string) {
  const header = "Date,Location,Device,Browser,OS,Duration (s)\n";
  const rows = events
    .map((e) =>
      [
        new Date(e.timestamp).toISOString(),
        e.city && e.country ? `${e.city} ${e.country}` : "Unknown",
        e.device_type ?? "unknown",
        e.browser ?? "-",
        e.os ?? "-",
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

const TOOLTIP_STYLE = {
  background: "var(--color-bg-card-solid)",
  border: "2px solid var(--color-border-main)",
  borderRadius: 10,
  color: "var(--color-text-primary)",
  fontSize: 12,
};

export default function ResumeAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [events, setEvents] = useState<ViewEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

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

  const totalViews = events.length;
  const totalDuration = events.reduce((sum, e) => sum + e.duration_seconds, 0);
  const avgDuration = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;
  const uniqueLocations = new Set(
    events.filter((e) => e.country).map((e) => `${e.city}, ${e.country}`),
  ).size;

  const deviceCounts: Record<string, number> = {};
  events.forEach((e) => {
    const key = e.device_type ?? "unknown";
    deviceCounts[key] = (deviceCounts[key] ?? 0) + 1;
  });

  const browserCounts: Record<string, number> = {};
  events.forEach((e) => {
    const key = e.browser ?? "unknown";
    browserCounts[key] = (browserCounts[key] ?? 0) + 1;
  });

  const locationCounts: Record<string, number> = {};
  events.forEach((e) => {
    if (e.city && e.country) {
      const key = `${e.city}, ${e.country}`;
      locationCounts[key] = (locationCounts[key] ?? 0) + 1;
    }
  });

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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

  const devicePieData = Object.entries(deviceCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const browserPieData = Object.entries(browserCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const DEVICE_COLORS = ["#0096ff", "#0f8a4a", "#b36a00", "#c52a2a", "#5c5c5c"];
  const BROWSER_COLORS = ["#0f8a4a", "#0096ff", "#b36a00", "#c52a2a", "#5c5c5c", "#1b67a5"];

  if (loading) {
    return (
      <main className="page-frame section-gap">
        <section className="neo-panel p-5 sm:p-6">
          <div className="h-4 w-28 animate-pulse bg-[var(--color-bg-hover)]" />
          <div className="mt-3 h-8 w-72 animate-pulse bg-[var(--color-bg-hover)]" />
          <div className="mt-2 h-4 w-48 animate-pulse bg-[var(--color-bg-hover)]" />
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="neo-panel-soft h-28 animate-pulse bg-[var(--color-bg-card-solid)]"
            />
          ))}
        </section>

        <section className="mt-6 neo-panel-soft h-80 animate-pulse bg-[var(--color-bg-card-solid)]" />
      </main>
    );
  }

  return (
    <main className="page-frame section-gap">
      <section className="neo-panel animate-fade-up p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 border-2 border-[var(--color-border-main)] bg-[var(--color-bg-card-solid)] px-2.5 py-1.5 text-xs font-bold hover:bg-[var(--color-bg-hover)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Link>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              {resume?.title}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Created {resume ? formatDate(resume.created_at) : ""}
            </p>
          </div>

          {events.length > 0 && (
            <button
              type="button"
              onClick={() => exportCSV(events, resume?.title ?? "resume")}
              className="inline-flex items-center gap-2 border-2 border-[var(--color-border-main)] bg-[var(--color-accent)] px-3 py-2 text-xs font-extrabold text-white shadow-[3px_3px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Eye />} label="Total Views" value={String(totalViews)} accent="#0096ff" delay={0} />
        <StatCard
          icon={<Clock />}
          label="Avg. Duration"
          value={formatDuration(avgDuration)}
          accent="#0f8a4a"
          delay={80}
        />
        <StatCard
          icon={<Globe />}
          label="Unique Locations"
          value={String(uniqueLocations)}
          accent="#b36a00"
          delay={160}
        />
        <StatCard
          icon={<Monitor />}
          label="Desktop / Mobile"
          value={`${deviceCounts.desktop ?? 0} / ${deviceCounts.mobile ?? 0}`}
          accent="#c52a2a"
          delay={240}
        />
      </section>

      {totalViews > 0 && (
        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="neo-panel-soft animate-fade-up p-5 lg:col-span-2">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Views Over Time
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={viewsOverTime}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.36} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-text-secondary)" }}
                  itemStyle={{ color: "var(--color-accent)" }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#viewsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-5">
            <div className="neo-panel-soft animate-fade-up p-5 stagger-2">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Devices
              </h2>
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
                      <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-1 flex flex-wrap justify-center gap-3 text-[11px]">
                {devicePieData.map((item, i) => (
                  <span
                    key={item.name}
                    className="flex items-center gap-1 capitalize text-[var(--color-text-secondary)]"
                  >
                    <span
                      className="inline-block h-2 w-2"
                      style={{ background: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
                    />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="neo-panel-soft animate-fade-up p-5 stagger-3">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Browsers
              </h2>
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
                      <Cell key={i} fill={BROWSER_COLORS[i % BROWSER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-1 flex flex-wrap justify-center gap-3 text-[11px]">
                {browserPieData.map((item, i) => (
                  <span key={item.name} className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                    <span
                      className="inline-block h-2 w-2"
                      style={{ background: BROWSER_COLORS[i % BROWSER_COLORS.length] }}
                    />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <BreakdownCard
          title="Top Locations"
          icon={<MapPin className="h-4 w-4" style={{ color: "var(--color-info)" }} />}
        >
          {topLocations.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)]">No location data yet</p>
          ) : (
            topLocations.map(([label, value]) => (
              <BreakdownRow key={label} label={label} value={value} total={totalViews} color="var(--color-info)" />
            ))
          )}
        </BreakdownCard>

        <BreakdownCard
          title="Browsers"
          icon={<Globe className="h-4 w-4" style={{ color: "var(--color-accent)" }} />}
        >
          {Object.entries(browserCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([label, value]) => (
              <BreakdownRow
                key={label}
                label={label}
                value={value}
                total={totalViews}
                color="var(--color-accent)"
              />
            ))}
        </BreakdownCard>

        <BreakdownCard
          title="Devices"
          icon={<Monitor className="h-4 w-4" style={{ color: "var(--color-warning)" }} />}
        >
          {Object.entries(deviceCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([label, value]) => (
              <BreakdownRow
                key={label}
                label={label}
                value={value}
                total={totalViews}
                color="var(--color-warning)"
              />
            ))}
        </BreakdownCard>
      </section>

      <section className="mt-6 neo-panel-soft animate-fade-up overflow-hidden">
        <div className="border-b-2 border-[var(--color-border-main)] px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            All Views
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{totalViews} total view events</p>
        </div>

        {events.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">
            No views yet. Share your resume link to start tracking.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[var(--color-border-main)] text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Device</th>
                  <th className="px-5 py-3">Browser / OS</th>
                  <th className="px-5 py-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <tr
                    key={event.id}
                    className="text-sm transition-colors hover:bg-[var(--color-bg-hover)]"
                    style={{ borderBottom: i < events.length - 1 ? "1px solid var(--color-grid)" : "none" }}
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-[var(--color-text-secondary)]">
                      {formatDate(event.timestamp)}
                    </td>
                    <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">
                      {event.city && event.country ? `${event.city}, ${event.country}` : "Unknown"}
                    </td>
                    <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">
                      <span className="inline-flex items-center gap-1.5 capitalize">
                        {deviceIcon(event.device_type)}
                        {event.device_type ?? "unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">
                      {event.browser ?? "-"} / {event.os ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-xs font-bold text-[var(--color-text-primary)]">
                      {formatDuration(event.duration_seconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

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
    <article className="neo-panel-soft animate-fade-up p-4" style={{ animationDelay: `${delay}ms` }}>
      <div
        className="mb-3 inline-flex h-9 w-9 items-center justify-center border-2"
        style={{ borderColor: accent, color: accent }}
      >
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">{value}</p>
    </article>
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
    <article className="neo-panel-soft animate-fade-up p-5">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-extrabold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </article>
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
        <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {value} ({pct}%)
        </span>
      </div>
      <div className="h-1.5 w-full bg-[var(--color-bg-hover)]">
        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
