/**
 * Supabase client entry points safe for universal import.
 *
 * Import the specific client for your context — do not use a single
 * createClient() that picks a key at runtime.
 *
 * Privileged admin client: import createAdminClient directly from
 * @/lib/supabase/admin (server-only). It is intentionally excluded
 * from this barrel to prevent accidental Client Component imports.
 */
export { createClient as createBrowserClient } from "@/lib/supabase/client";
export { createClient as createServerClient } from "@/lib/supabase/server";
