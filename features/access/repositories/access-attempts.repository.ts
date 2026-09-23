import { Repository } from "@/lib/repositories/base";

import type { AccessAttemptRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class AccessAttemptsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async countFailedAttempts(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("access_attempts")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId)
      .eq("was_successful", false);

    this.assertNoError(error);
    return count ?? 0;
  }

  async countFailedAttemptsSince(
    experienceId: string,
    ipHash: string,
    sinceIso: string,
  ): Promise<number> {
    const { count, error } = await this.client
      .from("access_attempts")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId)
      .eq("ip_hash", ipHash)
      .eq("was_successful", false)
      .gte("attempted_at", sinceIso);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertAttempt(params: {
    experienceId: string;
    ipHash: string;
    wasSuccessful: boolean;
  }): Promise<AccessAttemptRow> {
    const { data, error } = await this.client
      .from("access_attempts")
      .insert({
        experience_id: params.experienceId,
        ip_hash: params.ipHash,
        was_successful: params.wasSuccessful,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as AccessAttemptRow;
  }
}
