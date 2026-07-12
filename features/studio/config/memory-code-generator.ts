import "server-only";

import { randomBytes } from "node:crypto";

/** Characters that are easy to read and type (no 0/O, 1/I/L). */
const MEMORY_CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Generates a human-friendly Memory Code for admin to share with the recipient.
 * Format: XXXX-XXXX (8 characters).
 */
export function generateReadableMemoryCode(): string {
  const bytes = randomBytes(8);
  let raw = "";

  for (let i = 0; i < 8; i += 1) {
    raw += MEMORY_CODE_CHARS[bytes[i]! % MEMORY_CODE_CHARS.length];
  }

  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}
