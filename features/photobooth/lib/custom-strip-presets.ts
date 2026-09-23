import type {
  PhotoboothLayoutId,
  PhotoboothStripPreset,
  PhotoboothThemeId,
} from "@/features/photobooth/lib/types";

export type CustomStripInput = {
  id: string;
  layoutId: PhotoboothLayoutId;
  frameSrc: string;
  sortOrder: number;
};

export function customStripsToPresets(
  themeId: PhotoboothThemeId,
  strips: CustomStripInput[],
): PhotoboothStripPreset[] {
  return strips.map((strip) => ({
    id: strip.id,
    themeId,
    label: `Event strip ${strip.sortOrder}`,
    supportedLayouts: ["B"],
    swatch: "#C5DCEF",
    background: "#FFFEFB",
    accent: "#4A8FBF",
    accentSoft: "#8EBFDE",
    treatment: "classic",
    frameSrc: strip.frameSrc,
  }));
}
