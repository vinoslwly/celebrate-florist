import "server-only";

import { ValidationError } from "@/lib/errors";

import {
  evaluateAccessGate,
  type AccessRequestContext,
} from "@/features/access/services/access-gate.service";
import { buildMemoriesRewardPayload } from "@/features/experience/services/build-memories-reward-payload.service";
import type { MemoriesSubmitResult } from "@/features/experience/types/memories-gate.types";
import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import { gradeMatchAnswers } from "@/features/match/services/grade-match.service";

import type { SubmitMatchAnswersInput } from "@/schemas/match-recipient";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Stateless recipient match grading (batch submit, A-2) with Memories reward payload.
 * Requires granted access gate. Answers are not persisted.
 * FD-M5: any valid submit returns reward regardless of score.
 */
export async function submitMatchAnswers(
  client: SupabaseClient,
  input: SubmitMatchAnswersInput,
  context: AccessRequestContext,
): Promise<MemoriesSubmitResult> {
  const gate = await evaluateAccessGate(client, input.experienceToken, context);

  if (gate.status !== "granted") {
    throw new ValidationError(
      "Complete access verification before submitting matches.",
    );
  }

  if (gate.experience.experience_mode !== "memories") {
    throw new ValidationError("This experience does not include a match game.");
  }

  const matchRepo = new ExperienceMatchRepository(client);
  const match = await matchRepo.findCompleteByExperienceId(gate.experience.id);

  const result = gradeMatchAnswers(
    match.pairs,
    input.answers,
    gate.experience.final_unlock_message,
  );
  const reward = await buildMemoriesRewardPayload(gate.experience);

  return { result, reward };
}
