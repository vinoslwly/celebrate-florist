"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import {
  generateMemoryCode,
  setMemoryCode,
} from "@/features/studio/services/set-memory-code.service";
import {
  memoryCodeScopeSchema,
  setMemoryCodeSchema,
} from "@/schemas/studio-memory-code";

export async function setMemoryCodeAction(
  input: unknown,
): Promise<ActionResult<{ saved: true }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(setMemoryCodeSchema, input);
    const supabase = await createClient();
    await setMemoryCode(supabase, data);

    auditLogger.info("Memory Code set", {
      experienceId: data.experienceId,
    });

    return { saved: true };
  });
}

export async function generateMemoryCodeAction(
  input: unknown,
): Promise<ActionResult<{ memoryCode: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(memoryCodeScopeSchema, input);
    const supabase = await createClient();
    const result = await generateMemoryCode(supabase, data);

    auditLogger.info("Memory Code generated", {
      experienceId: data.experienceId,
    });

    return { memoryCode: result.memoryCode };
  });
}
