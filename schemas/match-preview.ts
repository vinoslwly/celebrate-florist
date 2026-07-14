import { z } from "zod";

import { uuidSchema } from "@/schemas/common";

/** Buyer preview fetch — same token gate as other preview flows (Phase 7). */
export const fetchPreviewMatchSchema = z.object({
  experienceId: uuidSchema,
});

export type FetchPreviewMatchInput = z.infer<typeof fetchPreviewMatchSchema>;
