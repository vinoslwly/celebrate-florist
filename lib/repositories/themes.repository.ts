import { Repository } from "@/lib/repositories/base";

import type { ThemeRow } from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Read-only access to the themes reference table.
 * Serves as the reference implementation for future domain repositories.
 */
export class ThemesRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findAllActive(): Promise<ThemeRow[]> {
    const { data, error } = await this.client
      .from("themes")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as ThemeRow[];
  }

  async findBySlug(slug: string): Promise<ThemeRow | null> {
    const { data, error } = await this.client
      .from("themes")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    this.assertNoError(error);
    return data as ThemeRow | null;
  }

  async findById(id: string): Promise<ThemeRow | null> {
    const { data, error } = await this.client
      .from("themes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    this.assertNoError(error);
    return data as ThemeRow | null;
  }
}
