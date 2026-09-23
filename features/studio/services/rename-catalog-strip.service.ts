import "server-only";

import { NotFoundError } from "@/lib/errors";
import { StorageBucket, buildPublicStorageUrl } from "@/lib/storage";

import { CatalogPhotoboothStripsRepository } from "@/features/studio/repositories/catalog-photobooth-strips.repository";
import type { CatalogStripWithUrl } from "@/features/studio/services/list-catalog-strips.service";

import type { RenameCatalogStripInput } from "@/schemas/studio-catalog-strips";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function renameCatalogStrip(
  client: SupabaseClient,
  input: RenameCatalogStripInput,
): Promise<CatalogStripWithUrl> {
  const repo = new CatalogPhotoboothStripsRepository(client);
  const existing = await repo.findById(input.stripId);
  if (!existing) {
    throw new NotFoundError("Catalog strip not found");
  }

  const strip = await repo.updateDisplayName(input.stripId, input.displayName);
  return {
    ...strip,
    publicUrl: buildPublicStorageUrl(
      StorageBucket.CATALOG_PHOTOBOOTH_STRIPS,
      strip.storage_path,
    ),
  };
}
