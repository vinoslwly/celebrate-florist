import "server-only";

import type { QuizQuestionRow, QuizScoreBandRow } from "@/types/database";

import { calculateQuizScore } from "@/features/quiz/services/calculate-quiz-score.service";
import { resolveScoreBandMessage } from "@/features/quiz/services/resolve-score-band-message.service";
import type {
  QuizGradeResult,
  QuizAnswerSubmission,
} from "@/features/quiz/types";

/**
 * Stateless server-side quiz grading (OD-5).
 * Recipient answers are not persisted.
 */
export function gradeQuizAnswers(
  questions: QuizQuestionRow[],
  bands: QuizScoreBandRow[],
  answers: QuizAnswerSubmission[],
): QuizGradeResult {
  const score = calculateQuizScore(
    questions.map((question) => ({
      sortOrder: question.sort_order,
      correctOptionIndex: question.correct_option_index,
    })),
    answers,
  );

  const message = resolveScoreBandMessage(
    score.percent,
    bands.map((band) => ({
      minPercent: band.min_percent,
      maxPercent: band.max_percent,
      message: band.message,
    })),
  );

  return {
    ...score,
    message,
  };
}
