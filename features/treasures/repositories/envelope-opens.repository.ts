import { Repository } from "@/lib/repositories/base";

import type { ExperienceEnvelopeOpenRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Data access for `experience_envelope_opens` only (FD-T2 server progress).
 * No reward, completion, or sequencing logic — services own those rules in Phase 3.
 */
export class EnvelopeOpensRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  /**
   * Idempotent open record (FD-T3).
   * Uses ON CONFLICT DO NOTHING semantics via `ignoreDuplicates`.
   * Returns the row when newly inserted; null when already opened.
   */
  async recordOpen(
    experienceId: string,
    envelopeSortOrder: number,
  ): Promise<ExperienceEnvelopeOpenRow | null> {
    const { data, error } = await this.client
      .from("experience_envelope_opens")
      .upsert(
        {
          experience_id: experienceId,
          envelope_sort_order: envelopeSortOrder,
        },
        {
          onConflict: "experience_id,envelope_sort_order",
          ignoreDuplicates: true,
        },
      )
      .select("*")
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperienceEnvelopeOpenRow | null;
  }

  async findByExperienceId(
    experienceId: string,
  ): Promise<ExperienceEnvelopeOpenRow[]> {
    const { data, error } = await this.client
      .from("experience_envelope_opens")
      .select("*")
      .eq("experience_id", experienceId)
      .order("envelope_sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as ExperienceEnvelopeOpenRow[];
  }

  async findOpenedSortOrdersByExperienceId(
    experienceId: string,
  ): Promise<number[]> {
    const { data, error } = await this.client
      .from("experience_envelope_opens")
      .select("envelope_sort_order")
      .eq("experience_id", experienceId)
      .order("envelope_sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []).map((row) => row.envelope_sort_order);
  }

  async countByExperienceId(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("experience_envelope_opens")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId);

    this.assertNoError(error);
    return count ?? 0;
  }

  async isOpened(
    experienceId: string,
    envelopeSortOrder: number,
  ): Promise<boolean> {
    const { count, error } = await this.client
      .from("experience_envelope_opens")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId)
      .eq("envelope_sort_order", envelopeSortOrder);

    this.assertNoError(error);
    return (count ?? 0) > 0;
  }

  async deleteByExperienceId(experienceId: string): Promise<void> {
    const { error } = await this.client
      .from("experience_envelope_opens")
      .delete()
      .eq("experience_id", experienceId);

    this.assertNoError(error);
  }
}
