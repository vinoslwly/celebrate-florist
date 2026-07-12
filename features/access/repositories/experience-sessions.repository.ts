import { Repository } from "@/lib/repositories/base";

import type { ExperienceSessionRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export type InsertSessionParams = {
  experienceId: string;
  sessionTokenHash: string;
  ipHash: string | null;
  userAgentHash: string | null;
  expiresAt: string;
};

export class ExperienceSessionsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findValidByTokenHash(
    experienceId: string,
    sessionTokenHash: string,
  ): Promise<ExperienceSessionRow | null> {
    const now = new Date().toISOString();

    const { data, error } = await this.client
      .from("experience_sessions")
      .select("*")
      .eq("experience_id", experienceId)
      .eq("session_token_hash", sessionTokenHash)
      .eq("is_revoked", false)
      .gt("expires_at", now)
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperienceSessionRow | null;
  }

  async insertSession(
    params: InsertSessionParams,
  ): Promise<ExperienceSessionRow> {
    const now = new Date().toISOString();

    const { data, error } = await this.client
      .from("experience_sessions")
      .insert({
        experience_id: params.experienceId,
        session_token_hash: params.sessionTokenHash,
        ip_hash: params.ipHash,
        user_agent_hash: params.userAgentHash,
        verified_at: now,
        expires_at: params.expiresAt,
        last_seen_at: now,
        is_revoked: false,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperienceSessionRow;
  }

  async touchLastSeen(id: string): Promise<void> {
    const { error } = await this.client
      .from("experience_sessions")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", id);

    this.assertNoError(error);
  }
}
