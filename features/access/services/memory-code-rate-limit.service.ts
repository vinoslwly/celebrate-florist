import "server-only";

import { ForbiddenError } from "@/lib/errors";

import {
  MAX_MEMORY_CODE_ATTEMPTS_PER_HOUR,
  MAX_MEMORY_CODE_FAILURES_BEFORE_LOCK,
  MEMORY_CODE_RATE_LIMIT_WINDOW_MS,
} from "@/features/access/config/constants";
import { AccessAttemptsRepository } from "@/features/access/repositories/access-attempts.repository";
import { SecurityEventsRepository } from "@/features/access/repositories/security-events.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Locks the experience after too many failed Memory Code attempts.
 * The count is per experience and does not use the client IP.
 * Returns true when the experience is now locked.
 */
export async function lockExperienceIfMemoryCodeExhausted(
  client: SupabaseClient,
  experienceId: string,
  ipHash: string,
): Promise<boolean> {
  const attemptsRepo = new AccessAttemptsRepository(client);
  const failedCount = await attemptsRepo.countFailedAttempts(experienceId);

  if (failedCount < MAX_MEMORY_CODE_FAILURES_BEFORE_LOCK) {
    return false;
  }

  const experiencesRepo = new ExperiencesRepository(client);
  const lockedNow =
    await experiencesRepo.lockForMemoryCodeExhaustion(experienceId);

  if (lockedNow) {
    const securityRepo = new SecurityEventsRepository(client);
    await securityRepo.insertEvent({
      eventType: "experience_locked",
      experienceId,
      ipHash,
      metadata: { failedCount },
    });
  }

  return true;
}

export async function assertMemoryCodeAttemptsAllowed(
  client: SupabaseClient,
  experienceId: string,
  ipHash: string,
): Promise<void> {
  const attemptsRepo = new AccessAttemptsRepository(client);
  const sinceIso = new Date(
    Date.now() - MEMORY_CODE_RATE_LIMIT_WINDOW_MS,
  ).toISOString();

  const failedCount = await attemptsRepo.countFailedAttemptsSince(
    experienceId,
    ipHash,
    sinceIso,
  );

  if (failedCount >= MAX_MEMORY_CODE_ATTEMPTS_PER_HOUR) {
    const securityRepo = new SecurityEventsRepository(client);
    await securityRepo.insertEvent({
      eventType: "memory_key_exhausted",
      experienceId,
      ipHash,
      metadata: { failedCount },
    });

    throw new ForbiddenError(
      "Too many incorrect attempts. Please try again later.",
    );
  }
}

export async function recordMemoryCodeAttempt(
  client: SupabaseClient,
  params: {
    experienceId: string;
    ipHash: string;
    wasSuccessful: boolean;
  },
): Promise<void> {
  const attemptsRepo = new AccessAttemptsRepository(client);
  await attemptsRepo.insertAttempt(params);

  if (!params.wasSuccessful) {
    const securityRepo = new SecurityEventsRepository(client);
    await securityRepo.insertEvent({
      eventType: "memory_key_failed",
      experienceId: params.experienceId,
      ipHash: params.ipHash,
    });
  }
}
