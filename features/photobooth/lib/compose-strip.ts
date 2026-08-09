import {
  paintStripBackground,
  paintStripDecoration,
} from "@/features/photobooth/lib/draw-frame";
import { getFilterPreset } from "@/features/photobooth/lib/filters";
import {
  getLayoutMeta,
  type LayoutRect,
  type PhotoboothLayoutConfig,
} from "@/features/photobooth/lib/layouts";
import type {
  PhotoboothFilterId,
  PhotoboothLayoutId,
  PhotoboothStripPreset,
} from "@/features/photobooth/lib/types";

/**
 * Cover-style draw: preserve source aspect, fill dest rect, crop center.
 * Separate from preview CSS mirroring — sources are raw capture frames.
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource & { width: number; height: number },
  dest: LayoutRect,
): void {
  const srcW =
    "naturalWidth" in img && typeof img.naturalWidth === "number"
      ? img.naturalWidth || img.width
      : img.width;
  const srcH =
    "naturalHeight" in img && typeof img.naturalHeight === "number"
      ? img.naturalHeight || img.height
      : img.height;
  if (srcW <= 0 || srcH <= 0 || dest.width <= 0 || dest.height <= 0) return;

  const scale = Math.max(dest.width / srcW, dest.height / srcH);
  const cropW = dest.width / scale;
  const cropH = dest.height / scale;
  const sx = (srcW - cropW) / 2;
  const sy = (srcH - cropH) / 2;

  ctx.drawImage(
    img,
    sx,
    sy,
    cropW,
    cropH,
    dest.x,
    dest.y,
    dest.width,
    dest.height,
  );
}

/**
 * Decode a pose object URL for Canvas draw.
 * Prefers ImageBitmap via fetch; falls back to HTMLImageElement.
 * Requires CSP `blob:` on `img-src` and `connect-src`.
 */
async function loadPoseBitmap(
  url: string,
): Promise<ImageBitmap | HTMLImageElement> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch pose image");
    }
    const blob = await response.blob();
    return await createImageBitmap(blob);
  } catch {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load pose image"));
      img.src = url;
    });
  }
}

function paintNeutralFrame(
  ctx: CanvasRenderingContext2D,
  layout: PhotoboothLayoutConfig,
): void {
  const { width, height } = layout.canvas;
  ctx.fillStyle = layout.background;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = layout.slotBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);
  for (const slot of layout.slots) {
    ctx.strokeStyle = layout.slotBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(slot.x + 0.5, slot.y + 0.5, slot.width - 1, slot.height - 1);
  }
}

export type ComposeStripResult = {
  /** Object URL of the composed JPEG — caller must revoke. */
  objectUrl: string;
  width: number;
  height: number;
  layoutId: PhotoboothLayoutId;
  presetId?: string;
  filterId?: PhotoboothFilterId;
};

export type ComposeStripOptions = {
  layoutId: PhotoboothLayoutId;
  poseObjectUrls: string[];
  /** When omitted, uses neutral 14.3 geometric frame. */
  preset?: PhotoboothStripPreset | null;
  /** Universal filter applied to photo slots only (not strip chrome). */
  filterId?: PhotoboothFilterId;
};

/**
 * Compose order:
 * background → photo slots (cover crop + filter) → frame decoration
 *
 * Captures stay raw; filter is applied at compose time so it can change
 * without retakes. Does **not** apply preview mirroring or app watermark.
 */
export async function composeStrip(
  layoutIdOrOptions: PhotoboothLayoutId | ComposeStripOptions,
  poseObjectUrlsArg?: string[],
): Promise<ComposeStripResult | null> {
  const options: ComposeStripOptions =
    typeof layoutIdOrOptions === "string"
      ? {
          layoutId: layoutIdOrOptions,
          poseObjectUrls: poseObjectUrlsArg ?? [],
        }
      : layoutIdOrOptions;

  const { layoutId, poseObjectUrls, preset, filterId = "original" } = options;
  const layout = getLayoutMeta(layoutId);
  if (poseObjectUrls.length < layout.poseCount) return null;

  const canvas = document.createElement("canvas");
  canvas.width = layout.canvas.width;
  canvas.height = layout.canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  if (preset) {
    paintStripBackground(ctx, layout, preset);
  } else {
    paintNeutralFrame(ctx, layout);
  }

  const urls = poseObjectUrls.slice(0, layout.poseCount);
  const bitmaps = await Promise.all(urls.map(loadPoseBitmap));
  const filter = getFilterPreset(filterId);

  try {
    ctx.filter = filter.canvasFilter;
    for (let i = 0; i < layout.slots.length; i += 1) {
      const slot = layout.slots[i]!;
      const bitmap = bitmaps[i];
      if (!bitmap) continue;
      drawImageCover(ctx, bitmap, slot);
    }
  } finally {
    ctx.filter = "none";
    bitmaps.forEach((b) => {
      if ("close" in b && typeof b.close === "function") {
        b.close();
      }
    });
  }

  if (preset) {
    paintStripDecoration(ctx, layout, preset);
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92);
  });
  if (!blob) return null;

  return {
    objectUrl: URL.createObjectURL(blob),
    width: layout.canvas.width,
    height: layout.canvas.height,
    layoutId,
    presetId: preset?.id,
    filterId,
  };
}
