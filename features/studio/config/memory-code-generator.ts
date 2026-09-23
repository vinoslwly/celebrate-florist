import "server-only";

import { randomBytes } from "node:crypto";

import { MEMORY_CODE_PIN_LENGTH } from "@/schemas/studio-memory-code";

/**
 * Generates a 6-digit Memory Code PIN for admin to share with the recipient.
 */
export function generateReadableMemoryCode(): string {
  const bytes = randomBytes(MEMORY_CODE_PIN_LENGTH);
  let raw = "";

  for (let i = 0; i < MEMORY_CODE_PIN_LENGTH; i += 1) {
    raw += String(bytes[i]! % 10);
  }

  return raw;
}
