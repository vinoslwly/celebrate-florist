import type { PhotoboothLayoutId } from "@/features/photobooth/lib/types";

/** Axis-aligned rectangle in canvas pixel space. */
export type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Data-driven layout geometry for composition (Sprint 14.3).
 * Not a generic layout DSL — B and K only.
 */
export type PhotoboothLayoutConfig = {
  id: PhotoboothLayoutId;
  label: string;
  shortLabel: string;
  poseCount: 2 | 3;
  /** Physical print size — portrait strip locked. */
  physicalInches: { width: number; height: number };
  /** Print size in centimetres (width × height). Layout B is 5.5 × 15.5. */
  physicalCm: { width: number; height: number };
  /** Exact aspect as W:H integers (B=11:31, K=2:3). */
  aspectRatio: { w: number; h: number };
  description: string;
  /** Working digital canvas — preview/composition, not print master. */
  canvas: { width: number; height: number };
  margins: { top: number; right: number; bottom: number; left: number };
  /** Vertical gap between stacked slots. */
  gap: number;
  /** Pose slot rectangles (top → bottom), length === poseCount. */
  slots: LayoutRect[];
  /**
   * Safe area for future frame art (14.4).
   * Equals the union of photo slots + inter-slot gaps inside margins.
   */
  safeFrame: LayoutRect;
  /** Neutral geometric background for composition preview. */
  background: string;
  /** Thin slot border (preview only). */
  slotBorder: string;
};

function buildStackedSlots(opts: {
  canvasW: number;
  canvasH: number;
  poseCount: 2 | 3;
  margins: PhotoboothLayoutConfig["margins"];
  gap: number;
}): { slots: LayoutRect[]; safeFrame: LayoutRect } {
  const { canvasW, canvasH, poseCount, margins, gap } = opts;
  const innerX = margins.left;
  const innerY = margins.top;
  const innerW = canvasW - margins.left - margins.right;
  const innerH = canvasH - margins.top - margins.bottom;
  const gapsTotal = gap * (poseCount - 1);
  const slotH = Math.floor((innerH - gapsTotal) / poseCount);
  const usedH = slotH * poseCount + gapsTotal;
  // Center leftover pixels vertically inside the margin box.
  const yOffset = Math.floor((innerH - usedH) / 2);

  const slots: LayoutRect[] = [];
  for (let i = 0; i < poseCount; i += 1) {
    slots.push({
      x: innerX,
      y: innerY + yOffset + i * (slotH + gap),
      width: innerW,
      height: slotH,
    });
  }

  const first = slots[0]!;
  const last = slots[slots.length - 1]!;
  return {
    slots,
    safeFrame: {
      x: first.x,
      y: first.y,
      width: first.width,
      height: last.y + last.height - first.y,
    },
  };
}

const layoutBGeometry = buildStackedSlots({
  canvasW: 550,
  canvasH: 1550,
  poseCount: 3,
  margins: { top: 210, right: 42, bottom: 260, left: 42 },
  gap: 22,
});

const layoutKGeometry = buildStackedSlots({
  canvasW: 600,
  canvasH: 900,
  poseCount: 2,
  margins: { top: 28, right: 28, bottom: 28, left: 28 },
  gap: 20,
});

/**
 * Locked layouts B / K with working pixel geometry.
 * Capture sequencing reads `poseCount` only; composition reads full config.
 */
export const PHOTOBOOTH_LAYOUTS: Record<
  PhotoboothLayoutId,
  PhotoboothLayoutConfig
> = {
  B: {
    id: "B",
    label: "Layout B · 5.5 × 15.5 cm strip",
    shortLabel: "3 photos",
    poseCount: 3,
    physicalInches: { width: 2.17, height: 6.1 },
    physicalCm: { width: 5.5, height: 15.5 },
    aspectRatio: { w: 11, h: 31 },
    description: "Photostrip · 3 stacked photos · 5.5 cm × 15.5 cm",
    canvas: { width: 550, height: 1550 },
    margins: { top: 210, right: 42, bottom: 260, left: 42 },
    gap: 22,
    slots: layoutBGeometry.slots,
    safeFrame: layoutBGeometry.safeFrame,
    background: "#ECEFF2",
    slotBorder: "#C5CCD4",
  },
  K: {
    id: "K",
    label: "Layout K · 4×6 card",
    shortLabel: "2 poses",
    poseCount: 2,
    physicalInches: { width: 4, height: 6 },
    physicalCm: { width: 10, height: 15 },
    aspectRatio: { w: 2, h: 3 },
    description: "Photo-card · 2 stacked poses",
    canvas: { width: 600, height: 900 },
    margins: { top: 28, right: 28, bottom: 28, left: 28 },
    gap: 20,
    slots: layoutKGeometry.slots,
    safeFrame: layoutKGeometry.safeFrame,
    background: "#ECEFF2",
    slotBorder: "#C5CCD4",
  },
};

export function getLayoutMeta(id: PhotoboothLayoutId): PhotoboothLayoutConfig {
  return PHOTOBOOTH_LAYOUTS[id];
}

/** CSS `aspect-ratio` string matching locked physical portrait ratios. */
export function getLayoutAspectCss(id: PhotoboothLayoutId): string {
  const { w, h } = PHOTOBOOTH_LAYOUTS[id].aspectRatio;
  return `${w} / ${h}`;
}
