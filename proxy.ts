import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { env } from "@/config/env";

/**
 * Runs only on routes that can plausibly need a session — see `matcher`
 * below. Named `proxy` (not `middleware`) per Next.js 16's renamed file
 * convention — same runtime behavior, new name.
 *
 * Today this does exactly one thing: refresh the Supabase session cookie
 * before it expires. `lib/supabase/server.ts` cannot write cookies from a
 * Server Component — this is the one place in the request lifecycle that
 * can, which is why `@supabase/ssr`'s own docs require this file to exist
 * even before any login page does. Skipping it now would mean the first
 * real auth sprint has to debug silently-expiring sessions instead of
 * building features.
 *
 * There is no route protection yet — Celebrate has no authenticated
 * routes to protect (Studio Dashboard auth is a future sprint). When it
 * arrives, add the redirect-if-unauthenticated check after
 * `supabase.auth.getUser()` below; do not build it speculatively now.
 *
 * Rate limiting has the same shape: this is the correct place to add it
 * later (e.g. before the session refresh, keyed on `request.ip` / a
 * header), but no limits are defined yet, so none are implemented here.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // getUser() (not getSession()) because it revalidates against the
  // Supabase Auth server instead of trusting an unverified local cookie —
  // the one call in this file that must not be "optimized" away.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Opt-in, not opt-out. Only routes from the approved Phase 05
     * folder structure that can ever carry a session are listed —
     * (studio) and (experience). (public) marketing pages are never
     * matched, by omission, so they stay fully edge-cacheable and
     * never pay for a Supabase Auth round trip they have no use for.
     *
     * Neither route exists yet, so this currently matches nothing —
     * that is correct, not a bug. It starts working the moment Sprint
     * adds app/(studio)/studio/ or app/(experience)/e/[token]/; no
     * change needed here when that happens, only when a *new* route
     * group is added that also needs a session.
     */
    "/studio/:path*",
    "/e/:path*",
  ],
};
