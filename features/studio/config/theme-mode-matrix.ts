import { ValidationError } from "@/lib/errors";

import type { ExperienceMode } from "@/types/database";

import { EXPERIENCE_MODES } from "@/features/studio/config/experience-modes";

/**
 * Production Moments (Scene Engine) — orderable in Studio.
 * Lovey (bloom), Darling (warm), and Cloudie (sky) ship Moments only.
 */
const PRODUCTION_MOMENTS_THEME_SLUGS = ["bloom", "warm", "sky"] as const;

export function isProductionMomentsTheme(themeSlug: string): boolean {
  return (PRODUCTION_MOMENTS_THEME_SLUGS as readonly string[]).includes(
    themeSlug,
  );
}

export function getSelectableExperienceModes(themeSlug: string) {
  if (isProductionMomentsTheme(themeSlug)) {
    return EXPERIENCE_MODES.filter((mode) => mode.value === "moments");
  }
  return EXPERIENCE_MODES;
}

export function isExperienceModeAllowedForTheme(
  themeSlug: string,
  mode: ExperienceMode,
): boolean {
  if (isProductionMomentsTheme(themeSlug)) {
    return mode === "moments";
  }
  return true;
}

export function assertExperienceModeAllowedForTheme(
  themeSlug: string,
  mode: ExperienceMode,
): void {
  if (!isExperienceModeAllowedForTheme(themeSlug, mode)) {
    throw new ValidationError(
      "Lovey, Darling, and Cloudie currently support Moments only. Choose Moments.",
    );
  }
}
