import "server-only";

import { Repository } from "@/lib/repositories/base";

import type { SecurityEventType } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class SecurityEventsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async countEventsSince(params: {
    eventType: SecurityEventType;
    sinceIso: string;
    metadataContains: Record<string, unknown>;
  }): Promise<number> {
    const { count, error } = await this.client
      .from("security_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", params.eventType)
      .gte("created_at", params.sinceIso)
      .contains("metadata", params.metadataContains);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertEvent(params: {
    eventType: SecurityEventType;
    experienceId?: string | null;
    ipHash?: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<void> {
    const { error } = await this.client.from("security_events").insert({
      event_type: params.eventType,
      experience_id: params.experienceId ?? null,
      ip_hash: params.ipHash ?? null,
      metadata: params.metadata ?? null,
    });

    this.assertNoError(error);
  }
}
