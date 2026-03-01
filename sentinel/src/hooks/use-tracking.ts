"use client";

import { useEffect, useRef } from "react";

/**
 * Detect a coarse device type from the User-Agent string.
 */
function getDeviceType(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua))
    return "mobile";
  return "desktop";
}

/** Parse browser name from User-Agent (client-side). */
function getBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
  if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/firefox\//i.test(ua)) return "Firefox";
  return "Other";
}

/** Parse OS from User-Agent (client-side). */
function getOS(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/macintosh|mac os/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

/**
 * Silent analytics tracking hook.
 *
 * - On mount: POSTs to /api/track to insert a `view` event.
 * - Every 5 s: POSTs a heartbeat to update `duration_seconds`.
 * - On unmount: clears the heartbeat interval.
 *
 * Uses a server-side API route (which uses the service-role key) so
 * anonymous/unauthenticated viewers don't hit RLS permission errors.
 *
 * A ref guard ensures the INSERT fires only once per component lifecycle
 * (safe under React 18 Strict Mode double-mount in development).
 */
export function useTracking(resumeId: string) {
  const eventIdRef = useRef<string | null>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    async function init() {
      try {
        // 1. Fire the initial "view" event via the API route
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume_id: resumeId,
            event_type: "view",
            device_type: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            duration_seconds: 0,
          }),
        });

        if (!res.ok || cancelled) return;

        const { id } = await res.json();
        eventIdRef.current = id;

        // 2. Heartbeat: bump duration_seconds every 5 s
        let elapsed = 0;
        intervalId = setInterval(async () => {
          elapsed += 5;
          if (!eventIdRef.current) return;

          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_id: eventIdRef.current,
              resume_id: resumeId,
              event_type: "view",
              duration_seconds: elapsed,
            }),
          });
        }, 5_000);
      } catch (err) {
        console.error("Tracking error:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [resumeId]);
}
