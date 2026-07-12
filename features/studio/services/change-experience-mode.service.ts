import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { ChangeExperienceModeInput } from "@/schemas/studio-orders";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Updates experience_mode on a draft experience.
 * Child-row auto-delete activates when migrations 017–019 exist (Sprint 08–09B).
 */
export async function changeExperienceMode(
  client: SupabaseClient,
  input: ChangeExperienceModeInput,
): Promise<ExperienceRow> {
  const experiencesRepo = new ExperiencesRepository(client);
  const existing = await experiencesRepo.findById(input.experienceId);

  if (!existing) {
    throw new NotFoundError("Experience not found");
  }

  if (existing.content_locked_at) {
    throw new ValidationError("Cannot change mode after publish");
  }

  if (existing.experience_mode === input.experienceMode) {
    return existing;
  }

  // TODO(Sprint 08+): delete incompatible child rows when quiz/match/envelope tables exist.

  const updated = await experiencesRepo.updateExperienceMode(
    input.experienceId,
    input.experienceMode,
  );

  return updated;
}
