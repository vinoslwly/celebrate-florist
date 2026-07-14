export type PublishChecklistItemStatus = "pass" | "fail" | "blocked";

export type PublishChecklistItem = {
  id: string;
  label: string;
  status: PublishChecklistItemStatus;
  message?: string;
};
