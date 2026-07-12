import "server-only";

import { InternalServerError } from "@/lib/errors";
import type { StorageBucket } from "@/lib/storage/buckets";

import type { SupabaseClient } from "@supabase/supabase-js";

type UploadOptions = {
  contentType: string;
  upsert?: boolean;
};

/**
 * Uploads a binary object to a private Supabase Storage bucket.
 */
export async function uploadStorageObject(
  client: SupabaseClient,
  bucket: StorageBucket,
  path: string,
  buffer: ArrayBuffer,
  options: UploadOptions,
): Promise<void> {
  const { error } = await client.storage.from(bucket).upload(path, buffer, {
    contentType: options.contentType,
    upsert: options.upsert ?? false,
  });

  if (error) {
    throw new InternalServerError("Failed to upload storage object", error);
  }
}
