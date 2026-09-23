import "server-only";

import { securityLogger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";

import { hasServiceRoleKey, serverEnv } from "@/config/env.server";

import { AppSettingsRepository } from "@/features/studio/repositories/app-settings.repository";

/** app_settings key read by public.is_studio_admin(). Never commit the value. */
export const STUDIO_ADMIN_EMAIL_SETTING_KEY = "admin_email";

let syncedAdminEmail: string | null = null;

/**
 * Writes ADMIN_EMAIL into app_settings with the service_role client.
 * RLS treats that row as the only authenticated identity allowed to use Studio.
 * Failure is logged and swallowed so a deploy of this code does not lock Studio
 * before the RLS migration is applied. After that migration, Studio stays closed
 * until this upsert succeeds.
 */
export async function ensureStudioAdminEmail(userId: string): Promise<void> {
  const email = serverEnv.ADMIN_EMAIL.trim().toLowerCase();
  if (syncedAdminEmail === email) {
    return;
  }

  if (!hasServiceRoleKey()) {
    securityLogger.error(
      "Studio admin identity was not synced because the privileged database client is unavailable",
    );
    return;
  }

  try {
    const admin = createAdminClient();
    const repo = new AppSettingsRepository(admin);
    await repo.upsertByKey({
      key: STUDIO_ADMIN_EMAIL_SETTING_KEY,
      value: email,
      updatedBy: userId,
    });
    syncedAdminEmail = email;
  } catch (error) {
    securityLogger.error("Studio admin identity sync failed", {
      cause: error instanceof Error ? error.name : "unknown",
    });
  }
}
