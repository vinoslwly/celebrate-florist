import type { ConnectionQuizSubmitResult } from "@/features/experience/types/connection-gate.types";

export type ConnectionUnlockSession = ConnectionQuizSubmitResult;

export function connectionUnlockStorageKey(experienceId: string): string {
  return `cf_connection_unlock_${experienceId}`;
}

export function readConnectionUnlockSession(
  experienceId: string,
): ConnectionUnlockSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(connectionUnlockStorageKey(experienceId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ConnectionUnlockSession;
  } catch {
    return null;
  }
}

export function writeConnectionUnlockSession(
  experienceId: string,
  session: ConnectionUnlockSession,
): void {
  sessionStorage.setItem(
    connectionUnlockStorageKey(experienceId),
    JSON.stringify(session),
  );
}
