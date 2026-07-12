import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAdminUser } from "@/lib/auth";
import { StorageBucket } from "@/lib/storage/buckets";
import { createAdminClient } from "@/lib/supabase/admin";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

type RouteContext = {
  params: Promise<{ experienceId: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  await requireAdminUser();

  const { experienceId } = await context.params;
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const experience = await experiencesRepo.findById(experienceId);

  if (
    !experience ||
    experience.order_id !== orderId ||
    !experience.qr_storage_path
  ) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  const { data, error } = await admin.storage
    .from(StorageBucket.EXPERIENCE_QR)
    .download(experience.qr_storage_path);

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to load QR image from storage" },
      { status: 500 },
    );
  }

  const buffer = await data.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="celebrate-qr-${experience.order_id.slice(0, 8)}.png"`,
      "Cache-Control": "private, no-store",
    },
  });
}
