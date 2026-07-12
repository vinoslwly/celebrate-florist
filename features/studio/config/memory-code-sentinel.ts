/**
 * Bootstrap Memory Code sentinel — shared by server create flow and client UI status.
 * Precomputed SHA-256 of BOOTSTRAP_MEMORY_CODE_PLAINTEXT (must match server hash).
 */
export const BOOTSTRAP_MEMORY_CODE_PLAINTEXT =
  "CELEBRATE_BOOTSTRAP_UNSET_SPRINT06" as const;

export const BOOTSTRAP_MEMORY_KEY_SENTINEL =
  "ddba5256c97cd4322603ca9bc2b6ee0eb00cd565305d9a874edb2ef9dc004e8d";

export function createPlaceholderMemoryKeyHash(): string {
  return BOOTSTRAP_MEMORY_KEY_SENTINEL;
}

export function isPlaceholderMemoryKeyHash(hash: string): boolean {
  return hash === BOOTSTRAP_MEMORY_KEY_SENTINEL;
}

export function isBootstrapMemoryCodePlaintext(plainCode: string): boolean {
  return plainCode.trim() === BOOTSTRAP_MEMORY_CODE_PLAINTEXT;
}

/** False for bootstrap placeholder hashes — use before save and recipient verification. */
export function isMemoryKeyHashVerifiable(hash: string): boolean {
  return !isPlaceholderMemoryKeyHash(hash);
}
