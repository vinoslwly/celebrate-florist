import "server-only";

import { createHash } from "node:crypto";

import { ConfigError, NotFoundError, ValidationError } from "@/lib/errors";

import { hasMemoryKeyPepper, serverEnv } from "@/config/env.server";

import {
  assertMemoryCodeAttemptsAllowed,
  lockExperienceIfMemoryCodeExhausted,
  recordMemoryCodeAttempt,
} from "@/features/access/services/memory-code-rate-limit.service";
import {
  createTrustedSession,
  type TrustedSessionResult,
} from "@/features/access/services/trusted-session.service";
import {
  isBootstrapMemoryCodePlaintext,
  isMemoryKeyHashVerifiable,
  isPlaceholderMemoryKeyHash,
} from "@/features/studio/config/memory-code-sentinel";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

function hashSubmittedMemoryCode(plainCode: string): string {
  if (isBootstrapMemoryCodePlaintext(plainCode)) {
    throw new ValidationError("Invalid Memory Code.");
  }

  if (!hasMemoryKeyPepper()) {
    throw new ConfigError("Memory Code verification is not configured.");
  }

  const pepper = serverEnv.MEMORY_KEY_PEPPER!;
  return createHash("sha256")
    .update(`${plainCode.trim()}:${pepper}`)
    .digest("hex");
}

export type VerifyMemoryCodeResult = TrustedSessionResult & {
  experienceId: string;
};

export async function verifyRecipientMemoryCode(
  client: SupabaseClient,
  params: {
    experienceToken: string;
    memoryCode: string;
    ipHash: string;
    userAgentHash: string | null;
  },
): Promise<VerifyMemoryCodeResult> {
  const experiencesRepo = new ExperiencesRepository(client);
  const experience = await experiencesRepo.findByToken(params.experienceToken);

  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  if (experience.is_locked) {
    throw new ValidationError("This experience is temporarily locked.");
  }

  if (!isMemoryKeyHashVerifiable(experience.memory_key_hash)) {
    throw new ValidationError("Memory Code is not configured for this gift.");
  }

  const alreadyExhausted = await lockExperienceIfMemoryCodeExhausted(
    client,
    experience.id,
    params.ipHash,
  );
  if (alreadyExhausted) {
    throw new ValidationError("This experience is temporarily locked.");
  }

  await assertMemoryCodeAttemptsAllowed(client, experience.id, params.ipHash);

  const submittedHash = hashSubmittedMemoryCode(params.memoryCode);
  const isValid =
    submittedHash === experience.memory_key_hash &&
    !isPlaceholderMemoryKeyHash(submittedHash);

  await recordMemoryCodeAttempt(client, {
    experienceId: experience.id,
    ipHash: params.ipHash,
    wasSuccessful: isValid,
  });

  if (!isValid) {
    await lockExperienceIfMemoryCodeExhausted(
      client,
      experience.id,
      params.ipHash,
    );
    throw new ValidationError("Incorrect Memory Code. Please try again.");
  }

  const session = await createTrustedSession(client, {
    experienceId: experience.id,
    ipHash: params.ipHash,
    userAgentHash: params.userAgentHash,
  });

  return {
    experienceId: experience.id,
    ...session,
  };
}
