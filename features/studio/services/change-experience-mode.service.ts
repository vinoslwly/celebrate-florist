import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { ThemesRepository } from "@/lib/repositories/themes.repository";

import type { ExperienceRow } from "@/types/database";

import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import { assertExperienceModeAllowedForTheme } from "@/features/studio/config/theme-mode-matrix";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { ExperienceEnvelopesRepository } from "@/features/treasures/repositories/experience-envelopes.repository";

import type { ChangeExperienceModeInput } from "@/schemas/studio-orders";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Updates experience_mode on a draft experience.
 * Deletes incompatible mode child data when leaving Connection or Memories.
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

  const themesRepo = new ThemesRepository(client);
  const theme = await themesRepo.findById(existing.theme_id);
  if (!theme) {
    throw new NotFoundError("Theme not found");
  }
  assertExperienceModeAllowedForTheme(theme.slug, input.experienceMode);

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
      finalUnlockMessage: existing.final_unlock_message,
      endingMessage: existing.ending_message,
    });
  }

  if (
    existing.experience_mode === "memories" &&
    input.experienceMode !== "memories"
  ) {
    const matchRepo = new ExperienceMatchRepository(client);
    await matchRepo.deleteAllByExperienceId(input.experienceId);

    await experiencesRepo.updateDraft(input.experienceId, {
      greetingName: existing.greeting_name,
      closingName: existing.closing_name,
      letterContent: existing.letter_content,
      letterClosing: existing.letter_closing,
      quizTitle: existing.quiz_title,
      finalUnlockMessage: null,
      endingMessage: existing.ending_message,
    });
  }

  if (
    existing.experience_mode === "treasures" &&
    input.experienceMode !== "treasures"
  ) {
    const envelopesRepo = new ExperienceEnvelopesRepository(client);
    await envelopesRepo.deleteAllByExperienceId(input.experienceId);
  }

  const updated = await experiencesRepo.updateExperienceMode(
    input.experienceId,
    input.experienceMode,
  );

  return updated;
}
