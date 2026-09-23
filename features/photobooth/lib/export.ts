import { getLayoutMeta } from "@/features/photobooth/lib/layouts";
import type { PhotoboothLayoutId } from "@/features/photobooth/lib/types";

/**
 * Working canvas × EXPORT_SCALE → download masters.
 */
export const PHOTOBOOTH_EXPORT_SCALE = 2;

/** Photographic strip — no transparency required for V1 procedural strips. */
export const PHOTOBOOTH_EXPORT_MIME = "image/jpeg" as const;

/** Sensible quality: faces stay clear, files stay mobile-friendly. */
export const PHOTOBOOTH_EXPORT_QUALITY = 0.92;

/**
 * Live selfie preview is CSS-mirrored; composed strip flips photos the same
 * way so a raised left hand stays on the left in both camera and download.
 */
export const PHOTOBOOTH_EXPORT_MIRROR = true;

export function getExportPixelSize(layoutId: PhotoboothLayoutId): {
  width: number;
  height: number;
} {
  const { canvas } = getLayoutMeta(layoutId);
  return {
    width: canvas.width * PHOTOBOOTH_EXPORT_SCALE,
    height: canvas.height * PHOTOBOOTH_EXPORT_SCALE,
  };
}

export function buildPhotoboothFilename(layoutId: PhotoboothLayoutId): string {
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "-")
    .slice(0, 19);
  return `celebrate-florist-photobooth-${layoutId}-${stamp}.jpg`;
}

/**
 * Trigger a browser download from a Blob, then revoke the temporary object URL.
 * Does not touch the composition preview URL.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    // Defer revoke so the browser can start the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
}
