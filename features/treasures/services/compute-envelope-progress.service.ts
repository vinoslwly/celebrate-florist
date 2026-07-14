import "server-only";

import type { EnvelopeProgress } from "@/features/treasures/types";

/**
 * Dynamic completion — no DB flags (founder directive).
 * Reward unlocks when every configured envelope sort order has been opened (FD-T4).
 */
export function isRewardEligible(
  envelopeSortOrders: number[],
  openedSortOrders: number[],
): boolean {
  if (envelopeSortOrders.length === 0) {
    return false;
  }

  const opened = new Set(openedSortOrders);
  return envelopeSortOrders.every((sortOrder) => opened.has(sortOrder));
}

export function computeEnvelopeProgress(
  openedCount: number,
  envelopeCount: number,
  openedSortOrders: number[],
  envelopeSortOrders: number[],
): EnvelopeProgress {
  return {
    openedCount,
    envelopeCount,
    rewardEligible: isRewardEligible(envelopeSortOrders, openedSortOrders),
  };
}
