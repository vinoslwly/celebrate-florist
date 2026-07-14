import type { ExperienceEnvelopeRow } from "@/types/database";

import type { EnvelopeInsert } from "@/features/treasures/repositories/envelopes.repository";
import type {
  EnvelopeConfigValidationInput,
  ExperienceEnvelopes,
} from "@/features/treasures/types";

export function mapEnvelopeRowToInsert(
  envelope: ExperienceEnvelopeRow,
): EnvelopeInsert {
  return {
    sortOrder: envelope.sort_order,
    messageText: envelope.message_text,
    photoSortOrder: envelope.photo_sort_order,
    isFinal: envelope.is_final,
  };
}

export function mapExperienceEnvelopesToValidationInput(
  envelopes: ExperienceEnvelopes,
): EnvelopeConfigValidationInput {
  return {
    envelopes: envelopes.envelopes.map(mapEnvelopeRowToInsert),
  };
}
