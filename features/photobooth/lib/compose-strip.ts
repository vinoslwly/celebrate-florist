import { detectPhotoSlotsFromCanvas } from "@/features/photobooth/lib/detect-photo-holes";
import {
  paintStripBackground,
  paintStripDecoration,
} from "@/features/photobooth/lib/draw-frame";
import {
  PHOTOBOOTH_EXPORT_MIME,
  PHOTOBOOTH_EXPORT_MIRROR,
  PHOTOBOOTH_EXPORT_QUALITY,
  PHOTOBOOTH_EXPORT_SCALE,
} from "@/features/photobooth/lib/export";
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
  focusY = 0.34,
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
  const sy = Math.max(0, Math.min(srcH - cropH, (srcH - cropH) * focusY));

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
 * Decode a pose / optional frame asset URL for Canvas draw.
 * Prefers ImageBitmap via fetch; falls back to HTMLImageElement.
 * Requires CSP `blob:` / `https:` as configured for img-src + connect-src.
 */
async function loadBitmap(
  url: string,
): Promise<ImageBitmap | HTMLImageElement> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    return await createImageBitmap(blob);
  } catch {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
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

/** Scale working layout geometry for export masters (exact aspect preserved). */
export function scaleLayoutConfig(
  layout: PhotoboothLayoutConfig,
  scale: number,
): PhotoboothLayoutConfig {
  if (scale === 1) return layout;
  const s = (n: number) => Math.round(n * scale);
  return {
    ...layout,
    canvas: {
      width: s(layout.canvas.width),
      height: s(layout.canvas.height),
    },
    margins: {
      top: s(layout.margins.top),
      right: s(layout.margins.right),
      bottom: s(layout.margins.bottom),
      left: s(layout.margins.left),
    },
    gap: s(layout.gap),
    slots: layout.slots.map((slot) => ({
      x: s(slot.x),
      y: s(slot.y),
      width: s(slot.width),
      height: s(slot.height),
    })),
    safeFrame: {
      x: s(layout.safeFrame.x),
      y: s(layout.safeFrame.y),
      width: s(layout.safeFrame.width),
      height: s(layout.safeFrame.height),
    },
  };
}

export type ComposeStripResult = {
  /** Object URL of the composed image — caller must revoke when previewing. */
  objectUrl: string;
  /** Raw blob for download without re-fetching the object URL. */
  blob: Blob;
  width: number;
  height: number;
  layoutId: PhotoboothLayoutId;
  presetId?: string;
  filterId?: PhotoboothFilterId;
  mirrored: boolean;
};

export type ComposeStripOptions = {
  layoutId: PhotoboothLayoutId;
  poseObjectUrls: string[];
  /** When omitted, uses neutral 14.3 geometric frame. */
  preset?: PhotoboothStripPreset | null;
  /** Universal filter applied to photo slots only (not strip chrome). */
  filterId?: PhotoboothFilterId;
  /**
   * Pixel scale vs working canvas. Preview uses 1; download uses
   * PHOTOBOOTH_EXPORT_SCALE (2×).
   */
  scale?: number;
  /**
   * Mirror photo slots horizontally. V1 download default is false
   * (see PHOTOBOOTH_EXPORT_MIRROR).
   */
  mirrorPhotos?: boolean;
  mimeType?: string;
  quality?: number;
};

/**
 * Compose order:
 * background → photo slots (cover crop + filter [+ optional mirror]) → frame
 *
 * Captures stay raw; filter/mirror applied at compose time.
 * Optional `preset.frameSrc` overlays Founder strip art when present.
 * No application watermark.
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

  const {
    layoutId,
    poseObjectUrls,
    preset,
    filterId = "original",
    scale = 1,
    mirrorPhotos = PHOTOBOOTH_EXPORT_MIRROR,
    mimeType = PHOTOBOOTH_EXPORT_MIME,
    quality = PHOTOBOOTH_EXPORT_QUALITY,
  } = options;

  const baseLayout = getLayoutMeta(layoutId);
  if (poseObjectUrls.length < baseLayout.poseCount) return null;
  const layout = scaleLayoutConfig(baseLayout, scale);

  const canvas = document.createElement("canvas");
  canvas.width = layout.canvas.width;
  canvas.height = layout.canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let frameBitmap: ImageBitmap | HTMLImageElement | null = null;
  let slots = layout.slots;

  if (preset?.frameSrc) {
    try {
      frameBitmap = await loadBitmap(preset.frameSrc);
      const probe = document.createElement("canvas");
      probe.width = layout.canvas.width;
      probe.height = layout.canvas.height;
      const probeCtx = probe.getContext("2d", { willReadFrequently: true });
      if (probeCtx) {
        probeCtx.drawImage(frameBitmap, 0, 0, probe.width, probe.height);
        slots =
          detectPhotoSlotsFromCanvas(probe, layout.poseCount) ?? layout.slots;
      }
    } catch {
      frameBitmap = null;
    }
  }

  if (preset) {
    paintStripBackground(ctx, layout, preset);
  } else {
    paintNeutralFrame(ctx, layout);
  }

  const urls = poseObjectUrls.slice(0, layout.poseCount);
  const bitmaps = await Promise.all(urls.map(loadBitmap));
  const filter = getFilterPreset(filterId);

  try {
    ctx.filter = filter.canvasFilter;
    for (let i = 0; i < slots.length; i += 1) {
      const slot = slots[i]!;
      const bitmap = bitmaps[i];
      if (!bitmap) continue;

      if (mirrorPhotos) {
        ctx.save();
        ctx.translate(slot.x + slot.width, slot.y);
        ctx.scale(-1, 1);
        drawImageCover(ctx, bitmap, {
          x: 0,
          y: 0,
          width: slot.width,
          height: slot.height,
        });
        ctx.restore();
      } else {
        drawImageCover(ctx, bitmap, slot);
      }
    }
  } finally {
    ctx.filter = "none";
    bitmaps.forEach((b) => {
      if ("close" in b && typeof b.close === "function") {
        b.close();
      }
    });
  }

  if (frameBitmap) {
    try {
      ctx.drawImage(
        frameBitmap,
        0,
        0,
        layout.canvas.width,
        layout.canvas.height,
      );
    } finally {
      if ("close" in frameBitmap && typeof frameBitmap.close === "function") {
        frameBitmap.close();
      }
    }
  } else if (preset?.frameSrc) {
    try {
      const frame = await loadBitmap(preset.frameSrc);
      try {
        ctx.drawImage(frame, 0, 0, layout.canvas.width, layout.canvas.height);
      } finally {
        if ("close" in frame && typeof frame.close === "function") {
          frame.close();
        }
      }
    } catch {
      paintStripDecoration(ctx, layout, preset);
    }
  } else if (preset) {
    paintStripDecoration(ctx, layout, preset);
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, quality);
  });
  if (!blob) return null;

  return {
    objectUrl: URL.createObjectURL(blob),
    blob,
    width: layout.canvas.width,
    height: layout.canvas.height,
    layoutId,
    presetId: preset?.id,
    filterId,
    mirrored: mirrorPhotos,
  };
}

/** Convenience: compose at export scale for download. */
export async function composeStripForDownload(
  options: Omit<ComposeStripOptions, "scale" | "mirrorPhotos">,
): Promise<ComposeStripResult | null> {
  return composeStrip({
    ...options,
    scale: PHOTOBOOTH_EXPORT_SCALE,
    mirrorPhotos: PHOTOBOOTH_EXPORT_MIRROR,
  });
}
