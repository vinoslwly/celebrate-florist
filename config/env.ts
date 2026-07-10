import { z } from "zod";

/**
 * Centralized, validated access to PUBLIC environment variables.
 *
 * Rule: nothing in this codebase reads `process.env.NEXT_PUBLIC_*` directly
 * outside this file. Import `env` instead. This is safe to import from
 * both Server and Client Components — the schema only ever lists
 * NEXT_PUBLIC_* variables, so it can never leak a secret by construction.
 *
 * Server-only secrets live in `config/env.server.ts`, which is guarded by
 * the `server-only` package so importing it from a Client Component fails
 * the build instead of failing silently at runtime.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

function parsePublicEnv() {
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid public environment variables:\n${parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`,
    );
  }

  return parsed.data;
}

export const env = parsePublicEnv();
