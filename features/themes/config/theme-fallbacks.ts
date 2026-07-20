import type { Theme, ThemePresentation } from "@/types/theme";

/**
 * Neutral Celebrate-safe defaults for missing optional presentation fields.
 * Not Bloom-specific — avoids leaking pink identity into other themes.
 */
export const THEME_PRESENTATION_DEFAULTS: ThemePresentation = {
  accent: "bg-secondary",
  accentText: "text-foreground",
  pageAtmosphereRecipient:
    "bg-gradient-to-b from-background via-warmwhite to-muted/40",
  pageAtmospherePreview: "bg-muted/20",
  surfaceTintRecipient: "bg-card",
  surfaceTintPreview: "bg-card/90",
  borderTint: "border-border",
  haloOpacity: "opacity-15",
  assets: {},
  decorativeIntensity: "low",
};

export function mergeThemePresentation(
  partial?: Partial<ThemePresentation>,
): ThemePresentation {
  return {
    ...THEME_PRESENTATION_DEFAULTS,
    ...partial,
    assets: {
      ...THEME_PRESENTATION_DEFAULTS.assets,
      ...partial?.assets,
    },
  };
}

/** Ensures every theme has a complete, safe presentation contract. */
export function withThemePresentationFallbacks(theme: Theme): Theme {
  const presentation = mergeThemePresentation(theme.presentation);
  const accent = presentation.accent || theme.accentClassName;

  return {
    ...theme,
    accentClassName: accent,
    presentation: {
      ...presentation,
      accent,
    },
  };
}

/** Resolver fallback when slug is unknown — neutral, not Bloom. */
export const NEUTRAL_UNKNOWN_THEME: Theme = withThemePresentationFallbacks({
  id: "__neutral__",
  name: "Celebrate",
  emoji: "🎁",
  feeling: "Gift",
  flower: "",
  accentClassName: "bg-secondary",
  presentation: mergeThemePresentation(),
});
