import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import type { OrderRow } from "@/types/database";

import { PreviewLinksRepository } from "@/features/preview/repositories/preview-links.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";

import type { ApprovePreviewInput } from "@/schemas/studio-publish";

export async function approveBuyerPreview(
  input: ApprovePreviewInput,
): Promise<OrderRow> {
  const admin = createAdminClient();
  const previewRepo = new PreviewLinksRepository(admin);
  const experiencesRepo = new ExperiencesRepository(admin);
  const ordersRepo = new OrdersRepository(admin);

  const previewLink = await previewRepo.findActiveByToken(input.previewToken);
  if (!previewLink) {
    throw new NotFoundError("Preview link not found");
  }

  const experience = await experiencesRepo.findById(previewLink.experience_id);
  if (!experience) {
    throw new NotFoundError("Experience not found");
  }

  if (experience.content_locked_at) {
    throw new ValidationError("This experience is already published.");
  }

  return ordersRepo.updateStatus(experience.order_id, "approved");
}
