import { Repository } from "@/lib/repositories/base";

import type { ExperienceMode, ExperienceRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export type UpdateExperienceDraftParams = {
  greetingName: string;
  closingName: string;
  letterContent: string;
  letterClosing: string;
  quizTitle?: string | null;
  memoryKeyHash?: string;
};

export class ExperiencesRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findById(id: string): Promise<ExperienceRow | null> {
    const { data, error } = await this.client
      .from("experiences")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperienceRow | null;
  }

  async findByOrderId(orderId: string): Promise<ExperienceRow | null> {
    const { data, error } = await this.client
      .from("experiences")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperienceRow | null;
  }

  async findByToken(token: string): Promise<ExperienceRow | null> {
    const { data, error } = await this.client
      .from("experiences")
      .select("*")
      .eq("experience_token", token)
      .maybeSingle();

    this.assertNoError(error);
    return data as ExperienceRow | null;
  }

  async recordFirstOpened(id: string): Promise<ExperienceRow> {
    const now = new Date().toISOString();

    const { data, error } = await this.client
      .from("experiences")
      .update({
        first_opened_at: now,
        is_opened: true,
        last_accessed_at: now,
      })
      .eq("id", id)
      .is("first_opened_at", null)
      .select("*")
      .maybeSingle();

    this.assertNoError(error);

    if (data) {
      return data as ExperienceRow;
    }

    const { data: touched, error: touchError } = await this.client
      .from("experiences")
      .update({ last_accessed_at: now })
      .eq("id", id)
      .select("*")
      .single();

    this.assertNoError(touchError);
    return touched as ExperienceRow;
  }

  async publishExperience(
    id: string,
    params: {
      qrStoragePath: string;
      contentLockedAt: string;
      publishedAt: string;
    },
  ): Promise<ExperienceRow> {
    const { data, error } = await this.client
      .from("experiences")
      .update({
        status: "published",
        qr_storage_path: params.qrStoragePath,
        content_locked_at: params.contentLockedAt,
        published_at: params.publishedAt,
      })
      .eq("id", id)
      .eq("status", "draft")
      .is("content_locked_at", null)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperienceRow;
  }

  async updateDraft(
    id: string,
    params: UpdateExperienceDraftParams,
  ): Promise<ExperienceRow> {
    const payload: Record<string, string | null> = {
      greeting_name: params.greetingName,
      closing_name: params.closingName,
      letter_content: params.letterContent,
      letter_closing: params.letterClosing,
      quiz_title: params.quizTitle ?? null,
    };

    if (params.memoryKeyHash) {
      payload.memory_key_hash = params.memoryKeyHash;
    }

    const { data, error } = await this.client
      .from("experiences")
      .update(payload)
      .eq("id", id)
      .eq("status", "draft")
      .is("content_locked_at", null)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperienceRow;
  }

  async updateExperienceMode(
    id: string,
    experienceMode: ExperienceMode,
  ): Promise<ExperienceRow> {
    const { data, error } = await this.client
      .from("experiences")
      .update({ experience_mode: experienceMode })
      .eq("id", id)
      .eq("status", "draft")
      .is("content_locked_at", null)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperienceRow;
  }

  async updateMemoryKeyHash(
    id: string,
    memoryKeyHash: string,
  ): Promise<ExperienceRow> {
    const { data, error } = await this.client
      .from("experiences")
      .update({ memory_key_hash: memoryKeyHash })
      .eq("id", id)
      .eq("status", "draft")
      .is("content_locked_at", null)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as ExperienceRow;
  }
}
