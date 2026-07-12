import { Repository } from "@/lib/repositories/base";

import type { QuizScoreBandRow } from "@/types/database";

import type { QuizScoreBandInsert } from "@/features/quiz/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export class QuizScoreBandsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findByExperienceId(experienceId: string): Promise<QuizScoreBandRow[]> {
    const { data, error } = await this.client
      .from("experience_quiz_score_bands")
      .select("*")
      .eq("experience_id", experienceId)
      .order("min_percent", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as QuizScoreBandRow[];
  }

  async countByExperienceId(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("experience_quiz_score_bands")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertBand(
    experienceId: string,
    band: QuizScoreBandInsert,
  ): Promise<QuizScoreBandRow> {
    const { data, error } = await this.client
      .from("experience_quiz_score_bands")
      .insert({
        experience_id: experienceId,
        min_percent: band.minPercent,
        max_percent: band.maxPercent,
        message: band.message,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as QuizScoreBandRow;
  }

  async insertMany(
    experienceId: string,
    bands: QuizScoreBandInsert[],
  ): Promise<QuizScoreBandRow[]> {
    if (bands.length === 0) {
      return [];
    }

    const { data, error } = await this.client
      .from("experience_quiz_score_bands")
      .insert(
        bands.map((band) => ({
          experience_id: experienceId,
          min_percent: band.minPercent,
          max_percent: band.maxPercent,
          message: band.message,
        })),
      )
      .select("*");

    this.assertNoError(error);
    return (data ?? []) as QuizScoreBandRow[];
  }

  async deleteById(id: string): Promise<QuizScoreBandRow> {
    const { data, error } = await this.client
      .from("experience_quiz_score_bands")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as QuizScoreBandRow;
  }

  async deleteByExperienceId(experienceId: string): Promise<void> {
    const { error } = await this.client
      .from("experience_quiz_score_bands")
      .delete()
      .eq("experience_id", experienceId);

    this.assertNoError(error);
  }

  /**
   * Immutable draft pattern — delete all bands for an experience, then insert.
   * Not a true DB transaction; callers must enforce draft-only writes.
   */
  async replaceAllForExperience(
    experienceId: string,
    bands: QuizScoreBandInsert[],
  ): Promise<QuizScoreBandRow[]> {
    await this.deleteByExperienceId(experienceId);
    return this.insertMany(experienceId, bands);
  }
}
