import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { SetPhotoboothStripSourceInput } from "@/schemas/studio-photobooth-strips";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function setPhotoboothStripSource(
  client: SupabaseClient,
  input: SetPhotoboothStripSourceInput,
): Promise<ExperienceRow> {
  const experiencesRepo = new ExperiencesRepository(client);
  const experience = await experiencesRepo.findById(input.experienceId);
  if (!experience || experience.order_id !== input.orderId) {
    throw new NotFoundError("Experience not found");
  }

  if (experience.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }

  return experiencesRepo.updatePhotoboothStripSource(
    experience.id,
    input.source,
  );
}
