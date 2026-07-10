import "server-only";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { env } from "@/config/env";

/**
 * Server-side Supabase client for use in Server Components, Server
 * Actions, and Route Handlers. Uses the public anon key and the caller's
 * session cookie — RLS still applies. This is NOT the privileged client;
 * see `lib/supabase/admin.ts` (introduced when Studio needs elevated
 * writes) for the service-role client.
 *
 * Server Components can only *read* cookies. Writing a cookie from a
 * Server Component throws — the try/catch below lets middleware handle
 * session refresh instead, per Supabase's official Next.js guidance.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — safe to ignore because
            // middleware is responsible for refreshing the session cookie.
          }
        },
      },
    },
  );
}
