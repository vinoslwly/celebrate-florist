import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { ChangeExperienceModeInput } from "@/schemas/studio-orders";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Updates experience_mode on a draft experience.
 * Deletes Connection quiz data when leaving Connection mode.
 */
export async function changeExperienceMode(
  client: SupabaseClient,
  input: ChangeExperienceModeInput,
): Promise<ExperienceRow> {
  const experiencesRepo = new ExperiencesRepository(client);
  const existing = await experiencesRepo.findById(input.experienceId);

  if (!existing || existing.order_id !== input.orderId) {
    throw new NotFoundError("Experience not found");
  }

  if (existing.content_locked_at) {
    throw new ValidationError("Cannot change mode after publish");
  }

  if (existing.experience_mode === input.experienceMode) {
    return existing;
  }

  if (
    existing.experience_mode === "connection" &&
    input.experienceMode !== "connection"
  ) {
    const quizRepo = new ExperienceQuizRepository(client);
    await quizRepo.deleteAllByExperienceId(input.experienceId);

    await experiencesRepo.updateDraft(input.experienceId, {
      greetingName: existing.greeting_name,
      closingName: existing.closing_name,
      letterContent: existing.letter_content,
      letterClosing: existing.letter_closing,
      quizTitle: null,
    });
  }

  const updated = await experiencesRepo.updateExperienceMode(
    input.experienceId,
    input.experienceMode,
  );

  return updated;
}
