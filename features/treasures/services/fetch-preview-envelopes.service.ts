import "server-only";

import { NotFoundError } from "@/lib/errors";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { ExperienceEnvelopesRepository } from "@/features/treasures/repositories/experience-envelopes.repository";
import { mapToPreviewEnvelopeView } from "@/features/treasures/services/map-envelope-views.service";
import type { PreviewEnvelopeView } from "@/features/treasures/types";

/**
 * Buyer-preview-safe envelope fetch — full FD-T5 content for buyer approval.
 * No recipient open state; buyer sees message + photo as configured.
 */
export async function fetchPreviewEnvelopes(
  experienceId: string,
): Promise<PreviewEnvelopeView> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const envelopesRepo = new ExperienceEnvelopesRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience) {
    throw new NotFoundError("Experience not found");
  }

  if (experience.experience_mode !== "treasures") {
    throw new NotFoundError("Experience not found");
  }

  const [envelopes, photos] = await Promise.all([
    envelopesRepo.findEnvelopesByExperienceId(experienceId),
    photosRepo.findByExperienceId(experienceId),
  ]);

  const photosBySortOrder = new Map(
    photos.map((photo) => [photo.sort_order, photo]),
  );

  const referencedSortOrders = new Set<number>();
  for (const envelope of envelopes) {
    if (envelope.photo_sort_order !== null) {
      referencedSortOrders.add(envelope.photo_sort_order);
    }
  }

  const signedUrlsBySortOrder = new Map<number, string>();
  await Promise.all(
    [...referencedSortOrders].map(async (sortOrder) => {
      const photo = photosBySortOrder.get(sortOrder);
      if (!photo) {
        return;
      }

      signedUrlsBySortOrder.set(
        sortOrder,
        await createSignedReadUrl(
          admin,
          StorageBucket.EXPERIENCE_PHOTOS,
          photo.storage_path,
        ),
      );
    }),
  );

  return mapToPreviewEnvelopeView(
    envelopes,
    photosBySortOrder,
    signedUrlsBySortOrder,
  );
}
