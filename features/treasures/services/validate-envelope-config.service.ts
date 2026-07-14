import "server-only";

import { ValidationError } from "@/lib/errors";

import { mapExperienceEnvelopesToValidationInput } from "@/features/treasures/services/map-experience-envelopes.service";
import type {
  EnvelopeConfigEvaluation,
  EnvelopeConfigValidationInput,
  ExperienceEnvelopes,
} from "@/features/treasures/types";
import {
  envelopesDraftArraySchema,
  envelopesPublishArraySchema,
} from "@/schemas/studio-envelope";

function assertPhotoSlotsOccupied(
  envelopes: EnvelopeConfigValidationInput["envelopes"],
  uploadedPhotoSortOrders: number[],
): void {
  const uploaded = new Set(uploadedPhotoSortOrders);

  for (const envelope of envelopes) {
    if (
      envelope.photoSortOrder !== null &&
      !uploaded.has(envelope.photoSortOrder)
    ) {
      throw new ValidationError(
        `Photo slot ${envelope.photoSortOrder} must have an uploaded photo`,
      );
    }
  }
}

function parseSchemaError(error: { issues: { message: string }[] }): never {
  const message = error.issues[0]?.message ?? "Invalid envelope configuration";
  throw new ValidationError(message);
}

/**
 * Draft save validation — allows empty or partial configuration while building.
 * Does not require minimum envelope count or exactly one final envelope.
 */
export function validateEnvelopeConfigDraft(
  config: EnvelopeConfigValidationInput,
): void {
  const result = envelopesDraftArraySchema.safeParse(config.envelopes);
  if (!result.success) {
    parseSchemaError(result.error);
  }
}

/**
 * Publish validation — full Treasures requirements (2–6 envelopes, one final, FD-T5).
 * Requires occupied photo slots for every referenced `photoSortOrder`.
 */
export function validateEnvelopeConfigPublish(
  config: EnvelopeConfigValidationInput,
  uploadedPhotoSortOrders: number[],
): void {
  const result = envelopesPublishArraySchema.safeParse(config.envelopes);
  if (!result.success) {
    parseSchemaError(result.error);
  }

  assertPhotoSlotsOccupied(config.envelopes, uploadedPhotoSortOrders);
}

/**
 * Non-throwing wrapper for publish checklist and UI feedback (Phase 5).
 */
export function evaluateEnvelopeConfig(
  config: EnvelopeConfigValidationInput,
  uploadedPhotoSortOrders: number[],
): EnvelopeConfigEvaluation {
  try {
    validateEnvelopeConfigPublish(config, uploadedPhotoSortOrders);
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, message: error.message };
    }

    throw error;
  }
}

export function evaluateExperienceEnvelopes(
  envelopes: ExperienceEnvelopes,
  uploadedPhotoSortOrders: number[],
): EnvelopeConfigEvaluation {
  return evaluateEnvelopeConfig(
    mapExperienceEnvelopesToValidationInput(envelopes),
    uploadedPhotoSortOrders,
  );
}
