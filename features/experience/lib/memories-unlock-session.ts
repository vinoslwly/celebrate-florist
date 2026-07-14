import type { MemoriesSubmitResult } from "@/features/experience/types/memories-gate.types";

export type MemoriesUnlockSession = MemoriesSubmitResult;

export function memoriesUnlockStorageKey(experienceId: string): string {
  return `cf_memories_unlock_${experienceId}`;
}

export function readMemoriesUnlockSession(
  experienceId: string,
): MemoriesUnlockSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(memoriesUnlockStorageKey(experienceId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MemoriesUnlockSession;
  } catch {
    return null;
  }
}

export function writeMemoriesUnlockSession(
  experienceId: string,
  session: MemoriesUnlockSession,
): void {
  sessionStorage.setItem(
    memoriesUnlockStorageKey(experienceId),
    JSON.stringify(session),
  );
}
