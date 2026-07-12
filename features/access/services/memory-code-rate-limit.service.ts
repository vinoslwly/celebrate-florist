import "server-only";

import { ForbiddenError } from "@/lib/errors";

import {
  MAX_MEMORY_CODE_ATTEMPTS_PER_HOUR,
  MEMORY_CODE_RATE_LIMIT_WINDOW_MS,
} from "@/features/access/config/constants";
import { AccessAttemptsRepository } from "@/features/access/repositories/access-attempts.repository";
import { SecurityEventsRepository } from "@/features/access/repositories/security-events.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

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
