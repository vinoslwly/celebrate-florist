import type { Theme } from "@/types/theme";

export type ThemeSurface = "recipient" | "preview";

export function themeAccent(theme: Theme): string {
  return theme.presentation.accent;
}

export function themeAccentText(theme: Theme): string {
  return theme.presentation.accentText;
}

export function themePageAtmosphere(
  theme: Theme,
  surface: ThemeSurface,
): string {
  return surface === "recipient"
    ? theme.presentation.pageAtmosphereRecipient
    : theme.presentation.pageAtmospherePreview;
}

export function themeSurfaceTint(theme: Theme, surface: ThemeSurface): string {
  return surface === "recipient"
    ? (theme.presentation.surfaceTintRecipient ?? "bg-card")
    : (theme.presentation.surfaceTintPreview ?? "bg-card/90");
}

export function themeBorderTint(theme: Theme): string {
  return theme.presentation.borderTint ?? "border-border";
}

export function themeHaloClass(theme: Theme): string {
  const opacity = theme.presentation.haloOpacity ?? "opacity-20";
  return `${themeAccent(theme)} ${opacity}`;
}

/** Optional theme expression for Gift surfaces — CSS motif remains the fallback. */
export function themeGiftClasses(theme: Theme) {
  return {
    standardBorder: themeBorderTint(theme),
    accentText: themeAccentText(theme),
    ribbon: themeAccent(theme),
    finalBorder: "border-pink-ink/50",
    finalRing: "ring-pink-ink/25",
  };
}
