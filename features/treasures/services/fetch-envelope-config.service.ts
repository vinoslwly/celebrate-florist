import "server-only";

import { ExperienceEnvelopesRepository } from "@/features/treasures/repositories/experience-envelopes.repository";
import { assertTreasuresOwnership } from "@/features/treasures/services/treasures-experience-guards";
import type { EnvelopeStudioConfig } from "@/features/treasures/types";

import type { FetchEnvelopeByExperienceInput } from "@/schemas/studio-envelope";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Studio read — full envelope config including FD-T5 fields (admin-only). */
export async function fetchEnvelopeConfig(
  client: SupabaseClient,
  input: FetchEnvelopeByExperienceInput,
): Promise<EnvelopeStudioConfig> {
  await assertTreasuresOwnership(client, input.orderId, input.experienceId);

  const envelopesRepo = new ExperienceEnvelopesRepository(client);
  const envelopes = await envelopesRepo.findEnvelopesByExperienceId(
    input.experienceId,
  );

  return { envelopes };
}
