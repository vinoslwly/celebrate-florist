import { Repository } from "@/lib/repositories/base";

import type { ExperienceEnvelopeRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

/** Draft envelope row for insert/replace (no server-generated fields). FD-T5 fields only. */
export type EnvelopeInsert = {
  sortOrder: number;
  messageText: string | null;
  photoSortOrder: number | null;
  isFinal: boolean;
};

/**
 * Data access for `experience_envelopes` only.
 * No business orchestration — use `ExperienceEnvelopesRepository` for replace/delete-all.
 */
export class EnvelopesRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findByExperienceId(
    experienceId: string,
  ): Promise<ExperienceEnvelopeRow[]> {
    const { data, error } = await this.client
      .from("experience_envelopes")
      .select("*")
      .eq("experience_id", experienceId)
      .order("sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as ExperienceEnvelopeRow[];
  }

  async findByExperienceAndSortOrder(
    experienceId: string,
    sortOrder: number,
  ): Promise<ExperienceEnvelopeRow | null> {
    const { data, error } = await this.client
      .from("experience_envelopes")
      .select("*")
      .eq("experience_id", experienceId)
      .eq("sort_order", sortOrder)
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperienceEnvelopeRow | null;
  }

  async countByExperienceId(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("experience_envelopes")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertMany(
    experienceId: string,
    envelopes: EnvelopeInsert[],
  ): Promise<ExperienceEnvelopeRow[]> {
    if (envelopes.length === 0) {
      return [];
    }

    const { data, error } = await this.client
      .from("experience_envelopes")
      .insert(
        envelopes.map((envelope) => ({
          experience_id: experienceId,
          sort_order: envelope.sortOrder,
          message_text: envelope.messageText?.trim()
            ? envelope.messageText.trim()
            : null,
          photo_sort_order: envelope.photoSortOrder,
          is_final: envelope.isFinal,
        })),
      )
      .select("*");

    this.assertNoError(error);
    return (data ?? []) as ExperienceEnvelopeRow[];
  }

  async deleteByExperienceId(experienceId: string): Promise<void> {
    const { error } = await this.client
      .from("experience_envelopes")
      .delete()
      .eq("experience_id", experienceId);

    this.assertNoError(error);
  }
}
