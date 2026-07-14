import "server-only";

import { NotFoundError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import { mapToRecipientMatchView } from "@/features/match/services/map-match-views.service";
import type { RecipientMatchView } from "@/features/match/types";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

/**
 * Recipient-safe match fetch — strips `photo_sort_order` via mapToRecipientMatchView.
 * Call only after access gate is granted (page/action layer responsibility).
 */
export async function fetchRecipientMatch(
  experienceId: string,
): Promise<RecipientMatchView> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const matchRepo = new ExperienceMatchRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  if (experience.experience_mode !== "memories") {
    throw new NotFoundError("Experience not found");
  }

  const [match, photos] = await Promise.all([
    matchRepo.findCompleteByExperienceId(experienceId),
    photosRepo.findByExperienceId(experienceId),
  ]);

  return mapToRecipientMatchView(match.pairs, photos);
}
