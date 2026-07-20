import type { MatchStudioConfig } from "@/features/match/types";

import type { MatchPairInput } from "@/schemas/studio-match";

export type MatchDraftState = {
  pairs: MatchPairInput[];
  finalUnlockMessage: string | null;
};

export function matchStudioConfigToDraft(
  config: MatchStudioConfig,
): MatchDraftState {
  return {
    pairs: config.pairs.map((pair) => ({
      sortOrder: pair.sort_order,
      storyText: pair.story_text,
      photoSortOrder: pair.photo_sort_order,
    })),
    finalUnlockMessage: config.finalUnlockMessage,
  };
}

export function createEmptyPair(
  sortOrder: number,
  photoSortOrder: number,
): MatchPairInput {
  return {
    sortOrder,
    storyText: "",
    photoSortOrder,
  };
}

export function nextPairSortOrder(pairs: MatchPairInput[]): number {
  const used = new Set(pairs.map((pair) => pair.sortOrder));

  for (let slot = 1; slot <= 6; slot += 1) {
    if (!used.has(slot)) {
      return slot;
    }
  }

  return 6;
}

export function nextAvailablePhotoSlot(
  pairs: MatchPairInput[],
  uploadedSlots: number[],
): number {
  const used = new Set(pairs.map((pair) => pair.photoSortOrder));
  const sortedUploaded = [...uploadedSlots].sort((left, right) => left - right);

  for (const slot of sortedUploaded) {
    if (!used.has(slot)) {
      return slot;
    }
  }

  for (let slot = 1; slot <= 6; slot += 1) {
    if (!used.has(slot)) {
      return slot;
    }
  }

  return 1;
}
