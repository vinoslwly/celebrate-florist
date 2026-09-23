import { z } from "zod";

import { uuidSchema } from "@/schemas/common";

export const CATALOG_STRIP_MAX = 60;

export const renameCatalogStripSchema = z.object({
  stripId: uuidSchema,
  displayName: z.string().trim().min(1).max(80),
});

export type RenameCatalogStripInput = z.infer<typeof renameCatalogStripSchema>;

export const deleteCatalogStripSchema = z.object({
  stripId: uuidSchema,
});

export type DeleteCatalogStripInput = z.infer<typeof deleteCatalogStripSchema>;

const MAX_STRIP_BYTES = 8 * 1024 * 1024;

export function validateCatalogStripFile(file: File): void {
  if (file.type !== "image/png") {
    throw new Error("Strip must be a transparent PNG.");
  }
  if (file.size > MAX_STRIP_BYTES) {
    throw new Error("Strip must be 8 MB or smaller.");
  }
}
