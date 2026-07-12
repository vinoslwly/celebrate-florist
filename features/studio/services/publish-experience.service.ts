import "server-only";

import { NotFoundError } from "@/lib/errors";
import {
  StorageBucket,
  buildExperienceQrPath,
  generateQrPngBuffer,
  uploadStorageObject,
} from "@/lib/storage";

import type { ExperienceRow } from "@/types/database";

import { env } from "@/config/env";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { assertPublishAllowed } from "@/features/studio/services/publish-validation.service";

import type { PublishExperienceInput } from "@/schemas/studio-publish";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PublishExperienceResult = {
  experience: ExperienceRow;
  recipientUrl: string;
  qrStoragePath: string;
};

export async function publishExperience(
  client: SupabaseClient,
  input: PublishExperienceInput,
): Promise<PublishExperienceResult> {
  const ordersRepo = new OrdersRepository(client);
  const experiencesRepo = new ExperiencesRepository(client);

  const [order, experience] = await Promise.all([
    ordersRepo.findById(input.orderId),
    experiencesRepo.findById(input.experienceId),
  ]);

  if (!order || !experience || experience.order_id !== input.orderId) {
    throw new NotFoundError("Order or experience not found");
  }

  await assertPublishAllowed(client, order, experience, {
    skipPreview: input.skipPreview,
  });

  const now = new Date().toISOString();
  const recipientUrl = `${env.NEXT_PUBLIC_APP_URL}/e/${experience.experience_token}`;
  const qrBuffer = await generateQrPngBuffer(recipientUrl);
  const qrStoragePath = buildExperienceQrPath(experience.id);

  await uploadStorageObject(
    client,
    StorageBucket.EXPERIENCE_QR,
    qrStoragePath,
    qrBuffer,
    { contentType: "image/png", upsert: true },
  );

  const published = await experiencesRepo.publishExperience(experience.id, {
    qrStoragePath,
    contentLockedAt: now,
    publishedAt: now,
  });

  await ordersRepo.updateStatus(input.orderId, "ready");

  return {
    experience: published,
    recipientUrl,
    qrStoragePath,
  };
}
