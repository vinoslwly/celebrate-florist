import "server-only";

import { createClient } from "@supabase/supabase-js";

import { ConfigError } from "@/lib/errors";

import { env } from "@/config/env";
import { getServiceRoleKey, hasServiceRoleKey } from "@/config/env.server";

/**
 * Privileged Supabase client using the service_role key.
 * Bypasses RLS — use ONLY in server-side code after application-level
 * gates (Access Code, admin auth) have passed.
 *
 * Never import this file from Client Components.
 * Import directly from this module — not from @/lib/supabase.
 */
export function createAdminClient() {
  if (!hasServiceRoleKey()) {
    throw new ConfigError(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Set it in .env.local for privileged server operations.",
    );
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
