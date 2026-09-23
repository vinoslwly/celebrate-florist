import type { StorageBucket } from "@/lib/storage/buckets";

import { env } from "@/config/env";

/**
 * Public object URL for buckets marked public (website-assets, catalog strips).
 */
export function buildPublicStorageUrl(
  bucket: StorageBucket,
  path: string,
): string {
  const base = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
  const key = path.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${bucket}/${key}`;
}
