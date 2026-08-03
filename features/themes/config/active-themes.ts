import type { ThemeRow } from "@/types/database";

/**
 * Active V1 theme slugs — selectable for new orders in Studio.
 * FD-S12-22: release scope is Bloom · Warm · Sky only (Playful frozen).
 */
export const V1_ACTIVE_THEME_SLUGS = ["bloom", "warm", "sky"] as const;

/** Frozen — backward-compatible only; not offered for new orders. */
export const V1_FROZEN_THEME_SLUGS = ["pure", "play"] as const;

export type V1ActiveThemeSlug = (typeof V1_ACTIVE_THEME_SLUGS)[number];

/** Studio display labels — backend slugs unchanged. */
const STUDIO_DISPLAY_LABELS: Record<string, string> = {
  bloom: "Bloom",
  warm: "Warm",
  play: "Playful",
  sky: "Sky",
  pure: "Pure",
};

export function getThemeStudioDisplayLabel(
  slug: string,
  fallbackName: string,
): string {
  return STUDIO_DISPLAY_LABELS[slug] ?? fallbackName;
}

export function isThemeSelectableForNewOrders(slug: string): boolean {
  return (V1_ACTIVE_THEME_SLUGS as readonly string[]).includes(slug);
}

export function isThemeFrozen(slug: string): boolean {
  return (V1_FROZEN_THEME_SLUGS as readonly string[]).includes(slug);
}

/** Filters DB theme rows to the active V1 choices for new order creation. */
export function filterThemesForNewOrderSelection(
  themes: ThemeRow[],
): ThemeRow[] {
  return themes.filter((theme) => isThemeSelectableForNewOrders(theme.slug));
}
