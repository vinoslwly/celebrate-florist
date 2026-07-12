import "server-only";

import { NotFoundError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import type { QuizQuestionRow } from "@/types/database";

import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import type {
  RecipientQuizQuestion,
  RecipientQuizView,
} from "@/features/quiz/types";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

function mapQuestionToRecipientView(
  question: QuizQuestionRow,
): RecipientQuizQuestion {
  return {
    sortOrder: question.sort_order,
    prompt: question.prompt,
    options: [
      question.options[0] ?? "",
      question.options[1] ?? "",
      question.options[2] ?? "",
    ],
  };
}

/**
 * Recipient-safe quiz fetch — strips correct_option_index.
 * Call only after access gate is granted (page layer responsibility).
 */
export async function fetchRecipientQuiz(
  experienceId: string,
): Promise<RecipientQuizView> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const quizRepo = new ExperienceQuizRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  const quiz = await quizRepo.findCompleteByExperienceId(experienceId);

  return {
    quizTitle: experience.quiz_title,
    questions: quiz.questions.map(mapQuestionToRecipientView),
  };
}
