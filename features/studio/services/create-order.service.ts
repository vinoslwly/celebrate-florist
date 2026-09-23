import "server-only";

import { NotFoundError } from "@/lib/errors";
import { ThemesRepository } from "@/lib/repositories/themes.repository";

import { assertExperienceModeAllowedForTheme } from "@/features/studio/config/theme-mode-matrix";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import type { CreateOrderRpcResult } from "@/features/studio/repositories/orders.repository";
import { createPlaceholderMemoryKeyHash } from "@/features/studio/services/memory-code.service";

import type { CreateOrderInput } from "@/schemas/studio-orders";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createOrderWithExperience(
  client: SupabaseClient,
  input: CreateOrderInput,
): Promise<CreateOrderRpcResult> {
  const themesRepo = new ThemesRepository(client);
  const theme = await themesRepo.findById(input.themeId);
  if (!theme) {
    throw new NotFoundError("Theme not found");
  }
  assertExperienceModeAllowedForTheme(theme.slug, input.experienceMode);

  const ordersRepo = new OrdersRepository(client);

  return ordersRepo.createWithExperience({
    themeId: input.themeId,
    senderName: input.senderName,
    receiverName: input.receiverName,
    eventType: input.eventType,
    experienceMode: input.experienceMode,
    memoryKeyHash: createPlaceholderMemoryKeyHash(),
    buyerWhatsapp: input.buyerWhatsapp ?? null,
    adminNotes: input.adminNotes ?? null,
    scheduledDeliveryAt: input.scheduledDeliveryAt ?? null,
  });
}
