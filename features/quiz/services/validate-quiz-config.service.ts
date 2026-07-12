import "server-only";

import { ValidationError } from "@/lib/errors";

import { mapExperienceQuizToValidationInput } from "@/features/quiz/services/map-experience-quiz.service";
import type {
  ExperienceQuiz,
  QuizConfigValidationInput,
} from "@/features/quiz/types";
import {
  QUIZ_MAX_QUESTIONS,
  QUIZ_MIN_QUESTIONS,
  QUIZ_OPTIONS_COUNT,
} from "@/schemas/studio-quiz";

function assertQuestionCount(count: number): void {
  if (count < QUIZ_MIN_QUESTIONS || count > QUIZ_MAX_QUESTIONS) {
    throw new ValidationError(
      `Quiz must have between ${QUIZ_MIN_QUESTIONS} and ${QUIZ_MAX_QUESTIONS} questions`,
    );
  }
}

function assertUniqueQuestionSortOrders(
  questions: QuizConfigValidationInput["questions"],
): void {
  const seen = new Set<number>();

  for (const question of questions) {
    if (seen.has(question.sortOrder)) {
      throw new ValidationError("Each question must have a unique sort order");
    }

    seen.add(question.sortOrder);
  }
}

function assertThreeChoicesPerQuestion(
  questions: QuizConfigValidationInput["questions"],
): void {
  for (const question of questions) {
    if (question.options.length !== QUIZ_OPTIONS_COUNT) {
      throw new ValidationError(
        "Each question must have exactly three choices",
      );
    }
  }
}

function assertAtLeastOneScoreBand(
  bands: QuizConfigValidationInput["bands"],
): void {
  if (bands.length < 1) {
    throw new ValidationError("At least one score band is required");
  }
}

function bandsOverlap(
  left: QuizConfigValidationInput["bands"][number],
  right: QuizConfigValidationInput["bands"][number],
): boolean {
  return (
    left.minPercent <= right.maxPercent && right.minPercent <= left.maxPercent
  );
}

function assertNoOverlappingScoreBands(
  bands: QuizConfigValidationInput["bands"],
): void {
  for (let i = 0; i < bands.length; i += 1) {
    const left = bands[i];
    if (!left) {
      continue;
    }

    for (let j = i + 1; j < bands.length; j += 1) {
      const right = bands[j];
      if (!right) {
        continue;
      }

      if (bandsOverlap(left, right)) {
        throw new ValidationError("Score bands must not overlap");
      }
    }
  }
}

function assertFullScoreBandCoverage(
  bands: QuizConfigValidationInput["bands"],
): void {
  for (let percent = 0; percent <= 100; percent += 1) {
    const covered = bands.some(
      (band) => percent >= band.minPercent && percent <= band.maxPercent,
    );

    if (!covered) {
      throw new ValidationError(
        "Score bands must cover every percentage from 0 to 100",
      );
    }
  }
}

/**
 * Server-side quiz configuration validation (OD-3).
 * Reusable from save, template apply, and Phase 5 publish validation.
 */
export function validateQuizConfig(config: QuizConfigValidationInput): void {
  assertQuestionCount(config.questions.length);
  assertUniqueQuestionSortOrders(config.questions);
  assertThreeChoicesPerQuestion(config.questions);
  assertAtLeastOneScoreBand(config.bands);
  assertNoOverlappingScoreBands(config.bands);
  assertFullScoreBandCoverage(config.bands);
}

export type QuizConfigEvaluation =
  { ok: true } | { ok: false; message: string };

/**
 * Non-throwing wrapper for publish checklist and UI feedback.
 * Uses the same rules as validateQuizConfig().
 */
export function evaluateQuizConfig(
  config: QuizConfigValidationInput,
): QuizConfigEvaluation {
  try {
    validateQuizConfig(config);
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, message: error.message };
    }

    throw error;
  }
}

export function evaluateExperienceQuiz(
  quiz: ExperienceQuiz,
): QuizConfigEvaluation {
  return evaluateQuizConfig(mapExperienceQuizToValidationInput(quiz));
}
