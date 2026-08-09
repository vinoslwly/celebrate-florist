import type {
  PhotoboothLayoutId,
  PhotoboothStripPreset,
  PhotoboothThemeId,
} from "@/features/photobooth/lib/types";

/**
 * Bloom strip presets (Sprint 14.4 representative pack).
 * Procedural stand-ins until Founder strip artwork lands.
 * Layout B/K geometry stays in `layouts.ts` — these are visual skins only.
 */
export const BLOOM_STRIP_PRESETS: PhotoboothStripPreset[] = [
  {
    id: "bloom-soft",
    themeId: "bloom",
    label: "Bloom Soft",
    supportedLayouts: ["B", "K"],
    swatch: "#F7C9D4",
    background: "#FCE8EE",
    accent: "#C45B7A",
    accentSoft: "#E8A0B5",
    treatment: "soft",
  },
  {
    id: "bloom-petal",
    themeId: "bloom",
    label: "Bloom Petal",
    supportedLayouts: ["B", "K"],
    swatch: "#E891A8",
    background: "#F9DFE8",
    accent: "#B84466",
    accentSoft: "#F0B4C4",
    treatment: "petal",
  },
  {
    id: "bloom-ribbon",
    themeId: "bloom",
    label: "Bloom Ribbon",
    supportedLayouts: ["B", "K"],
    swatch: "#D46A88",
    background: "#FBE6ED",
    accent: "#A84566",
    accentSoft: "#E8A4B8",
    treatment: "ribbon",
  },
  {
    id: "bloom-classic",
    themeId: "bloom",
    label: "Bloom Classic",
    supportedLayouts: ["B", "K"],
    swatch: "#F3B7C8",
    background: "#FFF5F8",
    accent: "#C45B7A",
    accentSoft: "#F0C4D0",
    treatment: "classic",
  },
];

/** Future Warm/Sky packs register here — empty until 14.6. */
const THEME_STRIP_PACKS: Record<PhotoboothThemeId, PhotoboothStripPreset[]> = {
  bloom: BLOOM_STRIP_PRESETS,
  warm: [],
  sky: [],
};

export function getStripPresetsForTheme(
  themeId: PhotoboothThemeId,
): PhotoboothStripPreset[] {
  return THEME_STRIP_PACKS[themeId] ?? [];
}

export function getStripPresetById(
  themeId: PhotoboothThemeId,
  presetId: string,
): PhotoboothStripPreset | undefined {
  return getStripPresetsForTheme(themeId).find((p) => p.id === presetId);
}

export function getCompatibleStripPresets(
  themeId: PhotoboothThemeId,
  layoutId: PhotoboothLayoutId,
): PhotoboothStripPreset[] {
  return getStripPresetsForTheme(themeId).filter((p) =>
    p.supportedLayouts.includes(layoutId),
  );
}

export function resolveDefaultStripPreset(
  themeId: PhotoboothThemeId,
  layoutId: PhotoboothLayoutId,
  preferredId?: string,
): PhotoboothStripPreset | null {
  const compatible = getCompatibleStripPresets(themeId, layoutId);
  if (compatible.length === 0) return null;
  if (preferredId) {
    const preferred = compatible.find((p) => p.id === preferredId);
    if (preferred) return preferred;
  }
  return compatible[0] ?? null;
}
