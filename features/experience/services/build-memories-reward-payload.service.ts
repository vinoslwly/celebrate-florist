import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  MemoriesRewardLetter,
  MemoriesRewardPayload,
} from "@/features/experience/types/memories-gate.types";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";

function mapExperienceToRewardLetter(
  experience: ExperienceRow,
): MemoriesRewardLetter {
  return {
    greetingName: experience.greeting_name,
    letterContent: experience.letter_content,
    letterClosing: experience.letter_closing,
    closingName: experience.closing_name,
  };
}

/**
 * Phase B Memories reward — unlock message, letter, signed gallery URLs (FD-M5).
 * Deliver only after valid match submit. Single orchestration point.
 */
export async function buildMemoriesRewardPayload(
  experience: ExperienceRow,
): Promise<MemoriesRewardPayload> {
  if (experience.experience_mode !== "memories") {
    throw new ValidationError("This experience is not Memories mode.");
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
    unlockMessage: experience.final_unlock_message?.trim() ?? "",
    letter: mapExperienceToRewardLetter(experience),
    photos: signedPhotos,
  };
}
