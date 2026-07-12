import "server-only";

import { createHash, randomBytes } from "node:crypto";

/** Hashes client IP for access_attempts and session rows. */
export function hashClientIp(ip: string): string {
  return createHash("sha256").update(ip.trim()).digest("hex");
}

/** Hashes user agent for session fingerprinting. */
export function hashUserAgent(userAgent: string): string {
  return createHash("sha256").update(userAgent.trim()).digest("hex");
}

/** Generates a raw session token for trusted device cookies. */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/** Stores only the hash of session tokens in experience_sessions. */
export function hashSessionToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/** Cookie payload format: `{experienceId}.{rawToken}` */
export function buildSessionCookieValue(
  experienceId: string,
  rawToken: string,
): string {
  return `${experienceId}.${rawToken}`;
}

export function parseSessionCookieValue(
  value: string,
): { experienceId: string; rawToken: string } | null {
  const dotIndex = value.indexOf(".");
  if (dotIndex <= 0) {
    return null;
  }

  const experienceId = value.slice(0, dotIndex);
  const rawToken = value.slice(dotIndex + 1);

  if (!experienceId || !rawToken) {
    return null;
  }

  return { experienceId, rawToken };
}
