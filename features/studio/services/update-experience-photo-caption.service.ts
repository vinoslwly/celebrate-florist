import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperiencePhotoRow } from "@/types/database";

import { formatPhotoCaption } from "@/features/experience/lib/photo-caption";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { UpdateExperiencePhotoCaptionInput } from "@/schemas/studio-photos";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function updateExperiencePhotoCaption(
  client: SupabaseClient,
  input: UpdateExperiencePhotoCaptionInput,
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

  const caption = formatPhotoCaption(input.title, input.description);
  return photosRepo.replaceCaption(photo, caption.length > 0 ? caption : null);
}
