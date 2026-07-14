import "server-only";

import { ValidationError } from "@/lib/errors";

import {
  evaluateAccessGate,
  type AccessRequestContext,
} from "@/features/access/services/access-gate.service";
import { buildConnectionRewardPayload } from "@/features/experience/services/build-connection-reward-payload.service";
import type { ConnectionQuizSubmitResult } from "@/features/experience/types/connection-gate.types";
import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import { gradeQuizAnswers } from "@/features/quiz/services/grade-quiz-answers.service";

import type { SubmitQuizAnswersInput } from "@/schemas/quiz-recipient";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Stateless recipient quiz grading (OD-5) with Connection reward payload (Sprint 08R).
 * Requires granted access gate. Answers are not persisted.
 * CF-1: any successful submit returns reward regardless of score.
 */
export async function submitQuizAnswers(
  client: SupabaseClient,
  input: SubmitQuizAnswersInput,
  context: AccessRequestContext,
): Promise<ConnectionQuizSubmitResult> {
  const gate = await evaluateAccessGate(client, input.experienceToken, context);

  if (gate.status !== "granted") {
    throw new ValidationError(
      "Complete access verification before submitting the quiz.",
    );
  }

  if (gate.experience.experience_mode !== "connection") {
    throw new ValidationError("This experience does not include a quiz.");
  }

  const quizRepo = new ExperienceQuizRepository(client);
  const quiz = await quizRepo.findCompleteByExperienceId(gate.experience.id);

  const result = gradeQuizAnswers(quiz.questions, quiz.bands, input.answers);
  const reward = await buildConnectionRewardPayload(gate.experience);

  return { result, reward };
}
