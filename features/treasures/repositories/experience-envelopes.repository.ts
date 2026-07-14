import { Repository } from "@/lib/repositories/base";

import type {
  ExperienceEnvelopeOpenRow,
  ExperienceEnvelopeRow,
} from "@/types/database";

import { EnvelopeOpensRepository } from "@/features/treasures/repositories/envelope-opens.repository";
import {
  EnvelopesRepository,
  type EnvelopeInsert,
} from "@/features/treasures/repositories/envelopes.repository";

import type { SupabaseClient } from "@supabase/supabase-js";

/** Full Treasures data payload for an experience — envelopes plus open progress. */
export type ExperienceEnvelopesData = {
  envelopes: ExperienceEnvelopeRow[];
  opens: ExperienceEnvelopeOpenRow[];
};

/**
 * Single orchestration layer for Treasures envelope data access (LOW-06).
 * Sub-repositories remain simple CRUD — replace/delete-all flows live here.
 */
export class ExperienceEnvelopesRepository extends Repository {
  private readonly envelopesRepo: EnvelopesRepository;
  private readonly opensRepo: EnvelopeOpensRepository;

  constructor(client: SupabaseClient) {
    super(client);
    this.envelopesRepo = new EnvelopesRepository(client);
    this.opensRepo = new EnvelopeOpensRepository(client);
  }

  async findEnvelopesByExperienceId(
    experienceId: string,
  ): Promise<ExperienceEnvelopeRow[]> {
    return this.envelopesRepo.findByExperienceId(experienceId);
  }

  /**
   * Envelopes plus recipient open rows — service_role / admin client only.
   * Studio paths must use findEnvelopesByExperienceId (opens are not admin-readable).
   */
  async findCompleteByExperienceId(
    experienceId: string,
  ): Promise<ExperienceEnvelopesData> {
    const [envelopes, opens] = await Promise.all([
      this.envelopesRepo.findByExperienceId(experienceId),
      this.opensRepo.findByExperienceId(experienceId),
    ]);

    return { envelopes, opens };
  }

  async deleteAllByExperienceId(experienceId: string): Promise<void> {
    await this.opensRepo.deleteByExperienceId(experienceId);
    await this.envelopesRepo.deleteByExperienceId(experienceId);
  }

  /**
   * Replace all envelope content for an experience (immutable draft pattern).
   * Deletes existing envelope rows, then inserts new ones sequentially.
   * Does not modify open progress — recipient opens are separate (FD-T2).
   * Not a true DB transaction — partial failure may leave empty envelope data.
   */
  async replaceAllForExperience(
    experienceId: string,
    envelopes: EnvelopeInsert[],
  ): Promise<ExperienceEnvelopeRow[]> {
    await this.envelopesRepo.deleteByExperienceId(experienceId);
    return this.envelopesRepo.insertMany(experienceId, envelopes);
  }
}
