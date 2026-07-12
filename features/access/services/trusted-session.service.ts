import "server-only";

import { SESSION_DURATION_MS } from "@/features/access/config/constants";
import { ExperienceSessionsRepository } from "@/features/access/repositories/experience-sessions.repository";
import {
  generateSessionToken,
  hashSessionToken,
} from "@/features/access/services/client-metadata.service";

import type { SupabaseClient } from "@supabase/supabase-js";

export type TrustedSessionResult = {
  rawToken: string;
  expiresAt: string;
};

export async function createTrustedSession(
  client: SupabaseClient,
  params: {
    experienceId: string;
    ipHash: string | null;
    userAgentHash: string | null;
  },
): Promise<TrustedSessionResult> {
  const repo = new ExperienceSessionsRepository(client);
  const rawToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  await repo.insertSession({
    experienceId: params.experienceId,
    sessionTokenHash,
    ipHash: params.ipHash,
    userAgentHash: params.userAgentHash,
    expiresAt,
  });

  return { rawToken, expiresAt };
}

export async function isTrustedSessionValid(
  client: SupabaseClient,
  experienceId: string,
  rawToken: string,
): Promise<boolean> {
  const repo = new ExperienceSessionsRepository(client);
  const session = await repo.findValidByTokenHash(
    experienceId,
    hashSessionToken(rawToken),
  );

  if (!session) {
    return false;
  }

  await repo.touchLastSeen(session.id);
  return true;
}
