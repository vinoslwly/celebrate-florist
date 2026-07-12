import "server-only";

import { GRACE_PERIOD_MS } from "@/features/access/config/constants";

/**
 * Grace window is computed dynamically from first_opened_at + 24 hours.
 * No grace_expires_at column — founder decision final.
 */
export function isWithinGracePeriod(firstOpenedAt: string | null): boolean {
  if (!firstOpenedAt) {
    return true;
  }

  const graceEndsAt = new Date(firstOpenedAt).getTime() + GRACE_PERIOD_MS;
  return Date.now() < graceEndsAt;
}

export function getGraceEndsAt(firstOpenedAt: string): Date {
  return new Date(new Date(firstOpenedAt).getTime() + GRACE_PERIOD_MS);
}
