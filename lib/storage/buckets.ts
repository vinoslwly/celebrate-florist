/**
 * Supabase Storage bucket identifiers.
 * @see docs/03_DATABASE.md#storage-buckets
 */
export const StorageBucket = {
  EXPERIENCE_PHOTOS: "experience-photos",
  EXPERIENCE_QR: "experience-qr",
  WEBSITE_ASSETS: "website-assets",
} as const;

export type StorageBucket = (typeof StorageBucket)[keyof typeof StorageBucket];

/** Default signed URL lifetime for recipient-facing reads (seconds). */
export const SIGNED_URL_TTL_SECONDS = 3600;

/** Default signed upload URL lifetime (seconds). */
export const SIGNED_UPLOAD_TTL_SECONDS = 300;
