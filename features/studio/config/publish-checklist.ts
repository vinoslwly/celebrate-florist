export type PublishChecklistItemStatus = "pass" | "fail" | "blocked";

export type PublishChecklistItem = {
  id: string;
  label: string;
  status: PublishChecklistItemStatus;
  message?: string;
};

export const MEMORIES_TREASURES_PUBLISH_BLOCKED_MESSAGE =
  "Publish for Memories and Treasures ships in Sprint 09A–09B. Moments and Connection are available now.";

/** @deprecated Use MEMORIES_TREASURES_PUBLISH_BLOCKED_MESSAGE — kept for imports. */
export const PREMIUM_PUBLISH_BLOCKED_MESSAGE =
  MEMORIES_TREASURES_PUBLISH_BLOCKED_MESSAGE;
