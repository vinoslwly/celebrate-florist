import type {
  PhotoboothFilterId,
  PhotoboothFilterPreset,
} from "@/features/photobooth/lib/types";

/**
 * Universal Photobooth filters (Sprint 14.4).
 * Same set for Bloom / Warm / Sky — not theme-specific.
 * CSS + Canvas strings kept identical where the browser supports both.
 */
export const PHOTOBOOTH_FILTERS: PhotoboothFilterPreset[] = [
  {
    id: "original",
    label: "Original",
    cssFilter: "none",
    canvasFilter: "none",
    swatch: "#D9D9D9",
  },
  {
    id: "soft",
    label: "Soft",
    cssFilter: "brightness(1.06) contrast(0.94) saturate(1.04)",
    canvasFilter: "brightness(1.06) contrast(0.94) saturate(1.04)",
    swatch: "#F2E6EA",
  },
  {
    id: "warm",
    label: "Warm",
    cssFilter: "sepia(0.18) saturate(1.12) hue-rotate(-10deg) brightness(1.03)",
    canvasFilter:
      "sepia(0.18) saturate(1.12) hue-rotate(-10deg) brightness(1.03)",
    swatch: "#E8C4A8",
  },
  {
    id: "cool",
    label: "Cool",
    cssFilter:
      "saturate(0.92) hue-rotate(14deg) brightness(1.02) contrast(1.04)",
    canvasFilter:
      "saturate(0.92) hue-rotate(14deg) brightness(1.02) contrast(1.04)",
    swatch: "#B8C9D9",
  },
  {
    id: "vintage",
    label: "Vintage",
    cssFilter: "sepia(0.38) contrast(0.9) brightness(1.04) saturate(0.82)",
    canvasFilter: "sepia(0.38) contrast(0.9) brightness(1.04) saturate(0.82)",
    swatch: "#C9B089",
  },
  {
    id: "mono",
    label: "Mono",
    cssFilter: "grayscale(1) contrast(1.06) brightness(1.02)",
    canvasFilter: "grayscale(1) contrast(1.06) brightness(1.02)",
    swatch: "#9A9A9A",
  },
];

export function getFilterPreset(
  id: PhotoboothFilterId,
): PhotoboothFilterPreset {
  return PHOTOBOOTH_FILTERS.find((f) => f.id === id) ?? PHOTOBOOTH_FILTERS[0]!;
}

export function getDefaultFilterId(): PhotoboothFilterId {
  return "original";
}
