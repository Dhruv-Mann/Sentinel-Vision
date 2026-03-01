import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend, SENDER_EMAIL } from "@/lib/resend";

/* ── rate limiter ─────────────────────────────────────────── */

/**
 * In-memory sliding-window rate limiter.
 *
 * Limits: max 6 NEW view events per IP per 60-second window.
 * Heartbeat UPDATEs (event_id present) are NOT rate-limited — they
 * only update an existing row and fire every 5 s by design.
 *
 * Note: On Vercel serverless, each cold-start gets its own Map, so
 * distributed attackers could bypass this. For a portfolio project
 * this is sufficient. For production scale, use Vercel KV / Upstash.
 */
const RATE_WINDOW_MS = 60_000; // 60 seconds
const RATE_MAX_HITS = 6;       // max new-view events per window per IP

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/** Periodically purge expired entries to avoid memory leaks */
function pruneRateMap() {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}
// Prune every 2 minutes
if (typeof setInterval !== "undefined") {
  setInterval(pruneRateMap, 120_000);
}

/**
 * Returns true if the request should be BLOCKED.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request or window expired → start fresh
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_MAX_HITS;
}

/* ── helpers ──────────────────────────────────────────────── */

/** Parse browser name from User-Agent */
function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
  if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/firefox\//i.test(ua)) return "Firefox";
  return "Other";
}

/** Parse OS name from User-Agent */
function parseOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/macintosh|mac os/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

/** Fetch geo data from ip-api.com (free, no key required, 45 rpm) */
async function fetchGeo(ip: string): Promise<{
  city: string | null;
  country: string | null;
}> {
  try {
    // Skip localhost / private IPs
    if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168")) {
      return { city: "Localhost", country: "Local" };
    }
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,country`,
      { signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return { city: null, country: null };
    const data = await res.json();
    if (data.status === "success") {
      return { city: data.city ?? null, country: data.country ?? null };
    }
    return { city: null, country: null };
  } catch {
    return { city: null, country: null };
  }
}

/* ── route handler ────────────────────────────────────────── */

/**
 * POST /api/track
 *
 * Called by the browser tracking hook to record analytics events.
 * Uses the service-role client so anonymous (unauthenticated) viewers
 * can log events without needing any RLS policies for anon.
 *
 * Body: { resume_id, event_type, device_type, browser, os, duration_seconds, event_id }
 * Returns: { id } of the upserted analytics row.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      resume_id,
      event_type,
      device_type,
      browser,
      os,
      duration_seconds,
      event_id,
    } = body;

    if (!resume_id || !event_type) {
      return NextResponse.json(
        { error: "resume_id and event_type are required" },
        { status: 400 },
      );
    }

    // If event_id is provided, this is a heartbeat UPDATE
    if (event_id) {
      const { error } = await supabaseAdmin
        .from("analytics_events")
        .update({ duration_seconds })
        .eq("id", event_id);

      if (error) {
        console.error("Track update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ id: event_id });
    }

    // ── Initial INSERT ─────────────────────────────────────
    // Grab the viewer's IP from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "127.0.0.1";

    // ── Rate limit check (new events only) ─────────────────
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    // ── Validate resume exists before inserting ────────────
    const { data: resumeExists } = await supabaseAdmin
      .from("resumes")
      .select("id")
      .eq("id", resume_id)
      .single();

    if (!resumeExists) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 },
      );
    }

    // Geo lookup (non-blocking for speed — we await but with timeout)
    const geo = await fetchGeo(ip);

    // Parse UA server-side as a fallback if client didn't send browser/os
    const ua = request.headers.get("user-agent") ?? "";
    const finalBrowser = browser || parseBrowser(ua);
    const finalOS = os || parseOS(ua);

    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .insert({
        resume_id,
        event_type,
        device_type: device_type ?? "unknown",
        browser: finalBrowser,
        os: finalOS,
        ip_address: ip,
        city: geo.city,
        country: geo.country,
        duration_seconds: duration_seconds ?? 0,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Track insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ── Email notification (fire-and-forget) ───────────────
    if (resend && event_type === "view") {
      sendViewNotification(resume_id, geo.city, geo.country, finalBrowser, finalOS).catch(
        (err) => console.error("Notification error:", err),
      );
    }

    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}

/**
 * Send a "Someone viewed your resume" email to the resume owner.
 * Only sends if the resume has notify_on_view = true and
 * the RESEND_API_KEY env var is configured.
 */
async function sendViewNotification(
  resumeId: string,
  city: string | null,
  country: string | null,
  browser: string,
  os: string,
) {
  if (!resend) return;

  // Get resume + owner info
  const { data: resume } = await supabaseAdmin
    .from("resumes")
    .select("title, notify_on_view, user_id")
    .eq("id", resumeId)
    .single();

  if (!resume || !resume.notify_on_view) return;

  // Get owner email from auth
  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(resume.user_id);
  if (!user?.email) return;

  const location =
    city && country && city !== "Localhost"
      ? `${city}, ${country}`
      : "Unknown location";

  await resend.emails.send({
    from: SENDER_EMAIL,
    to: user.email,
    subject: `New view on "${resume.title}" \u2013 Sentinel`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fafafa; border-radius: 12px;">
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #18181b;">Someone viewed your resume</h2>
        <p style="margin: 0 0 20px; font-size: 14px; color: #71717a;">${resume.title}</p>
        <table style="width: 100%; font-size: 14px; color: #3f3f46;">
          <tr><td style="padding: 6px 0; color: #71717a;">Location</td><td style="padding: 6px 0; text-align: right; font-weight: 500;">${location}</td></tr>
          <tr><td style="padding: 6px 0; color: #71717a;">Browser</td><td style="padding: 6px 0; text-align: right; font-weight: 500;">${browser}</td></tr>
          <tr><td style="padding: 6px 0; color: #71717a;">OS</td><td style="padding: 6px 0; text-align: right; font-weight: 500;">${os}</td></tr>
        </table>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e4e4e7;" />
        <p style="margin: 0; font-size: 12px; color: #a1a1aa;">Sent by Sentinel \u2013 Resume Analytics</p>
      </div>
    `,
  });
}
