import "server-only";

import { InternalServerError } from "@/lib/errors";
import type { StorageBucket } from "@/lib/storage/buckets";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes a single object from a private storage bucket.
 */
export async function deleteStorageObject(
  client: SupabaseClient,
  bucket: StorageBucket,
  path: string,
): Promise<void> {
  const { error } = await client.storage.from(bucket).remove([path]);

  if (error) {
    throw new InternalServerError("Failed to delete storage object", error);
  }
}

/**
 * Deletes multiple objects from a private storage bucket.
 */
export async function deleteStorageObjects(
  client: SupabaseClient,
  bucket: StorageBucket,
  paths: string[],
): Promise<void> {
  if (paths.length === 0) {
    return;
  }

  const { error } = await client.storage.from(bucket).remove(paths);

  if (error) {
    throw new InternalServerError("Failed to delete storage objects", error);
  }
}
