import { Repository } from "@/lib/repositories/base";

import { QuizQuestionsRepository } from "@/features/quiz/repositories/quiz-questions.repository";
import { QuizScoreBandsRepository } from "@/features/quiz/repositories/quiz-score-bands.repository";
import type { ExperienceQuiz, QuizConfigReplace } from "@/features/quiz/types";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Aggregates quiz questions and score bands for an experience.
 * Data access only — no validation or business rules.
 */
export class ExperienceQuizRepository extends Repository {
  private readonly questionsRepo: QuizQuestionsRepository;
  private readonly bandsRepo: QuizScoreBandsRepository;

  constructor(client: SupabaseClient) {
    super(client);
    this.questionsRepo = new QuizQuestionsRepository(client);
    this.bandsRepo = new QuizScoreBandsRepository(client);
  }

  async findCompleteByExperienceId(
    experienceId: string,
  ): Promise<ExperienceQuiz> {
    const [questions, bands] = await Promise.all([
      this.questionsRepo.findByExperienceId(experienceId),
      this.bandsRepo.findByExperienceId(experienceId),
    ]);

    return { questions, bands };
  }

  async deleteAllByExperienceId(experienceId: string): Promise<void> {
    await this.bandsRepo.deleteByExperienceId(experienceId);
    await this.questionsRepo.deleteByExperienceId(experienceId);
  }

  /**
   * Replace all quiz data for an experience (immutable draft pattern).
   * Deletes existing rows, then inserts new questions and bands sequentially.
   * Not a true DB transaction — partial failure may leave empty quiz data.
   *
   * TODO(future): replace delete-then-insert with a transactional Supabase RPC
   * if stronger multi-table consistency is required (see MED-02 in docs/06_DEVELOPMENT_GUIDE.md).
   */
  async replaceAllForExperience(
    experienceId: string,
    config: QuizConfigReplace,
  ): Promise<ExperienceQuiz> {
    await this.deleteAllByExperienceId(experienceId);

    const questions = await this.questionsRepo.insertMany(
      experienceId,
      config.questions,
    );
    const bands = await this.bandsRepo.insertMany(experienceId, config.bands);

    return { questions, bands };
  }
}
