import "server-only";

import { randomUUID } from "node:crypto";

import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  StorageBucket,
  buildExperiencePhotoPath,
  deleteStorageObject,
  processImageForStorage,
  uploadStorageObject,
} from "@/lib/storage";

import type { ExperiencePhotoRow } from "@/types/database";

import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { UploadExperiencePhotoInput } from "@/schemas/studio-photos";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadExperiencePhoto(
  client: SupabaseClient,
  input: UploadExperiencePhotoInput,
  fileBuffer: ArrayBuffer,
  mimeType: string,
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

  const existingAtSlot = await photosRepo.findByExperienceAndSortOrder(
    input.experienceId,
    input.sortOrder,
  );

  if (!existingAtSlot) {
    const count = await photosRepo.countByExperienceId(input.experienceId);
    if (count >= 6) {
      throw new ValidationError("Maximum of 6 photos per experience.");
    }
  }

  const processed = await processImageForStorage({
    buffer: fileBuffer,
    mimeType,
  });

  const photoId = randomUUID();
  const storagePath = buildExperiencePhotoPath(
    input.experienceId,
    photoId,
    "webp",
  );

  await uploadStorageObject(
    client,
    StorageBucket.EXPERIENCE_PHOTOS,
    storagePath,
    processed.buffer,
    { contentType: processed.mimeType },
  );

  if (existingAtSlot) {
    await photosRepo.deleteById(existingAtSlot.id);
    await deleteStorageObject(
      client,
      StorageBucket.EXPERIENCE_PHOTOS,
      existingAtSlot.storage_path,
    );
  }

  return photosRepo.insertPhoto({
    experienceId: input.experienceId,
    storagePath,
    sortOrder: input.sortOrder,
  });
}
