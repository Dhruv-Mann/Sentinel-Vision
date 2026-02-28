import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in **Client Components** (browser).
 *
 * Usage:
 *   import { supabase } from "@/lib/supabase";
 *   const { data } = await supabase.from("resumes").select("*");
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
