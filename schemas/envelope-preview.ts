import { z } from "zod";

import { uuidSchema } from "@/schemas/common";

/** Buyer preview fetch — structure only, no hidden envelope content (A-3). */
export const fetchPreviewEnvelopesSchema = z.object({
  experienceId: uuidSchema,
});

export type FetchPreviewEnvelopesInput = z.infer<
  typeof fetchPreviewEnvelopesSchema
>;
