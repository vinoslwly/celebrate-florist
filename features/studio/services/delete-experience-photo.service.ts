import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { StorageBucket, deleteStorageObject } from "@/lib/storage";

import type { ExperiencePhotoRow } from "@/types/database";

import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { DeleteExperiencePhotoInput } from "@/schemas/studio-photos";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function deleteExperiencePhoto(
  client: SupabaseClient,
  input: DeleteExperiencePhotoInput,
): Promise<ExperiencePhotoRow> {
  const experiencesRepo = new ExperiencesRepository(client);
  const photosRepo = new ExperiencePhotosRepository(client);

  const experience = await experiencesRepo.findById(input.experienceId);
  if (!experience || experience.order_id !== input.orderId) {
    throw new NotFoundError("Experience not found");
  }

  if (experience.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }

  const photos = await photosRepo.findByExperienceId(input.experienceId);
  const photo = photos.find((row) => row.id === input.photoId);

  if (!photo) {
    throw new NotFoundError("Photo not found");
  }

  const deleted = await photosRepo.deleteById(photo.id);
  await deleteStorageObject(
    client,
    StorageBucket.EXPERIENCE_PHOTOS,
    photo.storage_path,
  );

  return deleted;
}
