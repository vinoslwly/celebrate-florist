import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { isAdminEmailMatch } from "@/lib/auth/admin-email";

import { env } from "@/config/env";

import {
  PROXY_MAX_REQUESTS_PER_WINDOW,
  PROXY_RATE_LIMIT_WINDOW_MS,
} from "@/features/access/config/constants";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";

/**
 * Process-local only. On Vercel this Map is not shared across isolates, so it
 * is not the production abuse control. Memory Code locking is enforced in the
 * database. This counter is a best-effort secondary signal.
 */
const experienceRouteHits = new Map<
  string,
  { count: number; resetAt: number }
>();

function isExperienceRouteRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = experienceRouteHits.get(ip);

  if (!entry || now >= entry.resetAt) {
    experienceRouteHits.set(ip, {
      count: 1,
      resetAt: now + PROXY_RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  entry.count += 1;
  return entry.count > PROXY_MAX_REQUESTS_PER_WINDOW;
}

/**
 * Returns the configured admin email for Edge/proxy, or null when unset.
 * Fail-closed: a missing ADMIN_EMAIL treats every authenticated user as
 * non-admin — Studio stays locked until deploy env is configured.
 *
 * Must be set in the deployment platform for Edge/proxy (e.g. Vercel env
 * vars for Production and Preview). Cannot use config/env.server.ts here
 * because proxy runs on the Edge runtime (server-only guard).
 */
function getProxyAdminEmail(): string | null {
  const value = process.env.ADMIN_EMAIL?.trim();
  return value && value.length > 0 ? value : null;
}

/**
 * Session refresh and Studio route protection.
 *
 * Landing pages under (public) are excluded from the matcher — they stay
 * cacheable and never pay for an Auth round trip.
 *
 * Rate limiting extension point (future sprint): insert IP/email throttle
 * at the start of the Studio branch below, before session checks.
 */
function isThemeLabPath(pathname: string): boolean {
  return pathname === "/theme-lab" || pathname.startsWith("/theme-lab/");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === "production" && isThemeLabPath(pathname)) {
    return new NextResponse(null, { status: 404, statusText: "Not Found" });
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/e/")) {
    const forwarded = request.headers.get("x-forwarded-for");
    const forwardedLast = forwarded?.split(",").at(-1)?.trim();
    const ip =
      request.headers.get("x-real-ip")?.trim() || forwardedLast || "unknown";

    if (isExperienceRouteRateLimited(ip)) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  if (
    pathname === STUDIO_ROUTES.home ||
    pathname.startsWith(`${STUDIO_ROUTES.home}/`)
  ) {
    const isLoginPage = pathname === STUDIO_ROUTES.login;
    const adminEmail = getProxyAdminEmail();

    if (!user) {
      if (!isLoginPage) {
        return NextResponse.redirect(new URL(STUDIO_ROUTES.login, request.url));
      }
      return response;
    }

    const isAdmin =
      adminEmail !== null && isAdminEmailMatch(user.email ?? "", adminEmail);

    if (!isAdmin) {
      await supabase.auth.signOut();
      // No query params — client always shows the same generic login error.
      return NextResponse.redirect(new URL(STUDIO_ROUTES.login, request.url));
    }

    if (isLoginPage) {
      return NextResponse.redirect(new URL(STUDIO_ROUTES.home, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/studio",
    "/studio/:path*",
    "/e/:path*",
    "/theme-lab",
    "/theme-lab/:path*",
  ],
};
