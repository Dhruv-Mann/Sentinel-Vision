import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * POST /api/track
 *
 * Called by the browser tracking hook to record analytics events.
 * Uses the service-role client so anonymous (unauthenticated) viewers
 * can log events without needing any RLS policies for anon.
 *
 * Body: { resume_id, event_type, device_type, duration_seconds }
 * Returns: { id } of the upserted analytics row.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resume_id, event_type, device_type, duration_seconds, event_id } =
      body;

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

    // Otherwise, this is the initial INSERT
    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .insert({
        resume_id,
        event_type,
        device_type: device_type ?? "unknown",
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
