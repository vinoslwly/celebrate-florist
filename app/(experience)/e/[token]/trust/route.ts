import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import { SESSION_COOKIE_NAME } from "@/features/access/config/constants";
import {
  buildSessionCookieValue,
  hashClientIp,
  hashUserAgent,
} from "@/features/access/services/client-metadata.service";
import { isWithinGracePeriod } from "@/features/access/services/grace-period.service";
import { createTrustedSession } from "@/features/access/services/trusted-session.service";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

type RouteContext = {
  params: Promise<{ token: string }>;
};

/**
 * Registers a trusted device cookie during the grace period.
 * Next.js only allows cookie writes in Route Handlers or Server Actions —
 * not in Server Component pages.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { token } = await context.params;
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);

  const experience = await experiencesRepo.findByToken(token);
  if (!experience || experience.status !== "published") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (experience.is_locked) {
    return NextResponse.redirect(new URL(`/e/${token}`, request.url));
  }

  if (!isWithinGracePeriod(experience.first_opened_at)) {
    return NextResponse.redirect(new URL(`/e/${token}`, request.url));
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  try {
    const session = await createTrustedSession(admin, {
      experienceId: experience.id,
      ipHash: hashClientIp(ip),
      userAgentHash: hashUserAgent(userAgent),
    });

    const response = NextResponse.redirect(new URL(`/e/${token}`, request.url));
    response.cookies.set(
      SESSION_COOKIE_NAME,
      buildSessionCookieValue(experience.id, session.rawToken),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/e",
        expires: new Date(session.expiresAt),
      },
    );

    return response;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      return NextResponse.redirect(new URL(`/e/${token}`, request.url));
    }
    throw error;
  }
}
