import { Repository } from "@/lib/repositories/base";

import type {
  AnalyticsEvent,
  DeviceType,
  ExperienceAnalyticsRow,
} from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class ExperienceAnalyticsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async insertEvent(params: {
    experienceId: string;
    eventType: AnalyticsEvent;
    deviceType?: DeviceType | null;
  }): Promise<ExperienceAnalyticsRow> {
    const { data, error } = await this.client
      .from("experience_analytics")
      .insert({
        experience_id: params.experienceId,
        event_type: params.eventType,
        device_type: params.deviceType ?? null,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperienceAnalyticsRow;
  }
}
