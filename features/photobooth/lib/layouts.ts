import type { PhotoboothLayoutId } from "@/features/photobooth/lib/types";

/**
 * Layout metadata for capture foundation (14.2).
 * Final pixel composition belongs to 14.3 — poseCount drives sequencing only.
 */
export type PhotoboothLayoutMeta = {
  id: PhotoboothLayoutId;
  label: string;
  shortLabel: string;
  poseCount: 2 | 3;
  /** Physical print size — portrait locked. */
  physicalInches: { width: number; height: number };
  description: string;
};

export const PHOTOBOOTH_LAYOUTS: Record<
  PhotoboothLayoutId,
  PhotoboothLayoutMeta
> = {
  B: {
    id: "B",
    label: "Layout B · 2×6 strip",
    shortLabel: "3 poses",
    poseCount: 3,
    physicalInches: { width: 2, height: 6 },
    description: "Classic photostrip · 3 stacked poses",
  },
  K: {
    id: "K",
    label: "Layout K · 4×6 card",
    shortLabel: "2 poses",
    poseCount: 2,
    physicalInches: { width: 4, height: 6 },
    description: "Photo-card · 2 stacked poses",
  },
};

export function getLayoutMeta(id: PhotoboothLayoutId): PhotoboothLayoutMeta {
  return PHOTOBOOTH_LAYOUTS[id];
}
