import { StorageBucket } from "@/lib/storage/buckets";

const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

export type PhotoExtension = (typeof PHOTO_EXTENSIONS)[number];

/**
 * Builds the storage object path for a memory photo.
 * Pattern: {experienceId}/{photoId}.{ext}
 */
export function buildExperiencePhotoPath(
  experienceId: string,
  photoId: string,
  extension: PhotoExtension,
): string {
  const ext = extension === "jpeg" ? "jpg" : extension;
  return `${experienceId}/${photoId}.${ext}`;
}

/**
 * Builds the storage object path for a printable QR code.
 * Pattern: {experienceId}/qr.png
 */
export function buildExperienceQrPath(experienceId: string): string {
  return `${experienceId}/qr.png`;
}

/**
 * Overlay PNG for a custom photobooth strip.
 * Pattern: {experienceId}/{stripId}.png
 */
export function buildPhotoboothStripPath(
  experienceId: string,
  stripId: string,
): string {
  return `${experienceId}/${stripId}.png`;
}

export function buildCatalogPhotoboothStripPath(stripId: string): string {
  return `${stripId}.png`;
}

export function buildWebsiteAssetPath(
  kind:
    "logo" | "favicon" | "hero" | "theme-bloom" | "theme-warm" | "theme-sky",
  extension: string,
): string {
  const ext = extension.replace(/^\./, "").toLowerCase();
  if (kind === "logo") return `brand/logo.${ext}`;
  if (kind === "favicon") return `brand/favicon.${ext}`;
  if (kind === "hero") return `hero.${ext}`;
  return `themes/${kind.replace("theme-", "")}.${ext}`;
}

/**
 * Parses a storage path back to its bucket and object key.
 */
export function parseStoragePath(
  bucket: StorageBucket,
  storagePath: string,
): { bucket: StorageBucket; path: string } {
  return { bucket, path: storagePath };
}

/**
 * Validates that a path belongs to the expected bucket prefix rules.
 * Future image pipeline can extend this with MIME/size checks.
 */
export function isValidPhotoExtension(ext: string): ext is PhotoExtension {
  return (PHOTO_EXTENSIONS as readonly string[]).includes(ext.toLowerCase());
}
