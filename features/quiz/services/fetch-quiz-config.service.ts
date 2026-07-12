import "server-only";

import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import { assertQuizExperienceOwnership } from "@/features/quiz/services/quiz-experience-guards";
import type { ExperienceQuiz } from "@/features/quiz/types";

import type { FetchQuizByExperienceInput } from "@/schemas/studio-quiz";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchQuizConfig(
  client: SupabaseClient,
  input: FetchQuizByExperienceInput,
): Promise<ExperienceQuiz> {
  await assertQuizExperienceOwnership(
    client,
    input.orderId,
    input.experienceId,
  );

  const repo = new ExperienceQuizRepository(client);
  return repo.findCompleteByExperienceId(input.experienceId);
}
