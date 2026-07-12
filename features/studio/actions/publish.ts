"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { requireAdminUser } from "@/lib/actions/auth";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import { sendPreviewLink } from "@/features/preview/services/send-preview.service";
import { buildExperienceQrDownloadUrl } from "@/features/studio/config/qr-download";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { publishExperience } from "@/features/studio/services/publish-experience.service";
import {
  buildPublishChecklist,
  buildPublishChecklistForExperience,
  canPublishFromChecklist,
} from "@/features/studio/services/publish-validation.service";
import { skipPreviewOverride } from "@/features/studio/services/skip-preview.service";
import {
  getPublishChecklistSchema,
  publishExperienceSchema,
  sendPreviewSchema,
  skipPreviewSchema,
} from "@/schemas/studio-publish";

export async function sendPreviewAction(
  input: unknown,
): Promise<ActionResult<{ previewUrl: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(sendPreviewSchema, input);
    const admin = await requireAdminUser();
    const supabase = await createClient();
    const result = await sendPreviewLink(supabase, data, admin.id);

    auditLogger.info("Preview link sent", {
      orderId: data.orderId,
      experienceId: data.experienceId,
    });

    return { previewUrl: result.previewUrl };
  });
}

export async function skipPreviewAction(
  input: unknown,
): Promise<ActionResult<{ orderId: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(skipPreviewSchema, input);
    const supabase = await createClient();
    const order = await skipPreviewOverride(supabase, data);

    auditLogger.info("Preview skipped by admin override", {
      orderId: data.orderId,
      experienceId: data.experienceId,
    });

    return { orderId: order.id };
  });
}

export async function publishExperienceAction(input: unknown): Promise<
  ActionResult<{
    recipientUrl: string;
    qrDownloadUrl: string | null;
  }>
> {
  return withAdminAction(async () => {
    const data = validateActionInput(publishExperienceSchema, input);
    const supabase = await createClient();
    const result = await publishExperience(supabase, data);

    const qrDownloadUrl = result.qrStoragePath
      ? buildExperienceQrDownloadUrl(data.experienceId, data.orderId)
      : null;

    auditLogger.info("Experience published", {
      orderId: data.orderId,
      experienceId: data.experienceId,
    });

    return {
      recipientUrl: result.recipientUrl,
      qrDownloadUrl,
    };
  });
}

export async function getPublishChecklistAction(input: unknown): Promise<
  ActionResult<{
    items: ReturnType<typeof buildPublishChecklist>;
    canPublish: boolean;
  }>
> {
  return withAdminAction(async () => {
    const data = validateActionInput(getPublishChecklistSchema, input);
    const supabase = await createClient();
    const ordersRepo = new OrdersRepository(supabase);
    const experiencesRepo = new ExperiencesRepository(supabase);

    const [order, experience] = await Promise.all([
      ordersRepo.findById(data.orderId),
      experiencesRepo.findById(data.experienceId),
    ]);

    if (!order || !experience || experience.order_id !== data.orderId) {
      throw new Error("Order or experience not found");
    }

    const items = await buildPublishChecklistForExperience(
      supabase,
      order,
      experience,
    );

    return {
      items,
      canPublish: canPublishFromChecklist(items),
    };
  });
}

export async function getQrDownloadUrlAction(
  input: unknown,
): Promise<ActionResult<{ qrDownloadUrl: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(getPublishChecklistSchema, input);
    const supabase = await createClient();
    const experiencesRepo = new ExperiencesRepository(supabase);
    const experience = await experiencesRepo.findById(data.experienceId);

    if (
      !experience ||
      experience.order_id !== data.orderId ||
      !experience.qr_storage_path
    ) {
      throw new Error("QR code is not available for this experience.");
    }

    return {
      qrDownloadUrl: buildExperienceQrDownloadUrl(
        data.experienceId,
        data.orderId,
      ),
    };
  });
}
