import { createServerClient } from "@supabase/ssr";

/**
 * Supabase Admin client using the **service-role** key.
 *
 * ⚠️  NEVER expose this on the client. Use only in Route Handlers
 *     and Server Actions that need elevated privileges (e.g. writing
 *     analytics events on behalf of anonymous visitors).
 *
 * Usage:
 *   import { supabaseAdmin } from "@/lib/supabase-admin";
 *   await supabaseAdmin.from("analytics_events").insert({ ... });
 */
export const supabaseAdmin = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  },
);
