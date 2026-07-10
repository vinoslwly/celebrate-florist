import "server-only";

import { z } from "zod";

/**
 * Centralized, validated access to SERVER-ONLY environment variables.
 *
 * The `server-only` import above turns any accidental import of this file
 * from a "use client" component into a build-time error. Never remove it.
 *
 * Both fields are optional at Sprint 00 because no privileged Studio
 * mutation or Memory Key verification exists yet. Later sprints that add
 * those features must tighten this schema to required fields — a missing
 * secret should fail the build, not fail silently at 2am in production.
 */

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  MEMORY_KEY_PEPPER: z.string().optional().default(""),
});

function parseServerEnv() {
  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    MEMORY_KEY_PEPPER: process.env.MEMORY_KEY_PEPPER,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment variables:\n${parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`,
    );
  }

  return parsed.data;
}

export const serverEnv = parseServerEnv();
