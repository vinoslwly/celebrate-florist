import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { upsertAdminMemoryCodeInNotes } from "@/features/studio/config/memory-code-admin-ref";
import { generateReadableMemoryCode } from "@/features/studio/config/memory-code-generator";
import { isMemoryKeyHashVerifiable } from "@/features/studio/config/memory-code-sentinel";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { hashMemoryCode } from "@/features/studio/services/memory-code.service";

import type {
  MemoryCodeScopeInput,
  SetMemoryCodeInput,
} from "@/schemas/studio-memory-code";
import type { SupabaseClient } from "@supabase/supabase-js";

async function assertEditableExperience(
  client: SupabaseClient,
  input: MemoryCodeScopeInput,
): Promise<ExperienceRow> {
  const repo = new ExperiencesRepository(client);
  const existing = await repo.findById(input.experienceId);

  if (!existing || existing.order_id !== input.orderId) {
    throw new NotFoundError("Experience not found");
  }

  if (existing.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }

  return existing;
}

function hashAndValidateMemoryCode(plainCode: string): string {
  const memoryKeyHash = hashMemoryCode(plainCode);
  if (!isMemoryKeyHashVerifiable(memoryKeyHash)) {
    throw new ValidationError("Memory Code is not valid.");
  }
  return memoryKeyHash;
}

async function persistAdminMemoryCodeReference(
  client: SupabaseClient,
  orderId: string,
  memoryCode: string,
): Promise<void> {
  const ordersRepo = new OrdersRepository(client);
  const order = await ordersRepo.findById(orderId);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  const adminNotes = upsertAdminMemoryCodeInNotes(
    order.admin_notes,
    memoryCode,
  );
  await ordersRepo.updateAdminNotes(orderId, adminNotes);
}

export async function setMemoryCode(
  client: SupabaseClient,
  input: SetMemoryCodeInput,
): Promise<void> {
  await assertEditableExperience(client, input);
  const memoryKeyHash = hashAndValidateMemoryCode(input.memoryCode);
  const repo = new ExperiencesRepository(client);
  await repo.updateMemoryKeyHash(input.experienceId, memoryKeyHash);
  await persistAdminMemoryCodeReference(
    client,
    input.orderId,
    input.memoryCode,
  );
}

export async function generateMemoryCode(
  client: SupabaseClient,
  input: MemoryCodeScopeInput,
): Promise<{ memoryCode: string }> {
  await assertEditableExperience(client, input);

  const memoryCode = generateReadableMemoryCode();
  const memoryKeyHash = hashAndValidateMemoryCode(memoryCode);
  const repo = new ExperiencesRepository(client);
  await repo.updateMemoryKeyHash(input.experienceId, memoryKeyHash);
  await persistAdminMemoryCodeReference(client, input.orderId, memoryCode);

  return { memoryCode };
}
