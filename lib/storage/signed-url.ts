import "server-only";

import { InternalServerError } from "@/lib/errors";
import {
  SIGNED_URL_TTL_SECONDS,
  type StorageBucket,
} from "@/lib/storage/buckets";

import type { SupabaseClient } from "@supabase/supabase-js";

type SignedUrlOptions = {
  expiresIn?: number;
};

/**
 * Creates a time-limited signed URL for reading a private storage object.
 * Intended for recipient-facing memory photos after Access Code verification.
 */
export async function createSignedReadUrl(
  client: SupabaseClient,
  bucket: StorageBucket,
  path: string,
  options: SignedUrlOptions = {},
): Promise<string> {
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, options.expiresIn ?? SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    throw new InternalServerError("Failed to create signed read URL", error);
  }

  return data.signedUrl;
}

/**
 * Creates a time-limited signed upload URL for admin photo uploads.
 * Studio upload UI will use this in a future sprint.
 */
export async function createSignedUploadUrl(
  client: SupabaseClient,
  bucket: StorageBucket,
  path: string,
  _options: SignedUrlOptions = {},
): Promise<{ signedUrl: string; token: string; path: string }> {
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(path, {
      upsert: false,
    });

  if (error || !data?.signedUrl) {
    throw new InternalServerError("Failed to create signed upload URL", error);
  }

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
  };
}
