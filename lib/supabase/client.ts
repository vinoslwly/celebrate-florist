import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/config/env";

/**
 * Browser-side Supabase client. Uses only the public anon key — this
 * client is subject to Row Level Security and must never be granted
 * elevated privileges. Create a new instance per component render scope
 * (do not hoist to a module-level singleton) per @supabase/ssr guidance.
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
