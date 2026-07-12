import "server-only";

import { getQuizTemplate } from "@/features/quiz/config/templates";
import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import {
  assertConnectionMode,
  assertQuizExperienceEditable,
  assertQuizExperienceOwnership,
} from "@/features/quiz/services/quiz-experience-guards";
import { validateQuizConfig } from "@/features/quiz/services/validate-quiz-config.service";
import type { ExperienceQuiz } from "@/features/quiz/types";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { ApplyQuizTemplateInput } from "@/schemas/studio-quiz";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function applyQuizTemplate(
  client: SupabaseClient,
  input: ApplyQuizTemplateInput,
): Promise<ExperienceQuiz> {
  const experience = await assertQuizExperienceOwnership(
    client,
    input.orderId,
    input.experienceId,
  );

  assertQuizExperienceEditable(experience);
  assertConnectionMode(experience);

  const template = getQuizTemplate(input.templateId);
  validateQuizConfig({
    questions: template.questions,
    bands: template.bands,
  });

  const experiencesRepo = new ExperiencesRepository(client);
  await experiencesRepo.updateDraft(input.experienceId, {
    greetingName: experience.greeting_name,
    closingName: experience.closing_name,
    letterContent: experience.letter_content,
    letterClosing: experience.letter_closing,
    quizTitle: template.quizTitle,
  });

  const quizRepo = new ExperienceQuizRepository(client);
  return quizRepo.replaceAllForExperience(input.experienceId, {
    questions: template.questions,
    bands: template.bands,
  });
}
