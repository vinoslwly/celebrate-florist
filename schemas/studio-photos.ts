import { z } from "zod";

import { photoSortOrderSchema, uuidSchema } from "@/schemas/common";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const allowedPhotoMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const uploadExperiencePhotoSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  sortOrder: photoSortOrderSchema,
});

export type UploadExperiencePhotoInput = z.infer<
  typeof uploadExperiencePhotoSchema
>;

export const deleteExperiencePhotoSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  photoId: uuidSchema,
});

export type DeleteExperiencePhotoInput = z.infer<
  typeof deleteExperiencePhotoSchema
>;

export const updateExperiencePhotoCaptionSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  photoId: uuidSchema,
  title: z.string().trim().max(80),
  description: z.string().trim().max(240),
});

export type UpdateExperiencePhotoCaptionInput = z.infer<
  typeof updateExperiencePhotoCaptionSchema
>;

export function validatePhotoFile(file: File): void {
  if (
    !allowedPhotoMimeTypes.includes(
      file.type as (typeof allowedPhotoMimeTypes)[number],
    )
  ) {
    throw new Error("Photo must be JPEG, PNG, or WebP.");
  }

  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("Photo must be 10 MB or smaller.");
  }
}
