import "server-only";

import { NotFoundError } from "@/lib/errors";
import { StorageBucket, deleteStorageObject } from "@/lib/storage";

import { CatalogPhotoboothStripsRepository } from "@/features/studio/repositories/catalog-photobooth-strips.repository";

import type { DeleteCatalogStripInput } from "@/schemas/studio-catalog-strips";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function deleteCatalogStrip(
  client: SupabaseClient,
  input: DeleteCatalogStripInput,
): Promise<{ stripId: string }> {
  const repo = new CatalogPhotoboothStripsRepository(client);
  const existing = await repo.findById(input.stripId);
  if (!existing) {
    throw new NotFoundError("Catalog strip not found");
  }

  await repo.deleteById(input.stripId);
  await deleteStorageObject(
    client,
    StorageBucket.CATALOG_PHOTOBOOTH_STRIPS,
    existing.storage_path,
  );

  return { stripId: existing.id };
}
