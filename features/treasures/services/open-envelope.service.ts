import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";

import type {
  ExperienceEnvelopeRow,
  ExperiencePhotoRow,
} from "@/types/database";

import {
  evaluateAccessGate,
  type AccessRequestContext,
} from "@/features/access/services/access-gate.service";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { EnvelopeOpensRepository } from "@/features/treasures/repositories/envelope-opens.repository";
import { EnvelopesRepository } from "@/features/treasures/repositories/envelopes.repository";
import { computeEnvelopeProgress } from "@/features/treasures/services/compute-envelope-progress.service";
import type {
  OpenEnvelopeResult,
  RecipientEnvelopeContent,
  RecipientEnvelopePhoto,
} from "@/features/treasures/types";

import type { OpenEnvelopeInput } from "@/schemas/envelope-recipient";
import type { SupabaseClient } from "@supabase/supabase-js";

async function mapEnvelopeToRecipientContent(
  client: SupabaseClient,
  envelope: ExperienceEnvelopeRow,
  photosRepo: ExperiencePhotosRepository,
): Promise<RecipientEnvelopeContent> {
  let photo: RecipientEnvelopePhoto | null = null;

  if (envelope.photo_sort_order !== null) {
    const photos = await photosRepo.findByExperienceId(envelope.experience_id);
    const photoRow = photos.find(
      (row) => row.sort_order === envelope.photo_sort_order,
    );

    if (photoRow) {
      photo = await mapPhotoToRecipientEnvelopePhoto(client, photoRow);
    }
  }

  return {
    sortOrder: envelope.sort_order,
    messageText: envelope.message_text,
    photo,
  };
}

async function mapPhotoToRecipientEnvelopePhoto(
  client: SupabaseClient,
  photo: ExperiencePhotoRow,
): Promise<RecipientEnvelopePhoto> {
  return {
    sortOrder: photo.sort_order,
    caption: photo.caption,
    signedUrl: await createSignedReadUrl(
      client,
      StorageBucket.EXPERIENCE_PHOTOS,
      photo.storage_path,
    ),
  };
}

/**
 * Per-envelope open (A-4) — records progress idempotently and returns envelope content.
 * FD-T1: any order. FD-T3: revisit does not duplicate open rows.
 * Signed URLs may be regenerated on revisit.
 */
export async function openEnvelope(
  client: SupabaseClient,
  input: OpenEnvelopeInput,
  context: AccessRequestContext,
): Promise<OpenEnvelopeResult> {
  const gate = await evaluateAccessGate(client, input.experienceToken, context);

  if (gate.status !== "granted") {
    throw new ValidationError(
      "Complete access verification before opening envelopes.",
    );
  }

  if (gate.experience.experience_mode !== "treasures") {
    throw new ValidationError("This experience does not include envelopes.");
  }

  const experienceId = gate.experience.id;
  const envelopesRepo = new EnvelopesRepository(client);
  const opensRepo = new EnvelopeOpensRepository(client);
  const photosRepo = new ExperiencePhotosRepository(client);

  const [envelope, allEnvelopes, openedSortOrdersBefore] = await Promise.all([
    envelopesRepo.findByExperienceAndSortOrder(experienceId, input.sortOrder),
    envelopesRepo.findByExperienceId(experienceId),
    opensRepo.findOpenedSortOrdersByExperienceId(experienceId),
  ]);

  if (!envelope) {
    throw new NotFoundError("Envelope not found");
  }

  const wasAlreadyOpened = openedSortOrdersBefore.includes(input.sortOrder);

  await opensRepo.recordOpen(experienceId, input.sortOrder);

  const openedSortOrders = wasAlreadyOpened
    ? openedSortOrdersBefore
    : [...openedSortOrdersBefore, input.sortOrder].sort(
        (left, right) => left - right,
      );

  const envelopeSortOrders = allEnvelopes.map((row) => row.sort_order);
  const progress = computeEnvelopeProgress(
    openedSortOrders.length,
    envelopeSortOrders.length,
    openedSortOrders,
    envelopeSortOrders,
  );

  const content = await mapEnvelopeToRecipientContent(
    client,
    envelope,
    photosRepo,
  );

  return {
    content,
    progress,
    wasAlreadyOpened,
  };
}
