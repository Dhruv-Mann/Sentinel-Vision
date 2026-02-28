import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

/**
 * GET /auth/callback
 *
 * Supabase redirects here after email confirmation (sign-up) or
 * OAuth flows. The `code` query-param is exchanged for a session
 * cookie so subsequent server-side requests are authenticated.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, send the user back to login
  return NextResponse.redirect(`${origin}/login`);
}
