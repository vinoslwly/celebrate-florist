import { Repository } from "@/lib/repositories/base";

import type { AppSettingRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class AppSettingsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findByKey(key: string): Promise<AppSettingRow | null> {
    const { data, error } = await this.client
      .from("app_settings")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    this.assertNoError(error);
    return data as AppSettingRow | null;
  }

  async upsertByKey(params: {
    key: string;
    value: string;
    updatedBy: string | null;
  }): Promise<AppSettingRow> {
    const { data, error } = await this.client
      .from("app_settings")
      .upsert(
        {
          key: params.key,
          value: params.value,
          updated_by: params.updatedBy,
        },
        { onConflict: "key" },
      )
      .select("*")
      .single();

    this.assertNoError(error);
    return data as AppSettingRow;
  }
}
