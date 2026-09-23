import { Repository } from "@/lib/repositories/base";

import type { CatalogPhotoboothStripRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class CatalogPhotoboothStripsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findAll(): Promise<CatalogPhotoboothStripRow[]> {
    const { data, error } = await this.client
      .from("catalog_photobooth_strips")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as CatalogPhotoboothStripRow[];
  }

  async findById(id: string): Promise<CatalogPhotoboothStripRow | null> {
    const { data, error } = await this.client
      .from("catalog_photobooth_strips")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    this.assertNoError(error);
    return data as CatalogPhotoboothStripRow | null;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("catalog_photobooth_strips")
      .select("id", { count: "exact", head: true });

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertStrip(params: {
    displayName: string;
    storagePath: string;
    sortOrder: number;
  }): Promise<CatalogPhotoboothStripRow> {
    const { data, error } = await this.client
      .from("catalog_photobooth_strips")
      .insert({
        display_name: params.displayName,
        storage_path: params.storagePath,
        sort_order: params.sortOrder,
        layout_id: "B",
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as CatalogPhotoboothStripRow;
  }

  async updateDisplayName(
    id: string,
    displayName: string,
  ): Promise<CatalogPhotoboothStripRow> {
    const { data, error } = await this.client
      .from("catalog_photobooth_strips")
      .update({ display_name: displayName })
      .eq("id", id)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as CatalogPhotoboothStripRow;
  }

  async deleteById(id: string): Promise<CatalogPhotoboothStripRow> {
    const { data, error } = await this.client
      .from("catalog_photobooth_strips")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as CatalogPhotoboothStripRow;
  }
}
