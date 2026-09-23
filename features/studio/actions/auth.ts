"use server";

import { redirect } from "next/navigation";

import { validateActionInput, withActionHandler } from "@/lib/actions";
import { isAdminEmail } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";
import { auditLogger, securityLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import { STUDIO_LOGIN_FAILURE_MESSAGE } from "@/features/studio/config/auth-messages";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import {
  assertStudioLoginAllowed,
  recordStudioLoginFailure,
} from "@/features/studio/services/studio-login-throttle.service";
import { studioLoginSchema } from "@/schemas/studio-auth";

type LoginSuccess = {
  redirectTo: string;
};

/**
 * Authenticates the single admin via Supabase Auth.
 * Non-admin emails are signed out immediately after credential verification.
 *
 * All client-visible failures return STUDIO_LOGIN_FAILURE_MESSAGE.
 * securityLogger records the reason server-side without the password or email.
 */
export async function loginAction(
  input: unknown,
): Promise<ActionResult<LoginSuccess>> {
  return withActionHandler(async () => {
    const { email, password } = validateActionInput(studioLoginSchema, input);
    const emailHash = await assertStudioLoginAllowed(email);
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      await recordStudioLoginFailure(emailHash);
      securityLogger.warn("Admin login failed", {
        reason: error ? "rejected" : "no_user",
      });
      throw new UnauthorizedError(STUDIO_LOGIN_FAILURE_MESSAGE);
    }

    if (!isAdminEmail(data.user.email ?? "")) {
      await supabase.auth.signOut();
      await recordStudioLoginFailure(emailHash);
      securityLogger.warn("Non-admin login rejected", {
        userId: data.user.id,
        reason: "email_not_admin",
      });
      throw new UnauthorizedError(STUDIO_LOGIN_FAILURE_MESSAGE);
    }

    auditLogger.info("Admin login successful", { userId: data.user.id });
    return { redirectTo: STUDIO_ROUTES.home };
  });
}

/**
 * Destroys the Supabase session and redirects to the login page.
 */
export async function logoutAction(): Promise<ActionResult<never>> {
  return withActionHandler(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.auth.signOut();

    if (user) {
      auditLogger.info("Admin logout", { userId: user.id });
    }

    redirect(STUDIO_ROUTES.login);
  });
}
