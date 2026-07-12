import type {
  ExperienceQuiz,
  QuizConfigValidationInput,
} from "@/features/quiz/types";

export function mapExperienceQuizToValidationInput(
  quiz: ExperienceQuiz,
): QuizConfigValidationInput {
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
