import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
