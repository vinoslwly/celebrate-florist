import { z } from "zod";

import { nonEmptyStringSchema, photoSortOrderSchema } from "@/schemas/common";

export const quizAnswerSubmissionSchema = z.object({
  sortOrder: photoSortOrderSchema,
  selectedOptionIndex: z.number().int().min(0).max(2),
});

export type QuizAnswerSubmissionInput = z.infer<
  typeof quizAnswerSubmissionSchema
>;

export const submitQuizAnswersSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
  answers: z
    .array(quizAnswerSubmissionSchema)
    .min(1, "At least one answer is required")
    .max(6),
});

export type SubmitQuizAnswersInput = z.infer<typeof submitQuizAnswersSchema>;

export const fetchRecipientQuizSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
});

export type FetchRecipientQuizInput = z.infer<typeof fetchRecipientQuizSchema>;
