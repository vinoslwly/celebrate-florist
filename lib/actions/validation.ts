import "server-only";

import { parseInput } from "@/lib/validation";

import type { ZodType } from "zod";

/**
 * Validates Server Action input. Re-exported here so actions import
 * from a single helpers module.
 */
export function validateActionInput<T>(schema: ZodType<T>, input: unknown): T {
  return parseInput(schema, input);
}
