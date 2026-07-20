import type { Theme, ThemeAssetSlots } from "@/types/theme";

/** Safe accessors for optional theme artwork slots. */
export function themeAssetSlots(theme: Theme): ThemeAssetSlots {
  return theme.presentation.assets ?? {};
}

export function themeHeaderMotif(theme: Theme): string | undefined {
  return themeAssetSlots(theme).headerMotif;
}

export function themeAtmosphereAsset(theme: Theme): string | undefined {
  return themeAssetSlots(theme).atmosphereAsset;
}

export function themeCornerDecoration(theme: Theme): string | undefined {
  return themeAssetSlots(theme).cornerDecoration;
}

export function themeCompletionArtwork(theme: Theme): string | undefined {
  return themeAssetSlots(theme).completionArtwork;
}

export function themePhotoTreatment(theme: Theme): string | undefined {
  return themeAssetSlots(theme).photoTreatment;
}

/** Motif opacity hint from optional decorativeIntensity — low = quieter. */
export function themeDecorativeOpacity(theme: Theme): number {
  const intensity = theme.presentation.decorativeIntensity ?? "low";
  return intensity === "medium" ? 0.9 : 0.55;
}
