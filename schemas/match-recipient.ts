import { z } from "zod";

import { nonEmptyStringSchema, photoSortOrderSchema } from "@/schemas/common";
import { MATCH_MAX_PAIRS } from "@/schemas/studio-match";

/** Single story→photo selection in batch submit (A-2). */
export const matchAnswerSubmissionSchema = z.object({
  storySortOrder: photoSortOrderSchema,
  selectedPhotoSortOrder: photoSortOrderSchema,
});

export type MatchAnswerSubmissionInput = z.infer<
  typeof matchAnswerSubmissionSchema
>;

export const submitMatchAnswersSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
  answers: z
    .array(matchAnswerSubmissionSchema)
    .min(1, "At least one answer is required")
    .max(MATCH_MAX_PAIRS),
});

export type SubmitMatchAnswersInput = z.infer<typeof submitMatchAnswersSchema>;

export const fetchRecipientMatchSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
});

export type FetchRecipientMatchInput = z.infer<
  typeof fetchRecipientMatchSchema
>;
