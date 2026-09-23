import "server-only";

import { ValidationError } from "@/lib/errors";
import {
  StorageBucket,
  buildPublicStorageUrl,
  buildWebsiteAssetPath,
  processImageForStorage,
  uploadStorageObject,
} from "@/lib/storage";

import { isRejectedWebsiteAsset } from "@/features/website/config/asset-guard";

import type { WebsiteAssetKind } from "@/schemas/studio-website";
import type { SupabaseClient } from "@supabase/supabase-js";

function extensionForMime(kind: WebsiteAssetKind): string {
  if (kind === "favicon") return "png";
  return "webp";
}

export async function uploadWebsiteAsset(
  client: SupabaseClient,
  kind: WebsiteAssetKind,
  fileBuffer: ArrayBuffer,
  mimeType: string,
): Promise<{ url: string; path: string }> {
  if (isRejectedWebsiteAsset(mimeType, fileBuffer)) {
    throw new ValidationError("Image must be PNG, JPEG, or WebP.");
  }

  let processed;
  try {
    processed = await processImageForStorage({
      buffer: fileBuffer,
      mimeType,
    });
  } catch {
    throw new ValidationError("Image must be PNG, JPEG, or WebP.");
  }

  const path = buildWebsiteAssetPath(kind, extensionForMime(kind));
  await uploadStorageObject(
    client,
    StorageBucket.WEBSITE_ASSETS,
    path,
    processed.buffer,
    { contentType: processed.mimeType, upsert: true },
  );

  return {
    url: buildPublicStorageUrl(StorageBucket.WEBSITE_ASSETS, path),
    path,
  };
}
