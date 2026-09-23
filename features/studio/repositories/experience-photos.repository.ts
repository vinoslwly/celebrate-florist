import { Repository } from "@/lib/repositories/base";

import type { ExperiencePhotoRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class ExperiencePhotosRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findByExperienceId(
    experienceId: string,
  ): Promise<ExperiencePhotoRow[]> {
    const { data, error } = await this.client
      .from("experience_photos")
      .select("*")
      .eq("experience_id", experienceId)
      .order("sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as ExperiencePhotoRow[];
  }

  async findByExperienceAndSortOrder(
    experienceId: string,
    sortOrder: number,
  ): Promise<ExperiencePhotoRow | null> {
    const { data, error } = await this.client
      .from("experience_photos")
      .select("*")
      .eq("experience_id", experienceId)
      .eq("sort_order", sortOrder)
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperiencePhotoRow | null;
  }

  async countByExperienceId(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("experience_photos")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertPhoto(params: {
    experienceId: string;
    storagePath: string;
    sortOrder: number;
    caption?: string | null;
  }): Promise<ExperiencePhotoRow> {
    const { data, error } = await this.client
      .from("experience_photos")
      .insert({
        experience_id: params.experienceId,
        storage_path: params.storagePath,
        sort_order: params.sortOrder,
        caption: params.caption ?? null,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperiencePhotoRow;
  }

  async replaceCaption(
    photo: ExperiencePhotoRow,
    caption: string | null,
  ): Promise<ExperiencePhotoRow> {
    await this.deleteById(photo.id);
    return this.insertPhoto({
      experienceId: photo.experience_id,
      storagePath: photo.storage_path,
      sortOrder: photo.sort_order,
      caption,
    });
  }

  async deleteById(id: string): Promise<ExperiencePhotoRow> {
    const { data, error } = await this.client
      .from("experience_photos")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperiencePhotoRow;
  }
}
