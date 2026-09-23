import "server-only";

import { StorageBucket, buildPublicStorageUrl } from "@/lib/storage";

import type { CatalogPhotoboothStripRow } from "@/types/database";

import { CatalogPhotoboothStripsRepository } from "@/features/studio/repositories/catalog-photobooth-strips.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

export type CatalogStripWithUrl = CatalogPhotoboothStripRow & {
  publicUrl: string;
};

export async function listCatalogStrips(
  client: SupabaseClient,
): Promise<CatalogStripWithUrl[]> {
  const repo = new CatalogPhotoboothStripsRepository(client);
  const rows = await repo.findAll();
  return rows.map((row) => ({
    ...row,
    publicUrl: buildPublicStorageUrl(
      StorageBucket.CATALOG_PHOTOBOOTH_STRIPS,
      row.storage_path,
    ),
  }));
}
