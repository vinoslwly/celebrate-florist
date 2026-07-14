"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import { fetchMatchConfig } from "@/features/match/services/fetch-match-config.service";
import { saveMatchConfig } from "@/features/match/services/save-match-config.service";
import type { MatchStudioConfig } from "@/features/match/types";
import {
  fetchMatchByExperienceSchema,
  saveMatchConfigSchema,
} from "@/schemas/studio-match";

export async function saveMatchConfigAction(
  input: unknown,
): Promise<ActionResult<{ match: MatchStudioConfig }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(saveMatchConfigSchema, input);
    const supabase = await createClient();
    const match = await saveMatchConfig(supabase, data);

    auditLogger.info("Match configuration saved", {
      orderId: data.orderId,
      experienceId: data.experienceId,
      pairCount: match.pairs.length,
    });

    return { match };
  });
}

export async function fetchMatchConfigAction(
  input: unknown,
): Promise<ActionResult<{ match: MatchStudioConfig }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(fetchMatchByExperienceSchema, input);
    const supabase = await createClient();
    const match = await fetchMatchConfig(supabase, data);

    return { match };
  });
}
