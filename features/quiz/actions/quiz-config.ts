"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import { applyQuizTemplate } from "@/features/quiz/services/apply-quiz-template.service";
import { fetchQuizConfig } from "@/features/quiz/services/fetch-quiz-config.service";
import { saveQuizConfig } from "@/features/quiz/services/save-quiz-config.service";
import type { ExperienceQuiz } from "@/features/quiz/types";
import {
  applyQuizTemplateSchema,
  fetchQuizByExperienceSchema,
  saveQuizConfigSchema,
} from "@/schemas/studio-quiz";

export async function saveQuizConfigAction(
  input: unknown,
): Promise<ActionResult<{ quiz: ExperienceQuiz }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(saveQuizConfigSchema, input);
    const supabase = await createClient();
    const quiz = await saveQuizConfig(supabase, data);

    auditLogger.info("Quiz configuration saved", {
      orderId: data.orderId,
      experienceId: data.experienceId,
      questionCount: quiz.questions.length,
      bandCount: quiz.bands.length,
    });

    return { quiz };
  });
}

export async function applyQuizTemplateAction(
  input: unknown,
): Promise<ActionResult<{ quiz: ExperienceQuiz }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(applyQuizTemplateSchema, input);
    const supabase = await createClient();
    const quiz = await applyQuizTemplate(supabase, data);

    auditLogger.info("Quiz template applied", {
      orderId: data.orderId,
      experienceId: data.experienceId,
      templateId: data.templateId,
      questionCount: quiz.questions.length,
      bandCount: quiz.bands.length,
    });

    return { quiz };
  });
}

export async function fetchQuizConfigAction(
  input: unknown,
): Promise<ActionResult<{ quiz: ExperienceQuiz }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(fetchQuizByExperienceSchema, input);
    const supabase = await createClient();
    const quiz = await fetchQuizConfig(supabase, data);

    return { quiz };
  });
}
