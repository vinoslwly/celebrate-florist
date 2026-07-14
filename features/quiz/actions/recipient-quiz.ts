"use server";

import { validateActionInput, withActionHandler } from "@/lib/actions";
import { ValidationError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ActionResult } from "@/types/api";

import {
  evaluateAccessGate,
  getAccessRequestContext,
} from "@/features/access/services/access-gate.service";
import type { ConnectionQuizSubmitResult } from "@/features/experience/types/connection-gate.types";
import { fetchRecipientQuiz } from "@/features/quiz/services/fetch-recipient-quiz.service";
import { submitQuizAnswers } from "@/features/quiz/services/submit-quiz-answers.service";
import type { RecipientQuizView } from "@/features/quiz/types";
import {
  fetchRecipientQuizSchema,
  submitQuizAnswersSchema,
} from "@/schemas/quiz-recipient";

export async function fetchRecipientQuizAction(
  input: unknown,
): Promise<ActionResult<{ quiz: RecipientQuizView }>> {
  return withActionHandler(async () => {
    const data = validateActionInput(fetchRecipientQuizSchema, input);
    const context = await getAccessRequestContext();
    const admin = createAdminClient();

    const gate = await evaluateAccessGate(admin, data.experienceToken, context);

    if (gate.status !== "granted") {
      throw new ValidationError("Access required to load quiz content.");
    }

    const quiz = await fetchRecipientQuiz(gate.experience.id);
    return { quiz };
  });
}

export async function submitQuizAnswersAction(
  input: unknown,
): Promise<ActionResult<ConnectionQuizSubmitResult>> {
  return withActionHandler(async () => {
    const data = validateActionInput(submitQuizAnswersSchema, input);
    const context = await getAccessRequestContext();
    const admin = createAdminClient();
    const submitResult = await submitQuizAnswers(admin, data, context);

    return submitResult;
  });
}
