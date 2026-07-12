import { z } from "zod";

import { nonEmptyStringSchema } from "@/schemas/common";

export const verifyMemoryCodeSchema = z.object({
  experienceToken: nonEmptyStringSchema.max(128),
  memoryCode: z.string().trim().min(4).max(64),
});

export type VerifyMemoryCodeInput = z.infer<typeof verifyMemoryCodeSchema>;
