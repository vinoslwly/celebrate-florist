import { z } from "zod";

import { nonEmptyStringSchema } from "@/schemas/common";
import { memoryCodePinSchema } from "@/schemas/studio-memory-code";

export const verifyMemoryCodeSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
  memoryCode: memoryCodePinSchema,
});

export type VerifyMemoryCodeInput = z.infer<typeof verifyMemoryCodeSchema>;
