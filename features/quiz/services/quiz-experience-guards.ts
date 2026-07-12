import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";

import type { ExperienceRow } from "@/types/database";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertQuizExperienceOwnership(
  client: SupabaseClient,
  orderId: string,
  experienceId: string,
): Promise<ExperienceRow> {
  const repo = new ExperiencesRepository(client);
  const experience = await repo.findById(experienceId);

  if (!experience || experience.order_id !== orderId) {
    throw new NotFoundError("Experience not found");
  }

  return experience;
}

export function assertQuizExperienceEditable(experience: ExperienceRow): void {
  if (experience.content_locked_at) {
    throw new ValidationError("Published experiences cannot be edited");
  }
}

export function assertConnectionMode(experience: ExperienceRow): void {
  if (experience.experience_mode !== "connection") {
    throw new ValidationError(
      "Quiz configuration is only available for Connection mode",
    );
  }
}
