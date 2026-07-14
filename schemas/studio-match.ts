import { z } from "zod";

import {
  nonEmptyStringSchema,
  photoSortOrderSchema,
  uuidSchema,
} from "@/schemas/common";

/** Memories match — min 2 at publish (A-1), max 6 pairs. */
export const MATCH_MIN_PAIRS = 2;
export const MATCH_MAX_PAIRS = 6;

export const matchStorySortOrderSchema = photoSortOrderSchema;

export const matchStoryTextSchema = nonEmptyStringSchema.max(
  500,
  "Story must be 500 characters or fewer",
);

export const matchPhotoSortOrderSchema = photoSortOrderSchema;

export const matchPairSchema = z.object({
  sortOrder: matchStorySortOrderSchema,
  storyText: matchStoryTextSchema,
  photoSortOrder: matchPhotoSortOrderSchema,
});

export type MatchPairInput = z.infer<typeof matchPairSchema>;

export const matchFinalUnlockMessageSchema = nonEmptyStringSchema.max(
  2_000,
  "Final unlock message must be 2,000 characters or fewer",
);

function assertUniquePairSortOrders(
  pairs: MatchPairInput[],
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<number>();

  for (const [index, pair] of pairs.entries()) {
    if (seen.has(pair.sortOrder)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each story must have a unique sortOrder",
        path: [index, "sortOrder"],
      });
      return;
    }

    seen.add(pair.sortOrder);
  }
}

function assertUniquePhotoSortOrders(
  pairs: MatchPairInput[],
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<number>();

  for (const [index, pair] of pairs.entries()) {
    if (seen.has(pair.photoSortOrder)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each photo slot may only be used once (A-1)",
        path: [index, "photoSortOrder"],
      });
      return;
    }

    seen.add(pair.photoSortOrder);
  }
}

/** Draft save — allows empty array while admin is building; max 6 when present. */
export const matchPairsDraftArraySchema = z
  .array(matchPairSchema)
  .max(MATCH_MAX_PAIRS)
  .superRefine(assertUniquePairSortOrders)
  .superRefine(assertUniquePhotoSortOrders);

/** Publish-ready pairs — min 2 required (A-1). */
export const matchPairsPublishArraySchema = matchPairsDraftArraySchema.min(
  MATCH_MIN_PAIRS,
  `At least ${MATCH_MIN_PAIRS} match pairs are required`,
);

export const saveMatchConfigSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  pairs: matchPairsDraftArraySchema,
  finalUnlockMessage: z
    .string()
    .trim()
    .max(2_000, "Final unlock message must be 2,000 characters or fewer")
    .nullable(),
});

export type SaveMatchConfigInput = z.infer<typeof saveMatchConfigSchema>;

export const fetchMatchByExperienceSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
});

export type FetchMatchByExperienceInput = z.infer<
  typeof fetchMatchByExperienceSchema
>;
