/** Admin-only reference line stored in orders.admin_notes — not the security hash. */
export const MEMORY_CODE_ADMIN_PREFIX = "[Memory Code]";

const MEMORY_CODE_ADMIN_LINE = /^\[Memory Code\]\s+(.+)$/m;

export function extractAdminMemoryCode(
  adminNotes: string | null | undefined,
): string | null {
  if (!adminNotes) {
    return null;
  }

  const match = adminNotes.match(MEMORY_CODE_ADMIN_LINE);
  return match?.[1]?.trim() ?? null;
}

export function upsertAdminMemoryCodeInNotes(
  existingNotes: string | null | undefined,
  code: string,
): string {
  const line = `${MEMORY_CODE_ADMIN_PREFIX} ${code.trim()}`;
  const notes = existingNotes?.trim() ?? "";

  if (!notes) {
    return line;
  }

  if (MEMORY_CODE_ADMIN_LINE.test(notes)) {
    return notes.replace(MEMORY_CODE_ADMIN_LINE, line);
  }

  return `${notes}\n${line}`;
}
