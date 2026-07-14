"use server";

import { validateActionInput, withActionHandler } from "@/lib/actions";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ActionResult } from "@/types/api";

import { getAccessRequestContext } from "@/features/access/services/access-gate.service";
import type { TreasuresRewardPayload } from "@/features/experience/types/treasures-gate.types";
import { fetchTreasuresReward } from "@/features/treasures/services/fetch-treasures-reward.service";
import { openEnvelope } from "@/features/treasures/services/open-envelope.service";
import type { OpenEnvelopeResult } from "@/features/treasures/types";
import {
  fetchTreasuresRewardSchema,
  openEnvelopeSchema,
} from "@/schemas/envelope-recipient";

export async function openEnvelopeAction(
  input: unknown,
): Promise<ActionResult<OpenEnvelopeResult>> {
  return withActionHandler(async () => {
    const data = validateActionInput(openEnvelopeSchema, input);
    const context = await getAccessRequestContext();
    const admin = createAdminClient();

    return openEnvelope(admin, data, context);
  });
}

export async function fetchTreasuresRewardAction(
  input: unknown,
): Promise<ActionResult<TreasuresRewardPayload>> {
  return withActionHandler(async () => {
    const data = validateActionInput(fetchTreasuresRewardSchema, input);
    const context = await getAccessRequestContext();
    const admin = createAdminClient();

    return fetchTreasuresReward(admin, data.experienceToken, context);
  });
}
