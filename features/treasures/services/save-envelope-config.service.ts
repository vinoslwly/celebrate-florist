import "server-only";

import { ExperienceEnvelopesRepository } from "@/features/treasures/repositories/experience-envelopes.repository";
import {
  assertTreasuresEditable,
  assertTreasuresMode,
  assertTreasuresOwnership,
} from "@/features/treasures/services/treasures-experience-guards";
import { validateEnvelopeConfigDraft } from "@/features/treasures/services/validate-envelope-config.service";
import type { EnvelopeStudioConfig } from "@/features/treasures/types";

import type { SaveEnvelopeConfigInput } from "@/schemas/studio-envelope";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Draft save — allows incomplete configuration (empty envelopes, partial FD-T5 items).
 * Publish validation runs separately via validateEnvelopeConfigPublish (Phase 5).
 *
 * MED-02: envelope replace uses delete-then-insert via aggregate repository.
 */
export async function saveEnvelopeConfig(
  client: SupabaseClient,
  input: SaveEnvelopeConfigInput,
): Promise<EnvelopeStudioConfig> {
  const experience = await assertTreasuresOwnership(
    client,
    input.orderId,
    input.experienceId,
  );

  assertTreasuresEditable(experience);
  assertTreasuresMode(experience);

  validateEnvelopeConfigDraft({ envelopes: input.envelopes });

  const envelopesRepo = new ExperienceEnvelopesRepository(client);
  const envelopes = await envelopesRepo.replaceAllForExperience(
    input.experienceId,
    input.envelopes,
  );

  return { envelopes };
}
