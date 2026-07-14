import type { EnvelopeStudioConfig } from "@/features/treasures/types";
import {
  envelopeItemSchema,
  envelopesDraftArraySchema,
  type EnvelopeItemInput,
} from "@/schemas/studio-envelope";

export type EnvelopeDraftState = {
  envelopes: EnvelopeItemInput[];
};

export function envelopeStudioConfigToDraft(
  config: EnvelopeStudioConfig,
): EnvelopeDraftState {
  return {
    envelopes: config.envelopes.map((envelope) => ({
      sortOrder: envelope.sort_order,
      messageText: envelope.message_text,
      photoSortOrder: envelope.photo_sort_order,
      isFinal: envelope.is_final,
    })),
  };
}

export function createEmptyEnvelope(sortOrder: number): EnvelopeItemInput {
  return {
    sortOrder,
    messageText: null,
    photoSortOrder: null,
    isFinal: false,
  };
}

export function nextEnvelopeSortOrder(envelopes: EnvelopeItemInput[]): number {
  const used = new Set(envelopes.map((envelope) => envelope.sortOrder));

  for (let slot = 1; slot <= 6; slot += 1) {
    if (!used.has(slot)) {
      return slot;
    }
  }

  return 6;
}

export const ENVELOPE_INPUT_CLASS =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

const FRIENDLY_VALIDATION_MESSAGES: Record<string, string> = {
  "Each envelope must include a message, a photo, or both":
    "This envelope is empty. Add a message, a photo, or both.",
  "Exactly one envelope must be marked as final":
    "Exactly one envelope must be marked as Final.",
  "At least 2 envelopes are required":
    "At least two envelopes are required before publish.",
};

function friendlyMessage(message: string): string {
  return FRIENDLY_VALIDATION_MESSAGES[message] ?? message;
}

export function getEnvelopeCardValidation(
  envelope: EnvelopeItemInput,
): string | null {
  const result = envelopeItemSchema.safeParse(envelope);

  if (result.success) {
    return null;
  }

  const issue = result.error.issues[0];
  return issue
    ? friendlyMessage(issue.message)
    : "This envelope needs attention.";
}

export function getEnvelopeDraftValidation(
  envelopes: EnvelopeItemInput[],
): string | null {
  const result = envelopesDraftArraySchema.safeParse(envelopes);

  if (result.success) {
    return null;
  }

  const issue = result.error.issues[0];
  return issue
    ? friendlyMessage(issue.message)
    : "Please review your envelopes.";
}

export function countFinalEnvelopes(envelopes: EnvelopeItemInput[]): number {
  return envelopes.filter((envelope) => envelope.isFinal).length;
}
