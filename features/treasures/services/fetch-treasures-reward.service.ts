import "server-only";

import { ValidationError } from "@/lib/errors";

import {
  evaluateAccessGate,
  type AccessRequestContext,
} from "@/features/access/services/access-gate.service";
import { buildTreasuresRewardPayload } from "@/features/experience/services/build-treasures-reward-payload.service";
import type { TreasuresRewardPayload } from "@/features/experience/types/treasures-gate.types";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Phase B Treasures reward — letter + gallery after all envelopes opened (FD-T4).
 * Requires granted access gate; eligibility enforced in buildTreasuresRewardPayload.
 */
export async function fetchTreasuresReward(
  client: SupabaseClient,
  experienceToken: string,
  context: AccessRequestContext,
): Promise<TreasuresRewardPayload> {
  const gate = await evaluateAccessGate(client, experienceToken, context);

  if (gate.status !== "granted") {
    throw new ValidationError(
      "Complete access verification before viewing your reward.",
    );
  }

  if (gate.experience.experience_mode !== "treasures") {
    throw new ValidationError("This experience does not include envelopes.");
  }

  return buildTreasuresRewardPayload(gate.experience);
}
