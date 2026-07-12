"use server";

import { cookies } from "next/headers";

import { validateActionInput, withActionHandler } from "@/lib/actions";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ActionResult } from "@/types/api";

import { SESSION_COOKIE_NAME } from "@/features/access/config/constants";
import { getAccessRequestContext } from "@/features/access/services/access-gate.service";
import {
  buildSessionCookieValue,
  hashClientIp,
  hashUserAgent,
} from "@/features/access/services/client-metadata.service";
import { verifyRecipientMemoryCode } from "@/features/access/services/verify-memory-code.service";
import { verifyMemoryCodeSchema } from "@/schemas/studio-access";

type VerifyMemoryCodeSuccess = {
  experienceId: string;
};

export async function verifyMemoryCodeAction(
  input: unknown,
): Promise<ActionResult<VerifyMemoryCodeSuccess>> {
  return withActionHandler(async () => {
    const data = validateActionInput(verifyMemoryCodeSchema, input);
    const context = await getAccessRequestContext();
    const admin = createAdminClient();

    const result = await verifyRecipientMemoryCode(admin, {
      experienceToken: data.experienceToken,
      memoryCode: data.memoryCode,
      ipHash: hashClientIp(context.ip),
      userAgentHash: hashUserAgent(context.userAgent),
    });

    const cookieStore = await cookies();
    cookieStore.set(
      SESSION_COOKIE_NAME,
      buildSessionCookieValue(result.experienceId, result.rawToken),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/e",
        expires: new Date(result.expiresAt),
      },
    );

    return { experienceId: result.experienceId };
  });
}
