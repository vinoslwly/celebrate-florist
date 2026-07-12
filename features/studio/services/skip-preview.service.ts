import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { OrderRow } from "@/types/database";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";

import type { SkipPreviewInput } from "@/schemas/studio-publish";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Records explicit admin Skip Preview override by advancing order to approved.
 */
export async function skipPreviewOverride(
  client: SupabaseClient,
  input: SkipPreviewInput,
): Promise<OrderRow> {
  if (!input.confirmOverride) {
    throw new ValidationError("Skip Preview requires explicit confirmation.");
  }

  const ordersRepo = new OrdersRepository(client);
  const experiencesRepo = new ExperiencesRepository(client);

  const [order, experience] = await Promise.all([
    ordersRepo.findById(input.orderId),
    experiencesRepo.findById(input.experienceId),
  ]);

  if (!order || !experience || experience.order_id !== input.orderId) {
    throw new NotFoundError("Order or experience not found");
  }

  if (experience.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }

  return ordersRepo.updateStatus(input.orderId, "approved");
}
