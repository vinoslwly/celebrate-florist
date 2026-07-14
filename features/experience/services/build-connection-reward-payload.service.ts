import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  ConnectionRewardLetter,
  ConnectionRewardPayload,
} from "@/features/experience/types/connection-gate.types";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";

function mapExperienceToRewardLetter(
  experience: ExperienceRow,
): ConnectionRewardLetter {
  return {
    greetingName: experience.greeting_name,
    letterContent: experience.letter_content,
    letterClosing: experience.letter_closing,
    closingName: experience.closing_name,
  };
}

/**
 * Phase B Connection reward — letter + signed gallery URLs (CF-4).
 * Deliver only after successful quiz submit.
 */
export async function buildConnectionRewardPayload(
  experience: ExperienceRow,
): Promise<ConnectionRewardPayload> {
  if (experience.experience_mode !== "connection") {
    throw new ValidationError("This experience is not Connection mode.");
  }

  if (experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  const admin = createAdminClient();
  const photosRepo = new ExperiencePhotosRepository(admin);
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
