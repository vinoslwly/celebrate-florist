"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import { changeExperienceMode } from "@/features/studio/services/change-experience-mode.service";
import { createOrderWithExperience } from "@/features/studio/services/create-order.service";
import { updateExperienceDraft } from "@/features/studio/services/update-experience-draft.service";
import {
  changeExperienceModeSchema,
  createOrderSchema,
  updateExperienceDraftSchema,
} from "@/schemas/studio-orders";

type CreateOrderSuccess = {
  orderId: string;
  experienceId: string;
  orderNumber: string;
};

export async function createOrderAction(
  input: unknown,
): Promise<ActionResult<CreateOrderSuccess>> {
  return withAdminAction(async () => {
    const data = validateActionInput(createOrderSchema, input);
    const supabase = await createClient();
    const result = await createOrderWithExperience(supabase, data);

    auditLogger.info("Order created with experience", {
      orderId: result.orderId,
      experienceId: result.experienceId,
      experienceMode: data.experienceMode,
    });

    return {
      orderId: result.orderId,
      experienceId: result.experienceId,
      orderNumber: result.orderNumber,
    };
  });
}

export async function updateExperienceDraftAction(
  input: unknown,
): Promise<ActionResult<{ experienceId: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(updateExperienceDraftSchema, input);
    const supabase = await createClient();
    const updated = await updateExperienceDraft(supabase, data);

    auditLogger.info("Experience draft saved", {
      experienceId: updated.id,
    });

    return { experienceId: updated.id };
  });
}

export async function changeExperienceModeAction(
  input: unknown,
): Promise<ActionResult<{ experienceId: string; experienceMode: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(changeExperienceModeSchema, input);
    const supabase = await createClient();
    const updated = await changeExperienceMode(supabase, data);

    auditLogger.info("Experience mode changed", {
      experienceId: updated.id,
      experienceMode: updated.experience_mode,
    });

    return {
      experienceId: updated.id,
      experienceMode: updated.experience_mode,
    };
  });
}
