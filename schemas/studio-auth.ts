import { z } from "zod";

import { emailSchema } from "@/schemas/common";

export const studioLoginSchema = z.object({
  email: emailSchema,
  // Presence only. Password strength is a Supabase Auth Dashboard control.
  password: z.string().min(1, "Password is required"),
});

export type StudioLoginInput = z.infer<typeof studioLoginSchema>;
