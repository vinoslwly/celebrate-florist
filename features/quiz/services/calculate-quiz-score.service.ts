import { ValidationError } from "@/lib/errors";

import type { QuizAnswerSubmission } from "@/features/quiz/types";

type GradableQuestion = {
  sortOrder: number;
  correctOptionIndex: number;
};

/**
 * Pure score calculation — percentage rounded to nearest integer.
 */
export function calculateQuizScore(
  questions: GradableQuestion[],
  answers: QuizAnswerSubmission[],
): {
  percent: number;
  correctCount: number;
  totalQuestions: number;
} {
  if (questions.length === 0) {
    throw new ValidationError("Quiz has no questions");
  }

  if (answers.length !== questions.length) {
    throw new ValidationError("All questions must be answered");
  }

  const questionMap = new Map(
    questions.map((question) => [question.sortOrder, question]),
  );
  const answeredSortOrders = new Set<number>();
  let correctCount = 0;

  for (const answer of answers) {
    if (answeredSortOrders.has(answer.sortOrder)) {
      throw new ValidationError("Duplicate answer for the same question");
    }

    answeredSortOrders.add(answer.sortOrder);

    const question = questionMap.get(answer.sortOrder);
    if (!question) {
      throw new ValidationError("Submission includes an unknown question");
    }

    if (answer.selectedOptionIndex < 0 || answer.selectedOptionIndex > 2) {
      throw new ValidationError("Selected option must be A, B, or C");
    }

    if (answer.selectedOptionIndex === question.correctOptionIndex) {
      correctCount += 1;
    }
  }

  for (const question of questions) {
    if (!answeredSortOrders.has(question.sortOrder)) {
      throw new ValidationError("All questions must be answered");
    }
  }

  const percent = Math.round((correctCount / questions.length) * 100);

  return {
    percent,
    correctCount,
    totalQuestions: questions.length,
  };
}
