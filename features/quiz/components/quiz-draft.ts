import type { ExperienceQuiz } from "@/features/quiz/types";

import type {
  QuizQuestionInput,
  QuizScoreBandInput,
} from "@/schemas/studio-quiz";

export type QuizDraftState = {
  questions: QuizQuestionInput[];
  bands: QuizScoreBandInput[];
};

export function experienceQuizToDraft(quiz: ExperienceQuiz): QuizDraftState {
  return {
    questions: quiz.questions.map((question) => ({
      sortOrder: question.sort_order,
      prompt: question.prompt,
      options: [
        question.options[0] ?? "",
        question.options[1] ?? "",
        question.options[2] ?? "",
      ],
      correctOptionIndex: question.correct_option_index,
    })),
    bands: quiz.bands.map((band) => ({
      minPercent: band.min_percent,
      maxPercent: band.max_percent,
      message: band.message,
    })),
  };
}

export function createEmptyQuestion(sortOrder: number): QuizQuestionInput {
  return {
    sortOrder,
    prompt: "",
    options: ["", "", ""],
    correctOptionIndex: 0,
  };
}

export function createDefaultBand(): QuizScoreBandInput {
  return {
    minPercent: 0,
    maxPercent: 100,
    message: "",
  };
}

export function nextQuestionSortOrder(questions: QuizQuestionInput[]): number {
  const used = new Set(questions.map((question) => question.sortOrder));

  for (let slot = 1; slot <= 6; slot += 1) {
    if (!used.has(slot)) {
      return slot;
    }
  }

  return 6;
}

export function isQuizDraftEmpty(draft: QuizDraftState): boolean {
  return draft.questions.length === 0 && draft.bands.length === 0;
}

export function hasQuizContent(
  draft: QuizDraftState,
  savedQuiz: ExperienceQuiz,
): boolean {
  if (savedQuiz.questions.length > 0 || savedQuiz.bands.length > 0) {
    return true;
  }

  return (
    draft.questions.some((question) => question.prompt.trim().length > 0) ||
    draft.bands.some((band) => band.message.trim().length > 0)
  );
}
