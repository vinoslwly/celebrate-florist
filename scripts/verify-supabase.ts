/**
 * Sprint 00 connectivity check — confirms the configured Supabase project
 * is reachable and the anon key is valid. This intentionally does NOT
 * query any table; no schema is assumed to exist yet.
 *
 * Usage: npm run verify:supabase
 */
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
    process.exit(1);
  }

  const client = createClient(url, anonKey);

  // auth.getSession() performs no network round-trip on its own reliably
  // across SDK versions, so we hit the lightweight public health endpoint
  // instead — a 200 here proves the URL + anon key pair is valid and the
  // project is reachable.
  const response = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: anonKey },
  });

  if (!response.ok) {
    console.error(
      `Supabase health check failed: HTTP ${response.status} ${response.statusText}`,
    );
    process.exit(1);
  }

  const body = await response.json();
  console.log("Supabase connectivity verified.");
  console.log(`  Project URL: ${url}`);
  console.log(`  Health response: ${JSON.stringify(body)}`);

  // Confirm the JS client itself initializes cleanly with these credentials.
  const { error } = await client.auth.getSession();
  if (error) {
    console.error(
      "Supabase client initialization reported an error:",
      error.message,
    );
    process.exit(1);
  }

  console.log("Supabase JS client initialized successfully.");
}

main().catch((error) => {
  console.error("Unexpected error during Supabase verification:", error);
  process.exit(1);
});
