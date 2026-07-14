import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { validateMatchConfigPublish } from "@/features/match/services/validate-match-config.service";
import type { MatchConfigValidationInput } from "@/features/match/types";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertMatchOwnership(
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

export function assertMatchEditable(experience: ExperienceRow): void {
  if (experience.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }
}

export function assertMemoriesMode(experience: ExperienceRow): void {
  if (experience.experience_mode !== "memories") {
    throw new ValidationError(
      "Match configuration is only available for Memories mode",
    );
  }
}

/**
 * Publish-time guard — throws when match config is incomplete or references missing photos.
 * Call only from publish validation (Phase 5), not from draft save.
 */
export function assertMatchPublishable(
  config: MatchConfigValidationInput,
  uploadedPhotoSortOrders: number[],
): void {
  validateMatchConfigPublish(config, uploadedPhotoSortOrders);
}
