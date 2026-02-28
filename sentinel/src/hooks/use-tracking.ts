"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

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

/**
 * Silent analytics tracking hook.
 *
 * - On mount: inserts a `view` event into `analytics_events`.
 * - Every 5 s: updates the same row, incrementing `duration_seconds` by 5.
 * - On unmount: clears the heartbeat interval.
 *
 * A ref guard ensures the INSERT fires only once per component lifecycle
 * (safe under React 18 Strict Mode double-mount in development).
 */
export function useTracking(resumeId: string) {
  // Holds the id of the analytics row we inserted
  const eventIdRef = useRef<string | null>(null);
  // Prevents double-fire in React 18 StrictMode
  const hasFiredRef = useRef(false);

  useEffect(() => {
    // Guard: only fire once per session mount
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    async function init() {
      // 1. Fire the initial "view" event
      const { data, error } = await supabase
        .from("analytics_events")
        .insert({
          resume_id: resumeId,
          event_type: "view" as const,
          device_type: getDeviceType(),
          duration_seconds: 0,
        })
        .select("id")
        .single();

      if (error || !data || cancelled) return;

      eventIdRef.current = data.id;

      // 2. Start a heartbeat that bumps duration_seconds every 5 s
      let elapsed = 0;
      intervalId = setInterval(async () => {
        elapsed += 5;
        if (!eventIdRef.current) return;

        await supabase
          .from("analytics_events")
          .update({ duration_seconds: elapsed })
          .eq("id", eventIdRef.current);
      }, 5_000);
    }

    init();

    // 3. Cleanup on unmount
    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [resumeId]);
}
