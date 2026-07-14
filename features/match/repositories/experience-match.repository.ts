import { Repository } from "@/lib/repositories/base";

import { MatchPairsRepository } from "@/features/match/repositories/match-pairs.repository";
import type { ExperienceMatch, MatchPairInsert } from "@/features/match/types";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Single orchestration layer for Memories match data access.
 * Sub-repositories remain simple CRUD — all replace/delete-all flows live here.
 */
export class ExperienceMatchRepository extends Repository {
  private readonly pairsRepo: MatchPairsRepository;

  constructor(client: SupabaseClient) {
    super(client);
    this.pairsRepo = new MatchPairsRepository(client);
  }

  async findCompleteByExperienceId(
    experienceId: string,
  ): Promise<ExperienceMatch> {
    const pairs = await this.pairsRepo.findByExperienceId(experienceId);
    return { pairs };
  }

  async deleteAllByExperienceId(experienceId: string): Promise<void> {
    await this.pairsRepo.deleteByExperienceId(experienceId);
  }

  /**
   * Replace all match pairs for an experience (immutable draft pattern).
   * Deletes existing rows, then inserts new pairs sequentially.
   * Not a true DB transaction — partial failure may leave empty match data (MED-02 pattern).
   *
   * `finalUnlockMessage` is stored on `experiences` — updated by save service (Phase 3).
   */
  async replaceAllForExperience(
    experienceId: string,
    pairs: MatchPairInsert[],
  ): Promise<ExperienceMatch> {
    await this.pairsRepo.deleteByExperienceId(experienceId);
    const inserted = await this.pairsRepo.insertMany(experienceId, pairs);
    return { pairs: inserted };
  }
}
