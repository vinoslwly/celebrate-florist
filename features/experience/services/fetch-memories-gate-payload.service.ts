import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ExperiencePhotoRow, ExperienceRow } from "@/types/database";

import type {
  MemoriesGateExperience,
  MemoriesGateMatchView,
  MemoriesGatePayload,
  MemoriesGatePhotoOption,
} from "@/features/experience/types/memories-gate.types";
import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import { mapPairToRecipientStory } from "@/features/match/services/map-match-views.service";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

export function toMemoriesGateExperience(
  experience: ExperienceRow,
): MemoriesGateExperience {
  return {
    id: experience.id,
    greeting_name: experience.greeting_name,
    theme_id: experience.theme_id,
    experience_mode: "memories",
  };
}

async function mapPhotoToGateOption(
  photo: ExperiencePhotoRow,
  admin: ReturnType<typeof createAdminClient>,
): Promise<MemoriesGatePhotoOption> {
  return {
    sortOrder: photo.sort_order,
    caption: photo.caption,
    signedUrl: await createSignedReadUrl(
      admin,
      StorageBucket.EXPERIENCE_PHOTOS,
      photo.storage_path,
    ),
  };
}

async function buildMemoriesGateMatchView(
  experienceId: string,
  admin: ReturnType<typeof createAdminClient>,
): Promise<MemoriesGateMatchView> {
  const matchRepo = new ExperienceMatchRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);

  const [match, photos] = await Promise.all([
    matchRepo.findCompleteByExperienceId(experienceId),
    photosRepo.findByExperienceId(experienceId),
  ]);

  const photoOptions = await Promise.all(
    photos.map((photo) => mapPhotoToGateOption(photo, admin)),
  );

  return {
    stories: match.pairs.map(mapPairToRecipientStory),
    photoOptions,
  };
}

/**
 * Phase A Memories payload — header/theme + match game only (gate/reward split).
 * Call only after access gate is granted.
 */
export async function fetchMemoriesGatePayload(
  experienceId: string,
): Promise<MemoriesGatePayload> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const themesRepo = new ThemesRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  if (experience.experience_mode !== "memories") {
    throw new ValidationError("This experience is not Memories mode.");
  }

  const theme = await themesRepo.findById(experience.theme_id);
  if (!theme) {
    throw new NotFoundError("Experience not found");
  }

  const match = await buildMemoriesGateMatchView(experienceId, admin);

  return {
    experience: toMemoriesGateExperience(experience),
    theme,
    match,
  };
}
