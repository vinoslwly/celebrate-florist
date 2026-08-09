import type { PhotoboothLayoutId } from "@/features/photobooth/lib/types";

/**
 * Sprint 14.5 export constants.
 * Working canvases (400×1200 / 600×900) × EXPORT_SCALE → download masters.
 */
export const PHOTOBOOTH_EXPORT_SCALE = 2;

/** Photographic strip — no transparency required for V1 procedural strips. */
export const PHOTOBOOTH_EXPORT_MIME = "image/jpeg" as const;

/** Sensible quality: faces stay clear, files stay mobile-friendly. */
export const PHOTOBOOTH_EXPORT_QUALITY = 0.92;

/**
 * V1 export mirroring decision (Founder lock for 14.5):
 * Live selfie preview may be CSS-mirrored for aiming;
 * download matches unmirrored capture composition (how others see you).
 * Option A — Preview mirrored → export unmirrored.
 */
export const PHOTOBOOTH_EXPORT_MIRROR = false;

export function getExportPixelSize(layoutId: PhotoboothLayoutId): {
  width: number;
  height: number;
} {
  if (layoutId === "B") {
    return {
      width: 400 * PHOTOBOOTH_EXPORT_SCALE,
      height: 1200 * PHOTOBOOTH_EXPORT_SCALE,
    };
  }
  return {
    width: 600 * PHOTOBOOTH_EXPORT_SCALE,
    height: 900 * PHOTOBOOTH_EXPORT_SCALE,
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
