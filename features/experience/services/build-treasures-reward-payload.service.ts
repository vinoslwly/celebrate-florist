import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  TreasuresRewardLetter,
  TreasuresRewardPayload,
} from "@/features/experience/types/treasures-gate.types";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { EnvelopeOpensRepository } from "@/features/treasures/repositories/envelope-opens.repository";
import { EnvelopesRepository } from "@/features/treasures/repositories/envelopes.repository";
import { isRewardEligible } from "@/features/treasures/services/compute-envelope-progress.service";

function mapExperienceToRewardLetter(
  experience: ExperienceRow,
): TreasuresRewardLetter {
  return {
    greetingName: experience.greeting_name,
    letterContent: experience.letter_content,
    letterClosing: experience.letter_closing,
    closingName: experience.closing_name,
  };
}

/**
 * Phase B Treasures reward — letter + signed gallery URLs (FD-T4).
 * Deliver only when all configured envelopes have been opened.
 * Completion is computed dynamically — no DB reward flags.
 */
export async function buildTreasuresRewardPayload(
  experience: ExperienceRow,
): Promise<TreasuresRewardPayload> {
  if (experience.experience_mode !== "treasures") {
    throw new ValidationError("This experience is not Treasures mode.");
  }

  if (experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  const admin = createAdminClient();
  const envelopesRepo = new EnvelopesRepository(admin);
  const opensRepo = new EnvelopeOpensRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);

  const [envelopes, openedSortOrders] = await Promise.all([
    envelopesRepo.findByExperienceId(experience.id),
    opensRepo.findOpenedSortOrdersByExperienceId(experience.id),
  ]);

  const envelopeSortOrders = envelopes.map((envelope) => envelope.sort_order);

  if (!isRewardEligible(envelopeSortOrders, openedSortOrders)) {
    throw new ValidationError(
      "Reward is available after all envelopes have been opened.",
    );
  }

  const photos = await photosRepo.findByExperienceId(experience.id);

  const signedPhotos: PublishedPhoto[] = await Promise.all(
    photos.map(async (photo) => ({
      ...photo,
      signedUrl: await createSignedReadUrl(
        admin,
        StorageBucket.EXPERIENCE_PHOTOS,
        photo.storage_path,
      ),
    })),
  );

  return {
    letter: mapExperienceToRewardLetter(experience),
    photos: signedPhotos,
  };
}
