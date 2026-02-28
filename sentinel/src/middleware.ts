import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware – runs on every matched request before the page renders.
 *
 * Rules:
 *  1. /dashboard (and sub-routes) → redirect to /login if unauthenticated.
 *  2. /login                      → redirect to /dashboard if already logged in.
 *  3. /view/[id]                  → always PUBLIC (recruiters must not be blocked).
 *  4. Everything else             → pass through, refresh session cookie.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Forward Set-Cookie headers to the browser via the response
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({ request });
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh the session (important – keeps cookies alive)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rule 1 – protect /dashboard
  if (pathname.startsWith("/dashboard") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Rule 2 – bounce logged-in users away from /login
  if (pathname === "/login" && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  // Rule 3 – /view/* is always public (no check needed, falls through)

  return response;
}

/**
 * Only run middleware on routes that need auth checks.
 * Excludes static assets, images, favicon, and the public /view route
 * is intentionally included but handled as a pass-through above.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     *  - _next/static (static files)
     *  - _next/image  (image optimization)
     *  - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
