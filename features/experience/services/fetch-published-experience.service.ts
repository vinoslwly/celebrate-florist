import "server-only";

import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import type {
  ExperiencePhotoRow,
  ExperiencePhotoboothStripRow,
  ExperienceRow,
  ThemeRow,
} from "@/types/database";

import { ExperiencePhotoboothStripsRepository } from "@/features/studio/repositories/experience-photobooth-strips.repository";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { listCatalogStrips } from "@/features/studio/services/list-catalog-strips.service";

export type PublishedPhoto = ExperiencePhotoRow & {
  signedUrl: string;
};

export type PublishedPhotoboothStrip = ExperiencePhotoboothStripRow & {
  signedUrl: string;
};

export type PublishedExperiencePayload = {
  experience: ExperienceRow;
  theme: ThemeRow;
  photos: PublishedPhoto[];
  photoboothStrips: PublishedPhotoboothStrip[];
  catalogPhotoboothStrips: PublishedPhotoboothStrip[];
};

export async function fetchPublishedExperience(
  experienceId: string,
): Promise<PublishedExperiencePayload> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);
  const stripsRepo = new ExperiencePhotoboothStripsRepository(admin);
  const themesRepo = new ThemesRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new Error("Experience not found");
  }

  const [theme, photos, strips, catalogStrips] = await Promise.all([
    themesRepo.findById(experience.theme_id),
    photosRepo.findByExperienceId(experienceId),
    stripsRepo.findByExperienceId(experienceId),
    listCatalogStrips(admin),
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

  const photoboothStrips = await Promise.all(
    strips.map(async (strip) => ({
      ...strip,
      signedUrl: await createSignedReadUrl(
        admin,
        StorageBucket.PHOTOBOOTH_STRIPS,
        strip.storage_path,
      ),
    })),
  );

  const catalogPhotoboothStrips: PublishedPhotoboothStrip[] = catalogStrips.map(
    (strip) => ({
      id: strip.id,
      experience_id: experience.id,
      storage_path: strip.storage_path,
      sort_order: strip.sort_order,
      layout_id: strip.layout_id,
      created_at: strip.created_at,
      signedUrl: strip.publicUrl,
    }),
  );

  return {
    experience,
    theme,
    photos: signedPhotos,
    photoboothStrips,
    catalogPhotoboothStrips,
  };
}
