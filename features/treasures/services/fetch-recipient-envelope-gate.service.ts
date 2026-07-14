import "server-only";

import { NotFoundError } from "@/lib/errors";
import { createAdminClient } from "@/lib/supabase/admin";

import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { EnvelopeOpensRepository } from "@/features/treasures/repositories/envelope-opens.repository";
import { EnvelopesRepository } from "@/features/treasures/repositories/envelopes.repository";
import { mapToRecipientEnvelopeGateView } from "@/features/treasures/services/map-envelope-views.service";
import type { RecipientEnvelopeGateView } from "@/features/treasures/types";

/**
 * Recipient-safe envelope gate fetch — shells and opened state only (A-4).
 * Call only after access gate is granted (page/action layer responsibility).
 */
export async function fetchRecipientEnvelopeGate(
  experienceId: string,
): Promise<RecipientEnvelopeGateView> {
  const admin = createAdminClient();
  const experiencesRepo = new ExperiencesRepository(admin);
  const envelopesRepo = new EnvelopesRepository(admin);
  const opensRepo = new EnvelopeOpensRepository(admin);

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience || experience.status !== "published") {
    throw new NotFoundError("Experience not found");
  }

  if (experience.experience_mode !== "treasures") {
    throw new NotFoundError("Experience not found");
  }

  const [envelopes, openedSortOrders] = await Promise.all([
    envelopesRepo.findByExperienceId(experienceId),
    opensRepo.findOpenedSortOrdersByExperienceId(experienceId),
  ]);

  return mapToRecipientEnvelopeGateView(envelopes, openedSortOrders);
}
