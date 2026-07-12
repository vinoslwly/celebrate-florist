import "server-only";

import { NotFoundError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import type { PreviewQuizView } from "@/features/quiz/types";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

/**
 * Buyer-preview-safe quiz fetch — questions + bands, no correct answers.
 */
export async function fetchPreviewQuiz(
  experienceId: string,
): Promise<PreviewQuizView> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const quizRepo = new ExperienceQuizRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience) {
    throw new NotFoundError("Experience not found");
  }

  const quiz = await quizRepo.findCompleteByExperienceId(experienceId);

  return {
    quizTitle: experience.quiz_title,
    questions: quiz.questions.map((question) => ({
      sortOrder: question.sort_order,
      prompt: question.prompt,
      options: [
        question.options[0] ?? "",
        question.options[1] ?? "",
        question.options[2] ?? "",
      ],
    })),
    bands: quiz.bands.map((band) => ({
      minPercent: band.min_percent,
      maxPercent: band.max_percent,
      message: band.message,
    })),
  };
}
