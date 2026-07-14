"use server";

import { validateActionInput, withActionHandler } from "@/lib/actions";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ActionResult } from "@/types/api";

import { getAccessRequestContext } from "@/features/access/services/access-gate.service";
import type { MemoriesSubmitResult } from "@/features/experience/types/memories-gate.types";
import { submitMatchAnswers } from "@/features/match/services/submit-match-answers.service";
import { submitMatchAnswersSchema } from "@/schemas/match-recipient";

export async function submitMatchAnswersAction(
  input: unknown,
): Promise<ActionResult<MemoriesSubmitResult>> {
  return withActionHandler(async () => {
    const data = validateActionInput(submitMatchAnswersSchema, input);
    const context = await getAccessRequestContext();
    const admin = createAdminClient();
    const submitResult = await submitMatchAnswers(admin, data, context);

    return submitResult;
  });
}
