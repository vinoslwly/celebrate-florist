"use server";

import { validateActionInput, withActionHandler } from "@/lib/actions";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ActionResult } from "@/types/api";

import { getAccessRequestContext } from "@/features/access/services/access-gate.service";
import { completeTreasuresJourney } from "@/features/treasures/services/complete-treasures-journey.service";
import type { CompleteTreasuresJourneyResult } from "@/features/treasures/types";
import { completeTreasuresJourneySchema } from "@/schemas/envelope-recipient";

export async function completeTreasuresJourneyAction(
  input: unknown,
): Promise<ActionResult<CompleteTreasuresJourneyResult>> {
  return withActionHandler(async () => {
    const data = validateActionInput(completeTreasuresJourneySchema, input);
    const context = await getAccessRequestContext();
    const admin = createAdminClient();

    return completeTreasuresJourney(admin, data, context);
  });
}
