import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

export async function recordFirstOpened(experienceId: string): Promise<void> {
  const admin = createAdminClient();
  const repo = new ExperiencesRepository(admin);
  await repo.recordFirstOpened(experienceId);
}
