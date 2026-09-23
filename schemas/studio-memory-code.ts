import { z } from "zod";

import { uuidSchema } from "@/schemas/common";

/** Recipient PIN length — Studio save/generate must match this. */
export const MEMORY_CODE_PIN_LENGTH = 6;

export const memoryCodePinSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Memory Code must be exactly 6 digits");

export const memoryCodeScopeSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
});

export type MemoryCodeScopeInput = z.infer<typeof memoryCodeScopeSchema>;

export const setMemoryCodeSchema = memoryCodeScopeSchema.extend({
  memoryCode: memoryCodePinSchema,
});

export type SetMemoryCodeInput = z.infer<typeof setMemoryCodeSchema>;
