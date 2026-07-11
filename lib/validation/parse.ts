import { ValidationError } from "@/lib/errors";

import type { ZodType } from "zod";

/**
 * Parses input against a Zod schema or throws ValidationError.
 * Server Actions should use this at the top of every mutation.
 */
export function parseInput<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new ValidationError(details);
  }

  return result.data;
}
