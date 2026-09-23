import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { StorageBucket, deleteStorageObject } from "@/lib/storage";

import type { ExperiencePhotoboothStripRow } from "@/types/database";

import { ExperiencePhotoboothStripsRepository } from "@/features/studio/repositories/experience-photobooth-strips.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { DeletePhotoboothStripInput } from "@/schemas/studio-photobooth-strips";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function deletePhotoboothStrip(
  client: SupabaseClient,
  input: DeletePhotoboothStripInput,
): Promise<ExperiencePhotoboothStripRow> {
  const experiencesRepo = new ExperiencesRepository(client);
  const stripsRepo = new ExperiencePhotoboothStripsRepository(client);

  const experience = await experiencesRepo.findById(input.experienceId);
  if (!experience || experience.order_id !== input.orderId) {
    throw new NotFoundError("Experience not found");
  }

  if (experience.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }

  const strips = await stripsRepo.findByExperienceId(input.experienceId);
  const strip = strips.find((row) => row.id === input.stripId);
  if (!strip) {
    throw new NotFoundError("Strip not found");
  }

  const deleted = await stripsRepo.deleteById(strip.id);
  await deleteStorageObject(
    client,
    StorageBucket.PHOTOBOOTH_STRIPS,
    strip.storage_path,
  );

  return deleted;
}
