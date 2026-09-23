import "server-only";

import { randomUUID } from "node:crypto";

import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  StorageBucket,
  buildPhotoboothStripPath,
  deleteStorageObject,
  processPhotoboothStripPng,
  uploadStorageObject,
} from "@/lib/storage";

import type { ExperiencePhotoboothStripRow } from "@/types/database";

import { ExperiencePhotoboothStripsRepository } from "@/features/studio/repositories/experience-photobooth-strips.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { UploadPhotoboothStripInput } from "@/schemas/studio-photobooth-strips";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadPhotoboothStrip(
  client: SupabaseClient,
  input: UploadPhotoboothStripInput,
  fileBuffer: ArrayBuffer,
  mimeType: string,
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

  const existingAtSlot = await stripsRepo.findByExperienceAndSortOrder(
    input.experienceId,
    input.sortOrder,
  );

  if (!existingAtSlot) {
    const count = await stripsRepo.countByExperienceId(input.experienceId);
    if (count >= 6) {
      throw new ValidationError("Maximum of 6 custom strips per experience.");
    }
  }

  const processed = await processPhotoboothStripPng({
    buffer: fileBuffer,
    mimeType,
  });

  const stripId = randomUUID();
  const storagePath = buildPhotoboothStripPath(input.experienceId, stripId);

  await uploadStorageObject(
    client,
    StorageBucket.PHOTOBOOTH_STRIPS,
    storagePath,
    processed.buffer,
    { contentType: processed.mimeType },
  );

  if (existingAtSlot) {
    await stripsRepo.deleteById(existingAtSlot.id);
    await deleteStorageObject(
      client,
      StorageBucket.PHOTOBOOTH_STRIPS,
      existingAtSlot.storage_path,
    );
  }

  return stripsRepo.insertStrip({
    experienceId: input.experienceId,
    storagePath,
    sortOrder: input.sortOrder,
    layoutId: "B",
  });
}
