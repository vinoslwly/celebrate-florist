import "server-only";

import { cookies } from "next/headers";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { SESSION_COOKIE_NAME } from "@/features/access/config/constants";
import { parseSessionCookieValue } from "@/features/access/services/client-metadata.service";
import { isWithinGracePeriod } from "@/features/access/services/grace-period.service";
import { isTrustedSessionValid } from "@/features/access/services/trusted-session.service";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

export type AccessGateStatus =
  "granted" | "memory_code_required" | "trust_cookie_required";

export type AccessGateResult = {
  status: AccessGateStatus;
  experience: ExperienceRow;
};

export type AccessRequestContext = {
  ip: string;
  userAgent: string;
  sessionCookieValue: string | null;
};

export async function getAccessRequestContext(): Promise<AccessRequestContext> {
  const { headers } = await import("next/headers");
  const headerStore = await headers();
  const cookieStore = await cookies();

  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";
  const userAgent = headerStore.get("user-agent") ?? "unknown";
  const sessionCookieValue =
    cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

  return { ip, userAgent, sessionCookieValue };
}

/**
 * Orchestrates grace period, trusted device sessions, and Memory Code gating.
 */
export async function evaluateAccessGate(
  client: SupabaseClient,
  experienceToken: string,
  context: AccessRequestContext,
): Promise<AccessGateResult> {
  const experiencesRepo = new ExperiencesRepository(client);
  const experience = await experiencesRepo.findByToken(experienceToken);

  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  if (experience.is_locked) {
    throw new ValidationError("This experience is temporarily locked.");
  }

  const parsedCookie = context.sessionCookieValue
    ? parseSessionCookieValue(context.sessionCookieValue)
    : null;

  if (
    parsedCookie &&
    parsedCookie.experienceId === experience.id &&
    (await isTrustedSessionValid(client, experience.id, parsedCookie.rawToken))
  ) {
    return { status: "granted", experience };
  }

  const inGrace = isWithinGracePeriod(experience.first_opened_at);

  if (inGrace) {
    return { status: "trust_cookie_required", experience };
  }

  return { status: "memory_code_required", experience };
}
