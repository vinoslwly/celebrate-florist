import "server-only";

import { createHash } from "node:crypto";

import { ConfigError, ValidationError } from "@/lib/errors";

import { hasMemoryKeyPepper, serverEnv } from "@/config/env.server";

import {
  isBootstrapMemoryCodePlaintext,
  isPlaceholderMemoryKeyHash,
} from "@/features/studio/config/memory-code-sentinel";

export { createPlaceholderMemoryKeyHash } from "@/features/studio/config/memory-code-sentinel";

/** Hash admin-entered Memory Code for storage in memory_key_hash. */
export function hashMemoryCode(plainCode: string): string {
  if (isBootstrapMemoryCodePlaintext(plainCode)) {
    throw new ValidationError("This value cannot be used as a Memory Code.");
  }

  if (!hasMemoryKeyPepper()) {
    throw new ConfigError(
      "MEMORY_KEY_PEPPER is not configured. Set it in .env.local to save Memory Code.",
    );
  }

  const pepper = serverEnv.MEMORY_KEY_PEPPER!;
  const hash = createHash("sha256")
    .update(`${plainCode.trim()}:${pepper}`)
    .digest("hex");

  if (isPlaceholderMemoryKeyHash(hash)) {
    throw new ValidationError("This Memory Code cannot be stored.");
  }

  return hash;
}
