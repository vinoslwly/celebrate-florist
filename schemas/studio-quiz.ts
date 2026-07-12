import { z } from "zod";

import type { QuizTemplateId } from "@/features/quiz/types";
import {
  nonEmptyStringSchema,
  photoSortOrderSchema,
  uuidSchema,
} from "@/schemas/common";

/** Connection quiz — max 6 questions, min 1 at publish (enforced on full config). */
export const QUIZ_MIN_QUESTIONS = 1;
export const QUIZ_MAX_QUESTIONS = 6;

/** Multiple choice A/B/C — exactly three options per question. */
export const QUIZ_OPTIONS_COUNT = 3;

export const quizTemplateIdSchema = z.enum([
  "anniversary",
  "graduation",
  "birthday",
  "proposal",
]) satisfies z.ZodType<QuizTemplateId>;

export type QuizTemplateIdInput = z.infer<typeof quizTemplateIdSchema>;

export const quizOptionSchema = nonEmptyStringSchema.max(
  200,
  "Option must be 200 characters or fewer",
);

export const quizQuestionSortOrderSchema = photoSortOrderSchema;

export const quizPromptSchema = nonEmptyStringSchema.max(
  500,
  "Question must be 500 characters or fewer",
);

export const quizQuestionSchema = z
  .object({
    sortOrder: quizQuestionSortOrderSchema,
    prompt: quizPromptSchema,
    options: z
      .tuple([quizOptionSchema, quizOptionSchema, quizOptionSchema])
      .describe("Exactly three multiple-choice options (A/B/C)"),
    correctOptionIndex: z
      .number()
      .int()
      .min(0)
      .max(QUIZ_OPTIONS_COUNT - 1),
  })
  .superRefine((question, ctx) => {
    if (question.correctOptionIndex >= question.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "correctOptionIndex must reference an existing option",
        path: ["correctOptionIndex"],
      });
    }
  });

export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>;

export const quizScorePercentSchema = z.number().int().min(0).max(100);

export const quizBandMessageSchema = nonEmptyStringSchema.max(
  1000,
  "Score band message must be 1,000 characters or fewer",
);

export const quizScoreBandSchema = z
  .object({
    minPercent: quizScorePercentSchema,
    maxPercent: quizScorePercentSchema,
    message: quizBandMessageSchema,
  })
  .refine((band) => band.minPercent <= band.maxPercent, {
    message: "minPercent must be less than or equal to maxPercent",
    path: ["minPercent"],
  });

export type QuizScoreBandInput = z.infer<typeof quizScoreBandSchema>;

function assertUniqueQuestionSortOrders(
  questions: QuizQuestionInput[],
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<number>();

  for (const [index, question] of questions.entries()) {
    if (seen.has(question.sortOrder)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each question must have a unique sortOrder",
        path: [index, "sortOrder"],
      });
      return;
    }

    seen.add(question.sortOrder);
  }
}

export const quizQuestionsArraySchema = z
  .array(quizQuestionSchema)
  .min(QUIZ_MIN_QUESTIONS)
  .max(QUIZ_MAX_QUESTIONS)
  .superRefine(assertUniqueQuestionSortOrders);

export const quizScoreBandsArraySchema = z
  .array(quizScoreBandSchema)
  .min(1, "At least one score band is required");

export const saveQuizConfigSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  questions: quizQuestionsArraySchema,
  bands: quizScoreBandsArraySchema,
});

export type SaveQuizConfigInput = z.infer<typeof saveQuizConfigSchema>;

export const applyQuizTemplateSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  templateId: quizTemplateIdSchema,
});

export type ApplyQuizTemplateInput = z.infer<typeof applyQuizTemplateSchema>;

export const fetchQuizByExperienceSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
});

export type FetchQuizByExperienceInput = z.infer<
  typeof fetchQuizByExperienceSchema
>;
