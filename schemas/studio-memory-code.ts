import { z } from "zod";

import { uuidSchema } from "@/schemas/common";

export const memoryCodeScopeSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
});

export type MemoryCodeScopeInput = z.infer<typeof memoryCodeScopeSchema>;

export const setMemoryCodeSchema = memoryCodeScopeSchema.extend({
  memoryCode: z.string().trim().min(4).max(64),
});

export type SetMemoryCodeInput = z.infer<typeof setMemoryCodeSchema>;
