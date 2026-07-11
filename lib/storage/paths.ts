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
