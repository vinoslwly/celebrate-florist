import "server-only";

import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import type {
  ExperiencePhotoRow,
  ExperienceRow,
  ThemeRow,
} from "@/types/database";

import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

export type PublishedPhoto = ExperiencePhotoRow & {
  signedUrl: string;
};

export type PublishedExperiencePayload = {
  experience: ExperienceRow;
  theme: ThemeRow;
  photos: PublishedPhoto[];
};

export async function fetchPublishedExperience(
  experienceId: string,
): Promise<PublishedExperiencePayload> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);
  const themesRepo = new ThemesRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new Error("Experience not found");
  }

  const [theme, photos] = await Promise.all([
    themesRepo.findById(experience.theme_id),
    photosRepo.findByExperienceId(experienceId),
  ]);

  if (!theme) {
    throw new Error("Theme not found");
  }

  const signedPhotos = await Promise.all(
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
    experience,
    theme,
    photos: signedPhotos,
  };
}
