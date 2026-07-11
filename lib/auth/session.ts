import "server-only";

import { isAdminEmailMatch } from "@/lib/auth/admin-email";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { securityLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import { serverEnv } from "@/config/env.server";

import type { User } from "@supabase/supabase-js";

/**
 * Returns the authenticated Supabase user from the current session cookie.
 * Returns null when no valid session exists — does not throw.
 */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Returns the session user or throws UnauthorizedError.
 */
export async function requireSessionUser(): Promise<User> {
  const user = await getSessionUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

/**
 * Checks whether an email matches the configured admin address.
 * Comparison is case-insensitive — email providers treat local parts
 * as case-sensitive but founders may vary casing when signing up.
 */
export function isAdminEmail(email: string): boolean {
  return isAdminEmailMatch(email, serverEnv.ADMIN_EMAIL);
}

/**
 * Returns the authenticated admin user or throws.
 * Single-admin model: authenticated + email matches ADMIN_EMAIL.
 */
export async function requireAdminUser(): Promise<User> {
  const user = await requireSessionUser();

  if (!isAdminEmail(user.email ?? "")) {
    securityLogger.warn("Non-admin attempted privileged access", {
      userId: user.id,
    });
    throw new ForbiddenError("Admin access required");
  }

  return user;
}
