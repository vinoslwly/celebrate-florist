import "server-only";

import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import {
  assertMatchEditable,
  assertMatchOwnership,
  assertMemoriesMode,
} from "@/features/match/services/match-experience-guards";
import { validateMatchConfigDraft } from "@/features/match/services/validate-match-config.service";
import type { MatchStudioConfig } from "@/features/match/types";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { SaveMatchConfigInput } from "@/schemas/studio-match";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Draft save — allows incomplete configuration (empty pairs, blank unlock message).
 * Publish validation runs separately via validateMatchConfigPublish (Phase 5).
 *
 * MED-02: pair replace uses delete-then-insert via aggregate repository.
 */
export async function saveMatchConfig(
  client: SupabaseClient,
  input: SaveMatchConfigInput,
): Promise<MatchStudioConfig> {
  const experience = await assertMatchOwnership(
    client,
    input.orderId,
    input.experienceId,
  );

  assertMatchEditable(experience);
  assertMemoriesMode(experience);

  validateMatchConfigDraft({
    pairs: input.pairs,
    finalUnlockMessage: input.finalUnlockMessage,
  });

  const experiencesRepo = new ExperiencesRepository(client);
  await experiencesRepo.updateDraft(input.experienceId, {
    greetingName: experience.greeting_name,
    closingName: experience.closing_name,
    letterContent: experience.letter_content,
    letterClosing: experience.letter_closing,
    quizTitle: experience.quiz_title,
    finalUnlockMessage: input.finalUnlockMessage,
  });

  const matchRepo = new ExperienceMatchRepository(client);
  const match = await matchRepo.replaceAllForExperience(
    input.experienceId,
    input.pairs,
  );

  return {
    pairs: match.pairs,
    finalUnlockMessage: input.finalUnlockMessage,
  };
}
