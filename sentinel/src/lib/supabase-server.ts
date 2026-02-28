import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use in **Server Components**, Route Handlers,
 * and Server Actions (anything running on the server).
 *
 * Must be called inside an async context so `cookies()` works.
 *
 * Usage:
 *   import { createSupabaseServer } from "@/lib/supabase-server";
 *   const supabase = await createSupabaseServer();
 *   const { data } = await supabase.from("resumes").select("*");
 */
export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method is called from a Server Component where
            // cookies cannot be set. This can safely be ignored when the
            // middleware is refreshing the session.
          }
        },
      },
    },
  );
}
