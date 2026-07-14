import "server-only";

import { ValidationError } from "@/lib/errors";

import { mapExperienceMatchToValidationInput } from "@/features/match/services/map-experience-match.service";
import type {
  ExperienceMatch,
  MatchConfigValidationInput,
  MatchPairInsert,
} from "@/features/match/types";
import { MATCH_MAX_PAIRS, MATCH_MIN_PAIRS } from "@/schemas/studio-match";

function assertPairCountWithinMax(count: number): void {
  if (count > MATCH_MAX_PAIRS) {
    throw new ValidationError(
      `Match may have at most ${MATCH_MAX_PAIRS} pairs`,
    );
  }
}

function assertUniquePairSortOrders(pairs: MatchPairInsert[]): void {
  const seen = new Set<number>();

  for (const pair of pairs) {
    if (seen.has(pair.sortOrder)) {
      throw new ValidationError("Each story must have a unique sort order");
    }

    seen.add(pair.sortOrder);
  }
}

function assertUniquePhotoSortOrders(pairs: MatchPairInsert[]): void {
  const seen = new Set<number>();

  for (const pair of pairs) {
    if (seen.has(pair.photoSortOrder)) {
      throw new ValidationError("Each photo slot may only be used once (A-1)");
    }

    seen.add(pair.photoSortOrder);
  }
}

function assertMinimumPairCount(count: number): void {
  if (count < MATCH_MIN_PAIRS) {
    throw new ValidationError(
      `At least ${MATCH_MIN_PAIRS} match pairs are required`,
    );
  }
}

function assertFinalUnlockMessagePresent(
  finalUnlockMessage: string | null,
): void {
  if (!finalUnlockMessage?.trim()) {
    throw new ValidationError("Final unlock message is required");
  }
}

function assertPhotoSlotsOccupied(
  pairs: MatchPairInsert[],
  uploadedPhotoSortOrders: number[],
): void {
  const uploaded = new Set(uploadedPhotoSortOrders);

  for (const pair of pairs) {
    if (!uploaded.has(pair.photoSortOrder)) {
      throw new ValidationError(
        `Photo slot ${pair.photoSortOrder} must have an uploaded photo`,
      );
    }
  }
}

/**
 * Draft save validation — allows empty or partial configuration while building.
 * Does not require minimum pair count or final unlock message.
 */
export function validateMatchConfigDraft(
  config: MatchConfigValidationInput,
): void {
  assertPairCountWithinMax(config.pairs.length);

  if (config.pairs.length === 0) {
    return;
  }

  assertUniquePairSortOrders(config.pairs);
  assertUniquePhotoSortOrders(config.pairs);
}

/**
 * Publish validation — full Memories requirements (A-1, docs/03_DATABASE.md).
 * Requires occupied photo slots for every referenced `photoSortOrder`.
 */
export function validateMatchConfigPublish(
  config: MatchConfigValidationInput,
  uploadedPhotoSortOrders: number[],
): void {
  assertMinimumPairCount(config.pairs.length);
  assertPairCountWithinMax(config.pairs.length);
  assertUniquePairSortOrders(config.pairs);
  assertUniquePhotoSortOrders(config.pairs);
  assertFinalUnlockMessagePresent(config.finalUnlockMessage);
  assertPhotoSlotsOccupied(config.pairs, uploadedPhotoSortOrders);
}

export type MatchConfigEvaluation =
  { ok: true } | { ok: false; message: string };

/**
 * Non-throwing wrapper for publish checklist and UI feedback (Phase 5).
 */
export function evaluateMatchConfig(
  config: MatchConfigValidationInput,
  uploadedPhotoSortOrders: number[],
): MatchConfigEvaluation {
  try {
    validateMatchConfigPublish(config, uploadedPhotoSortOrders);
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, message: error.message };
    }

    throw error;
  }
}

export function evaluateExperienceMatch(
  match: ExperienceMatch,
  finalUnlockMessage: string | null,
  uploadedPhotoSortOrders: number[],
): MatchConfigEvaluation {
  return evaluateMatchConfig(
    mapExperienceMatchToValidationInput(match, finalUnlockMessage),
    uploadedPhotoSortOrders,
  );
}
