import { z } from "zod";

import { nonEmptyStringSchema, photoSortOrderSchema } from "@/schemas/common";

/**
 * Recipient open envelope — FD-T1: any order; no sequential validation.
 * Content fetched per envelope via server action (A-4).
 */
export const openEnvelopeSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
  sortOrder: photoSortOrderSchema,
});

export type OpenEnvelopeInput = z.infer<typeof openEnvelopeSchema>;

/** Recipient reward fetch — after all envelopes opened (FD-T4). */
export const fetchTreasuresRewardSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
});

export type FetchTreasuresRewardInput = z.infer<
  typeof fetchTreasuresRewardSchema
>;

/** CF-R2-A — silent replay reset after journey completion (Photobooth trigger in 10B). */
export const completeTreasuresJourneySchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
});

export type CompleteTreasuresJourneyInput = z.infer<
  typeof completeTreasuresJourneySchema
>;
