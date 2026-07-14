import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ExperienceRow } from "@/types/database";

import type {
  TreasuresGateExperience,
  TreasuresGatePayload,
} from "@/features/experience/types/treasures-gate.types";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { fetchRecipientEnvelopeGate } from "@/features/treasures/services/fetch-recipient-envelope-gate.service";

export function toTreasuresGateExperience(
  experience: ExperienceRow,
): TreasuresGateExperience {
  return {
    id: experience.id,
    greeting_name: experience.greeting_name,
    theme_id: experience.theme_id,
    experience_mode: "treasures",
  };
}

/**
 * Phase A Treasures payload — header/theme + envelope shells only (gate/reward split).
 * Call only after access gate is granted.
 */
export async function fetchTreasuresGatePayload(
  experienceId: string,
): Promise<TreasuresGatePayload> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const themesRepo = new ThemesRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  if (experience.experience_mode !== "treasures") {
    throw new ValidationError("This experience is not Treasures mode.");
  }

  const theme = await themesRepo.findById(experience.theme_id);
  if (!theme) {
    throw new NotFoundError("Experience not found");
  }

  const envelopes = await fetchRecipientEnvelopeGate(experienceId);

  return {
    experience: toTreasuresGateExperience(experience),
    theme,
    envelopes,
  };
}
