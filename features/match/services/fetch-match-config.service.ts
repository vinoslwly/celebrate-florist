import "server-only";

import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import { assertMatchOwnership } from "@/features/match/services/match-experience-guards";
import type { MatchStudioConfig } from "@/features/match/types";

import type { FetchMatchByExperienceInput } from "@/schemas/studio-match";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Studio read — full match config including correct photo mappings (admin-only). */
export async function fetchMatchConfig(
  client: SupabaseClient,
  input: FetchMatchByExperienceInput,
): Promise<MatchStudioConfig> {
  const experience = await assertMatchOwnership(
    client,
    input.orderId,
    input.experienceId,
  );

  const matchRepo = new ExperienceMatchRepository(client);
  const match = await matchRepo.findCompleteByExperienceId(input.experienceId);

  return {
    pairs: match.pairs,
    finalUnlockMessage: experience.final_unlock_message,
  };
}
