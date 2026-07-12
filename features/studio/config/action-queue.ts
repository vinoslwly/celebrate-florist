import type { OrderStatus } from "@/types/database";

/** Order statuses surfaced on the Dashboard action queue per 12_STUDIO_UX.md. */
export const ACTION_QUEUE_STATUSES = [
  "draft",
  "designing",
  "preview_sent",
  "approved",
  "ready",
] as const satisfies readonly OrderStatus[];

export const ACTION_QUEUE_STATUS_SET = new Set<string>(ACTION_QUEUE_STATUSES);
