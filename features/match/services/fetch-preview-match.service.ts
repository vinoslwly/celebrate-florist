import "server-only";

import { NotFoundError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import { mapToPreviewMatchView } from "@/features/match/services/map-match-views.service";
import type { PreviewMatchView } from "@/features/match/types";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

/**
 * Buyer-preview-safe match fetch — stories, photos, structure; no correct mappings (A-3).
 */
export async function fetchPreviewMatch(
  experienceId: string,
): Promise<PreviewMatchView> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const matchRepo = new ExperienceMatchRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience) {
    throw new NotFoundError("Experience not found");
  }

  if (experience.experience_mode !== "memories") {
    throw new NotFoundError("Experience not found");
  }

  const [match, photos] = await Promise.all([
    matchRepo.findCompleteByExperienceId(experienceId),
    photosRepo.findByExperienceId(experienceId),
  ]);

  return mapToPreviewMatchView(
    match.pairs,
    photos,
    experience.final_unlock_message,
  );
}
