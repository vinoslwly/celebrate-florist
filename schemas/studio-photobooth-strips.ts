import { z } from "zod";

import { photoSortOrderSchema, uuidSchema } from "@/schemas/common";

export const photoboothStripSourceSchema = z.enum(["catalog", "custom"]);

export const photoboothStripLayoutSchema = z.enum(["B"]);

export const uploadPhotoboothStripSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  sortOrder: photoSortOrderSchema,
  layoutId: photoboothStripLayoutSchema,
});

export type UploadPhotoboothStripInput = z.infer<
  typeof uploadPhotoboothStripSchema
>;

export const deletePhotoboothStripSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  stripId: uuidSchema,
});

export type DeletePhotoboothStripInput = z.infer<
  typeof deletePhotoboothStripSchema
>;

export const setPhotoboothStripSourceSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  source: photoboothStripSourceSchema,
});

export type SetPhotoboothStripSourceInput = z.infer<
  typeof setPhotoboothStripSourceSchema
>;

const MAX_STRIP_BYTES = 8 * 1024 * 1024;

export function validatePhotoboothStripFile(file: File): void {
  if (file.type !== "image/png") {
    throw new Error("Strip must be a transparent PNG.");
  }
  if (file.size > MAX_STRIP_BYTES) {
    throw new Error("Strip must be 8 MB or smaller.");
  }
}
