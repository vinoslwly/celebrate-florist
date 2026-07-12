"use server";

import { validateActionInput, withActionHandler } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";

import type { ActionResult } from "@/types/api";

import { approveBuyerPreview } from "@/features/preview/services/approve-buyer-preview.service";
import { approvePreviewSchema } from "@/schemas/studio-publish";

export async function approvePreviewAction(
  input: unknown,
): Promise<ActionResult<{ orderId: string }>> {
  return withActionHandler(async () => {
    const data = validateActionInput(approvePreviewSchema, input);
    const order = await approveBuyerPreview(data);

    auditLogger.info("Buyer preview approved", {
      orderId: order.id,
    });

    return { orderId: order.id };
  });
}
