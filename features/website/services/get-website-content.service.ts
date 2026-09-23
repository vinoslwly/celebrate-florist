import "server-only";

import { cache } from "react";

import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";

import { hasServiceRoleKey } from "@/config/env.server";

import { AppSettingsRepository } from "@/features/studio/repositories/app-settings.repository";
import { WEBSITE_SETTINGS_KEY } from "@/features/website/config/defaults";
import { mergeWebsiteContent } from "@/features/website/config/merge";
import { unsafeStoredHrefFields } from "@/features/website/config/safe-href";
import type { WebsiteContent } from "@/features/website/config/types";

export const getWebsiteContent = cache(async (): Promise<WebsiteContent> => {
  const fallback = mergeWebsiteContent({});
  if (!hasServiceRoleKey()) {
    return fallback;
  }

  try {
    const admin = createAdminClient();
    const repo = new AppSettingsRepository(admin);
    const row = await repo.findByKey(WEBSITE_SETTINGS_KEY);
    if (!row) {
      return fallback;
    }
    try {
      const stored = JSON.parse(row.value) as unknown;
      const unsafeFields = unsafeStoredHrefFields(stored);
      if (unsafeFields.length > 0) {
        logger.warn("Stored website link was not rendered", {
          fields: unsafeFields,
        });
      }
      return mergeWebsiteContent(stored) ?? fallback;
    } catch {
      return fallback;
    }
  } catch (error) {
    logger.error("Failed to load website settings", {
      cause: error instanceof Error ? error.message : undefined,
    });
    return fallback;
  }
});
