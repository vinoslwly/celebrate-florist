import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ExperienceRow } from "@/types/database";

import type {
  ConnectionGateExperience,
  ConnectionGatePayload,
} from "@/features/experience/types/connection-gate.types";
import { fetchRecipientQuiz } from "@/features/quiz/services/fetch-recipient-quiz.service";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

export function toConnectionGateExperience(
  experience: ExperienceRow,
): ConnectionGateExperience {
  return {
    id: experience.id,
    greeting_name: experience.greeting_name,
    theme_id: experience.theme_id,
    experience_mode: "connection",
    quiz_title: experience.quiz_title,
  };
}

/**
 * Phase A Connection payload — header/theme + quiz only (CF-4).
 * Call only after access gate is granted.
 */
export async function fetchConnectionGatePayload(
  experienceId: string,
): Promise<ConnectionGatePayload> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const themesRepo = new ThemesRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  if (experience.experience_mode !== "connection") {
    throw new ValidationError("This experience is not Connection mode.");
  }

  const theme = await themesRepo.findById(experience.theme_id);
  if (!theme) {
    throw new NotFoundError("Experience not found");
  }

  const quiz = await fetchRecipientQuiz(experienceId);

  return {
    experience: toConnectionGateExperience(experience),
    theme,
    quiz,
  };
}
