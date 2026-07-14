import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { validateEnvelopeConfigPublish } from "@/features/treasures/services/validate-envelope-config.service";
import type { EnvelopeConfigValidationInput } from "@/features/treasures/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertTreasuresOwnership(
  client: SupabaseClient,
  orderId: string,
  experienceId: string,
): Promise<ExperienceRow> {
  const repo = new ExperiencesRepository(client);
  const experience = await repo.findById(experienceId);

  if (!experience || experience.order_id !== orderId) {
    throw new NotFoundError("Experience not found");
  }

  return experience;
}

export function assertTreasuresEditable(experience: ExperienceRow): void {
  if (experience.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }
}

export function assertTreasuresMode(experience: ExperienceRow): void {
  if (experience.experience_mode !== "treasures") {
    throw new ValidationError(
      "Envelope configuration is only available for Treasures mode",
    );
  }
}

/**
 * Publish-time guard — throws when envelope config is incomplete or references missing photos.
 * Call only from publish validation (Phase 5), not from draft save.
 */
export function assertTreasuresPublishable(
  config: EnvelopeConfigValidationInput,
  uploadedPhotoSortOrders: number[],
): void {
  validateEnvelopeConfigPublish(config, uploadedPhotoSortOrders);
}
