import "server-only";

import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import {
  assertConnectionMode,
  assertQuizExperienceEditable,
  assertQuizExperienceOwnership,
} from "@/features/quiz/services/quiz-experience-guards";
import { validateQuizConfig } from "@/features/quiz/services/validate-quiz-config.service";
import type { ExperienceQuiz } from "@/features/quiz/types";

import type { SaveQuizConfigInput } from "@/schemas/studio-quiz";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function saveQuizConfig(
  client: SupabaseClient,
  input: SaveQuizConfigInput,
): Promise<ExperienceQuiz> {
  const experience = await assertQuizExperienceOwnership(
    client,
    input.orderId,
    input.experienceId,
  );

  assertQuizExperienceEditable(experience);
  assertConnectionMode(experience);

  validateQuizConfig({
    questions: input.questions,
    bands: input.bands,
  });

  const repo = new ExperienceQuizRepository(client);
  return repo.replaceAllForExperience(input.experienceId, {
    questions: input.questions,
    bands: input.bands,
  });
}
