import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

import { AppSettingsRepository } from "@/features/studio/repositories/app-settings.repository";
import { WEBSITE_SETTINGS_KEY } from "@/features/website/config/defaults";
import { mergeWebsiteContent } from "@/features/website/config/merge";
import type { WebsiteContent } from "@/features/website/config/types";

import type { WebsiteContentInput } from "@/schemas/studio-website";

export async function saveWebsiteContent(
  input: WebsiteContentInput,
  updatedBy: string | null,
): Promise<WebsiteContent> {
  const content = mergeWebsiteContent(input);
  const admin = createAdminClient();
  const repo = new AppSettingsRepository(admin);
  await repo.upsertByKey({
    key: WEBSITE_SETTINGS_KEY,
    value: JSON.stringify(content),
    updatedBy,
  });
  return content;
}
