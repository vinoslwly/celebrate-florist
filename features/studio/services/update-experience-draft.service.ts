import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { isMemoryKeyHashVerifiable } from "@/features/studio/config/memory-code-sentinel";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { hashMemoryCode } from "@/features/studio/services/memory-code.service";

import type { UpdateExperienceDraftInput } from "@/schemas/studio-orders";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function updateExperienceDraft(
  client: SupabaseClient,
  input: UpdateExperienceDraftInput,
): Promise<ExperienceRow> {
  const repo = new ExperiencesRepository(client);
  const existing = await repo.findById(input.experienceId);

  if (!existing) {
    throw new NotFoundError("Experience not found");
  }

  if (existing.order_id !== input.orderId) {
    throw new NotFoundError("Experience not found");
  }

  if (existing.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }

  let memoryKeyHash: string | undefined;
  if (input.memoryCode) {
    memoryKeyHash = hashMemoryCode(input.memoryCode);
    if (!isMemoryKeyHashVerifiable(memoryKeyHash)) {
      throw new ValidationError("Memory Code is not valid.");
    }
  }

  return repo.updateDraft(input.experienceId, {
    greetingName: input.greetingName,
    closingName: input.closingName,
    letterContent: input.letterContent,
    letterClosing: input.letterClosing,
    quizTitle: input.quizTitle,
    memoryKeyHash,
  });
}
