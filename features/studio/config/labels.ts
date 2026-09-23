import type { OrderStatus } from "@/types/database";

/** Marketing theme names used in Studio UI. Backend slugs stay bloom/warm/sky. */
const THEME_MARKETING_LABELS: Record<string, string> = {
  bloom: "Lovey",
  warm: "Darling",
  sky: "Cloudie",
  play: "Playful",
  pure: "Pure",
};

export function getThemeMarketingLabel(slug: string, fallback = slug): string {
  return THEME_MARKETING_LABELS[slug] ?? fallback;
}

export function formatStudioDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatStudioStatus(status: string): string {
  return status.replaceAll("_", " ");
}

export function studioStatusClassName(status: string): string {
  return `status status-${status.replaceAll("_", "-")}`;
}

export const ORDER_STATUS_FILTERS: { value: OrderStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "designing", label: "Designing" },
  { value: "preview_sent", label: "Preview sent" },
  { value: "approved", label: "Approved" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
];
