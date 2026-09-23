import { Repository } from "@/lib/repositories/base";

import type { ExperiencePhotoboothStripRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class ExperiencePhotoboothStripsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findByExperienceId(
    experienceId: string,
  ): Promise<ExperiencePhotoboothStripRow[]> {
    const { data, error } = await this.client
      .from("experience_photobooth_strips")
      .select("*")
      .eq("experience_id", experienceId)
      .order("sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as ExperiencePhotoboothStripRow[];
  }

  async findByExperienceAndSortOrder(
    experienceId: string,
    sortOrder: number,
  ): Promise<ExperiencePhotoboothStripRow | null> {
    const { data, error } = await this.client
      .from("experience_photobooth_strips")
      .select("*")
      .eq("experience_id", experienceId)
      .eq("sort_order", sortOrder)
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperiencePhotoboothStripRow | null;
  }

  async countByExperienceId(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("experience_photobooth_strips")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertStrip(params: {
    experienceId: string;
    storagePath: string;
    sortOrder: number;
    layoutId: "B" | "K";
  }): Promise<ExperiencePhotoboothStripRow> {
    const { data, error } = await this.client
      .from("experience_photobooth_strips")
      .insert({
        experience_id: params.experienceId,
        storage_path: params.storagePath,
        sort_order: params.sortOrder,
        layout_id: params.layoutId,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperiencePhotoboothStripRow;
  }

  async deleteById(id: string): Promise<ExperiencePhotoboothStripRow> {
    const { data, error } = await this.client
      .from("experience_photobooth_strips")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperiencePhotoboothStripRow;
  }
}
