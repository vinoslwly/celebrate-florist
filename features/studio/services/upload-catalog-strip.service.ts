import "server-only";

import { randomUUID } from "node:crypto";

import { ValidationError } from "@/lib/errors";
import {
  StorageBucket,
  buildCatalogPhotoboothStripPath,
  buildPublicStorageUrl,
  processPhotoboothStripPng,
  uploadStorageObject,
} from "@/lib/storage";

import { CatalogPhotoboothStripsRepository } from "@/features/studio/repositories/catalog-photobooth-strips.repository";
import type { CatalogStripWithUrl } from "@/features/studio/services/list-catalog-strips.service";
import { CATALOG_STRIP_MAX } from "@/schemas/studio-catalog-strips";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadCatalogStrip(
  client: SupabaseClient,
  fileBuffer: ArrayBuffer,
  mimeType: string,
  displayName: string,
): Promise<CatalogStripWithUrl> {
  const repo = new CatalogPhotoboothStripsRepository(client);
  const count = await repo.count();
  if (count >= CATALOG_STRIP_MAX) {
    throw new ValidationError(
      `Maksimal ${CATALOG_STRIP_MAX} strip PNG di katalog.`,
    );
  }

  const processed = await processPhotoboothStripPng({
    buffer: fileBuffer,
    mimeType,
  });

  const stripId = randomUUID();
  const storagePath = buildCatalogPhotoboothStripPath(stripId);

  await uploadStorageObject(
    client,
    StorageBucket.CATALOG_PHOTOBOOTH_STRIPS,
    storagePath,
    processed.buffer,
    { contentType: processed.mimeType },
  );

  const strip = await repo.insertStrip({
    displayName,
    storagePath,
    sortOrder: count + 1,
  });

  return {
    ...strip,
    publicUrl: buildPublicStorageUrl(
      StorageBucket.CATALOG_PHOTOBOOTH_STRIPS,
      strip.storage_path,
    ),
  };
}
