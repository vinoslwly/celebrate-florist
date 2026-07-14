"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import { fetchEnvelopeConfig } from "@/features/treasures/services/fetch-envelope-config.service";
import { saveEnvelopeConfig } from "@/features/treasures/services/save-envelope-config.service";
import type { EnvelopeStudioConfig } from "@/features/treasures/types";
import {
  fetchEnvelopeByExperienceSchema,
  saveEnvelopeConfigSchema,
} from "@/schemas/studio-envelope";

export async function saveEnvelopeConfigAction(
  input: unknown,
): Promise<ActionResult<{ envelopes: EnvelopeStudioConfig }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(saveEnvelopeConfigSchema, input);
    const supabase = await createClient();
    const envelopes = await saveEnvelopeConfig(supabase, data);

    auditLogger.info("Envelope configuration saved", {
      orderId: data.orderId,
      experienceId: data.experienceId,
      envelopeCount: envelopes.envelopes.length,
    });

    return { envelopes };
  });
}

export async function fetchEnvelopeConfigAction(
  input: unknown,
): Promise<ActionResult<{ envelopes: EnvelopeStudioConfig }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(fetchEnvelopeByExperienceSchema, input);
    const supabase = await createClient();
    const envelopes = await fetchEnvelopeConfig(supabase, data);

    return { envelopes };
  });
}
