import { Repository } from "@/lib/repositories/base";

import type { PreviewLinkRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export class PreviewLinksRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findActiveByToken(token: string): Promise<PreviewLinkRow | null> {
    const { data, error } = await this.client
      .from("preview_links")
      .select("*")
      .eq("preview_token", token)
      .eq("is_active", true)
      .maybeSingle();

    this.assertNoError(error);
    return data as PreviewLinkRow | null;
  }

  async findActiveByExperienceId(
    experienceId: string,
  ): Promise<PreviewLinkRow | null> {
    const { data, error } = await this.client
      .from("preview_links")
      .select("*")
      .eq("experience_id", experienceId)
      .eq("is_active", true)
      .maybeSingle();

    this.assertNoError(error);
    return data as PreviewLinkRow | null;
  }

  async deactivateByExperienceId(experienceId: string): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await this.client
      .from("preview_links")
      .update({ is_active: false, disabled_at: now })
      .eq("experience_id", experienceId)
      .eq("is_active", true);

    this.assertNoError(error);
  }

  async insertLink(params: {
    experienceId: string;
    previewToken: string;
    createdBy: string;
  }): Promise<PreviewLinkRow> {
    const { data, error } = await this.client
      .from("preview_links")
      .insert({
        experience_id: params.experienceId,
        preview_token: params.previewToken,
        created_by: params.createdBy,
        is_active: true,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as PreviewLinkRow;
  }
}
