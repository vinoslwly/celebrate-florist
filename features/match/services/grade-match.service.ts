import "server-only";

import { ValidationError } from "@/lib/errors";

import type { MatchPairRow } from "@/types/database";

import type {
  MatchAnswerSubmission,
  MatchGradeResult,
} from "@/features/match/types";

type GradablePair = {
  sortOrder: number;
  photoSortOrder: number;
};

/**
 * Pure batch grading — compares submitted photo selections to stored mappings.
 * Stateless; answers are not persisted (A-2).
 * FD-M5: finalUnlockMessage always returned on valid submit — score never blocks reward.
 */
export function gradeMatchAnswers(
  pairs: MatchPairRow[],
  answers: MatchAnswerSubmission[],
  finalUnlockMessage: string | null,
): MatchGradeResult {
  if (pairs.length === 0) {
    throw new ValidationError("Match has no pairs");
  }

  if (answers.length !== pairs.length) {
    throw new ValidationError("All stories must be matched before submitting");
  }

  const pairMap = new Map<number, GradablePair>(
    pairs.map((pair) => [
      pair.sort_order,
      {
        sortOrder: pair.sort_order,
        photoSortOrder: pair.photo_sort_order,
      },
    ]),
  );
  const answeredStorySortOrders = new Set<number>();
  let correctCount = 0;

  for (const answer of answers) {
    if (answeredStorySortOrders.has(answer.storySortOrder)) {
      throw new ValidationError("Duplicate answer for the same story");
    }

    answeredStorySortOrders.add(answer.storySortOrder);

    const pair = pairMap.get(answer.storySortOrder);
    if (!pair) {
      throw new ValidationError("Submission includes an unknown story");
    }

    if (answer.selectedPhotoSortOrder === pair.photoSortOrder) {
      correctCount += 1;
    }
  }

  for (const pair of pairs) {
    if (!answeredStorySortOrders.has(pair.sort_order)) {
      throw new ValidationError(
        "All stories must be matched before submitting",
      );
    }
  }

  const allCorrect = correctCount === pairs.length;
  const trimmedUnlockMessage = finalUnlockMessage?.trim() ?? null;

  return {
    allCorrect,
    correctCount,
    totalPairs: pairs.length,
    finalUnlockMessage: trimmedUnlockMessage,
  };
}
