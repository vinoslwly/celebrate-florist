import { Repository } from "@/lib/repositories/base";

import type { MatchPairRow } from "@/types/database";

import type { MatchPairInsert } from "@/features/match/types";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Data access for `experience_match_pairs` only.
 * No business orchestration — use `ExperienceMatchRepository` for replace/delete-all.
 */
export class MatchPairsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findByExperienceId(experienceId: string): Promise<MatchPairRow[]> {
    const { data, error } = await this.client
      .from("experience_match_pairs")
      .select("*")
      .eq("experience_id", experienceId)
      .order("sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as MatchPairRow[];
  }

  async findByExperienceAndSortOrder(
    experienceId: string,
    sortOrder: number,
  ): Promise<MatchPairRow | null> {
    const { data, error } = await this.client
      .from("experience_match_pairs")
      .select("*")
      .eq("experience_id", experienceId)
      .eq("sort_order", sortOrder)
      .maybeSingle();

    this.assertNoError(error);
    return data as MatchPairRow | null;
  }

  async countByExperienceId(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("experience_match_pairs")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertMany(
    experienceId: string,
    pairs: MatchPairInsert[],
  ): Promise<MatchPairRow[]> {
    if (pairs.length === 0) {
      return [];
    }

    const { data, error } = await this.client
      .from("experience_match_pairs")
      .insert(
        pairs.map((pair) => ({
          experience_id: experienceId,
          sort_order: pair.sortOrder,
          story_text: pair.storyText,
          photo_sort_order: pair.photoSortOrder,
        })),
      )
      .select("*");

    this.assertNoError(error);
    return (data ?? []) as MatchPairRow[];
  }

  async deleteByExperienceId(experienceId: string): Promise<void> {
    const { error } = await this.client
      .from("experience_match_pairs")
      .delete()
      .eq("experience_id", experienceId);

    this.assertNoError(error);
  }
}
