import "server-only";

import { randomBytes } from "node:crypto";

import { NotFoundError } from "@/lib/errors";

import type { PreviewLinkRow } from "@/types/database";

import { env } from "@/config/env";

import { PreviewLinksRepository } from "@/features/preview/repositories/preview-links.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";

import type { SendPreviewInput } from "@/schemas/studio-publish";
import type { SupabaseClient } from "@supabase/supabase-js";

function generatePreviewToken(): string {
  return randomBytes(24).toString("base64url");
}

export type SendPreviewResult = {
  previewUrl: string;
  previewLink: PreviewLinkRow;
};

export async function sendPreviewLink(
  client: SupabaseClient,
  input: SendPreviewInput,
  adminUserId: string,
): Promise<SendPreviewResult> {
  const ordersRepo = new OrdersRepository(client);
  const experiencesRepo = new ExperiencesRepository(client);
  const previewRepo = new PreviewLinksRepository(client);

  const [order, experience] = await Promise.all([
    ordersRepo.findById(input.orderId),
    experiencesRepo.findById(input.experienceId),
  ]);

  if (!order || !experience || experience.order_id !== input.orderId) {
    throw new NotFoundError("Order or experience not found");
  }

  await previewRepo.deactivateByExperienceId(input.experienceId);

  const previewToken = generatePreviewToken();
  const previewLink = await previewRepo.insertLink({
    experienceId: input.experienceId,
    previewToken,
    createdBy: adminUserId,
  });

  await ordersRepo.updateStatus(input.orderId, "preview_sent");

  const previewUrl = `${env.NEXT_PUBLIC_APP_URL}/preview/${previewToken}`;

  return { previewUrl, previewLink };
}
