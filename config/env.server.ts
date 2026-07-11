import "server-only";

import { z } from "zod";

/**
 * Centralized, validated access to SERVER-ONLY environment variables.
 *
 * The `server-only` import above turns any accidental import of this file
 * from a "use client" component into a build-time error. Never remove it.
 *
 * Sprint 04: ADMIN_EMAIL is required. Privileged keys remain optional until
 * the feature that needs them runs — callers must validate at use-time
 * (see createAdminClient).
 *
 * Optional secrets resolve to `undefined` when missing or blank — never to
 * an empty string. Direct property access therefore cannot silently produce
 * an invalid SDK credential; use has*() guards or get*() accessors.
 */

const optionalSecret = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
  });

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  MEMORY_KEY_PEPPER: optionalSecret,
  IP_HASH_PEPPER: optionalSecret,
  ADMIN_EMAIL: z
    .string()
    .min(1, "ADMIN_EMAIL is required")
    .email("ADMIN_EMAIL must be a valid email address"),
});

function formatZodIssues(issues: z.ZodIssue[]): string {
  return issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
}

function parseServerEnv() {
  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    MEMORY_KEY_PEPPER: process.env.MEMORY_KEY_PEPPER,
    IP_HASH_PEPPER: process.env.IP_HASH_PEPPER,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment variables:\n${formatZodIssues(parsed.error.issues)}`,
    );
  }

  return parsed.data;
}

export const serverEnv = parseServerEnv();

/** True when service_role client can be created. */
export function hasServiceRoleKey(): boolean {
  return serverEnv.SUPABASE_SERVICE_ROLE_KEY !== undefined;
}

/** True when Memory Key hashing can run. Required from Experience sprint onward. */
export function hasMemoryKeyPepper(): boolean {
  return serverEnv.MEMORY_KEY_PEPPER !== undefined;
}

/** True when IP addresses can be hashed for rate limiting. */
export function hasIpHashPepper(): boolean {
  return serverEnv.IP_HASH_PEPPER !== undefined;
}

/**
 * Returns the service_role key or throws. Only call after hasServiceRoleKey()
 * or from createAdminClient — never pass serverEnv.SUPABASE_SERVICE_ROLE_KEY
 * directly to the Supabase SDK.
 */
export function getServiceRoleKey(): string {
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (key === undefined) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Set it in .env.local for privileged server operations.",
    );
  }
  return key;
}
