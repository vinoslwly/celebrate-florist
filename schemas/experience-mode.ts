import { z } from "zod";

import type { ExperienceMode } from "@/types/database";

export const experienceModeSchema = z.enum([
  "moments",
  "connection",
  "memories",
  "treasures",
]) satisfies z.ZodType<ExperienceMode>;

export type ExperienceModeInput = z.infer<typeof experienceModeSchema>;
