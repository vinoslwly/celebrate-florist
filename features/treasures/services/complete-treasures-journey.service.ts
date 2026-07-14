import "server-only";

import { ValidationError } from "@/lib/errors";

import {
  evaluateAccessGate,
  type AccessRequestContext,
} from "@/features/access/services/access-gate.service";
import { EnvelopeOpensRepository } from "@/features/treasures/repositories/envelope-opens.repository";
import { EnvelopesRepository } from "@/features/treasures/repositories/envelopes.repository";
import { isRewardEligible } from "@/features/treasures/services/compute-envelope-progress.service";
import type { CompleteTreasuresJourneyResult } from "@/features/treasures/types";

import type { CompleteTreasuresJourneyInput } from "@/schemas/envelope-recipient";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * CF-R2-A — silently clears envelope opens when the journey is complete.
 * Idempotent: safe to call again after opens are already cleared.
 * Does not run unless all configured envelopes have been opened (FD-T4).
 */
export async function completeTreasuresJourney(
  client: SupabaseClient,
  input: CompleteTreasuresJourneyInput,
  context: AccessRequestContext,
): Promise<CompleteTreasuresJourneyResult> {
  const gate = await evaluateAccessGate(client, input.experienceToken, context);

  if (gate.status !== "granted") {
    throw new ValidationError(
      "Complete access verification before finishing the journey.",
    );
  }

  if (gate.experience.experience_mode !== "treasures") {
    throw new ValidationError("This experience does not include envelopes.");
  }

  const experienceId = gate.experience.id;
  const envelopesRepo = new EnvelopesRepository(client);
  const opensRepo = new EnvelopeOpensRepository(client);

  const [envelopes, openedSortOrders] = await Promise.all([
    envelopesRepo.findByExperienceId(experienceId),
    opensRepo.findOpenedSortOrdersByExperienceId(experienceId),
  ]);

  const envelopeSortOrders = envelopes.map((envelope) => envelope.sort_order);

  if (envelopeSortOrders.length === 0) {
    throw new ValidationError("This experience has no envelopes configured.");
  }

  if (!isRewardEligible(envelopeSortOrders, openedSortOrders)) {
    if (openedSortOrders.length === 0) {
      return { reset: false };
    }

    throw new ValidationError(
      "The journey can only be completed after all envelopes have been opened.",
    );
  }

  await opensRepo.deleteByExperienceId(experienceId);

  return { reset: true };
}
