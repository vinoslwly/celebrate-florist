import "server-only";

import { createHash } from "node:crypto";

import { UnauthorizedError } from "@/lib/errors";
import { securityLogger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";

import { hasServiceRoleKey, serverEnv } from "@/config/env.server";

import { SecurityEventsRepository } from "@/features/access/repositories/security-events.repository";
import { STUDIO_LOGIN_FAILURE_MESSAGE } from "@/features/studio/config/auth-messages";

/** Temporary window. A locked email can try again after this elapses. */
const STUDIO_LOGIN_WINDOW_MS = 15 * 60 * 1000;

/** Failed attempts for one email hash inside the window. */
const STUDIO_LOGIN_MAX_FAILURES = 8;

function hashLoginEmail(email: string): string {
  const pepper = serverEnv.IP_HASH_PEPPER ?? "studio-login";
  return createHash("sha256")
    .update(`${pepper}:${email.trim().toLowerCase()}`)
    .digest("hex");
}

/**
 * Application-level login throttle backed by security_events.
 * This is not a password-strength control. Supabase Auth (Dashboard)
 * remains responsible for minimum length and leaked-password protection.
 * The same client message is used for every refusal.
 */
export async function assertStudioLoginAllowed(email: string): Promise<string> {
  const emailHash = hashLoginEmail(email);

  if (!hasServiceRoleKey()) {
    securityLogger.warn("Studio login throttle is unavailable");
    return emailHash;
  }

  try {
    const sinceIso = new Date(
      Date.now() - STUDIO_LOGIN_WINDOW_MS,
    ).toISOString();
    const admin = createAdminClient();
    const repo = new SecurityEventsRepository(admin);
    const failedCount = await repo.countEventsSince({
      eventType: "admin_login_failed",
      sinceIso,
      metadataContains: { email_hash: emailHash },
    });

    if (failedCount >= STUDIO_LOGIN_MAX_FAILURES) {
      await recordStudioLoginFailure(emailHash);
      throw new UnauthorizedError(STUDIO_LOGIN_FAILURE_MESSAGE);
    }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    securityLogger.error("Studio login throttle check failed");
  }

  return emailHash;
}

export async function recordStudioLoginFailure(
  emailHash: string,
): Promise<void> {
  if (!hasServiceRoleKey()) {
    return;
  }

  try {
    const admin = createAdminClient();
    const repo = new SecurityEventsRepository(admin);
    await repo.insertEvent({
      eventType: "admin_login_failed",
      metadata: { email_hash: emailHash },
    });
  } catch {
    securityLogger.error("Studio login failure was not recorded");
  }
}
