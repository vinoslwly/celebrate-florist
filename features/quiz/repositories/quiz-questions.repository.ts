import { Repository } from "@/lib/repositories/base";

import type { QuizQuestionRow } from "@/types/database";

import type { QuizQuestionInsert } from "@/features/quiz/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export class QuizQuestionsRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async findByExperienceId(experienceId: string): Promise<QuizQuestionRow[]> {
    const { data, error } = await this.client
      .from("experience_quiz_questions")
      .select("*")
      .eq("experience_id", experienceId)
      .order("sort_order", { ascending: true });

    this.assertNoError(error);
    return (data ?? []) as QuizQuestionRow[];
  }

  async findByExperienceAndSortOrder(
    experienceId: string,
    sortOrder: number,
  ): Promise<QuizQuestionRow | null> {
    const { data, error } = await this.client
      .from("experience_quiz_questions")
      .select("*")
      .eq("experience_id", experienceId)
      .eq("sort_order", sortOrder)
      .maybeSingle();

    this.assertNoError(error);
    return data as QuizQuestionRow | null;
  }

  async countByExperienceId(experienceId: string): Promise<number> {
    const { count, error } = await this.client
      .from("experience_quiz_questions")
      .select("id", { count: "exact", head: true })
      .eq("experience_id", experienceId);

    this.assertNoError(error);
    return count ?? 0;
  }

  async insertQuestion(
    experienceId: string,
    question: QuizQuestionInsert,
  ): Promise<QuizQuestionRow> {
    const { data, error } = await this.client
      .from("experience_quiz_questions")
      .insert({
        experience_id: experienceId,
        sort_order: question.sortOrder,
        prompt: question.prompt,
        options: question.options,
        correct_option_index: question.correctOptionIndex,
      })
      .select("*")
      .single();

    this.assertNoError(error);
    return data as QuizQuestionRow;
  }

  async insertMany(
    experienceId: string,
    questions: QuizQuestionInsert[],
  ): Promise<QuizQuestionRow[]> {
    if (questions.length === 0) {
      return [];
    }

    const { data, error } = await this.client
      .from("experience_quiz_questions")
      .insert(
        questions.map((question) => ({
          experience_id: experienceId,
          sort_order: question.sortOrder,
          prompt: question.prompt,
          options: question.options,
          correct_option_index: question.correctOptionIndex,
        })),
      )
      .select("*");

    this.assertNoError(error);
    return (data ?? []) as QuizQuestionRow[];
  }

  async deleteById(id: string): Promise<QuizQuestionRow> {
    const { data, error } = await this.client
      .from("experience_quiz_questions")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    this.assertNoError(error);
    return data as QuizQuestionRow;
  }

  async deleteByExperienceId(experienceId: string): Promise<void> {
    const { error } = await this.client
      .from("experience_quiz_questions")
      .delete()
      .eq("experience_id", experienceId);

    this.assertNoError(error);
  }

  /**
   * Immutable draft pattern — delete all questions for an experience, then insert.
   * Not a true DB transaction; callers must enforce draft-only writes.
   */
  async replaceAllForExperience(
    experienceId: string,
    questions: QuizQuestionInsert[],
  ): Promise<QuizQuestionRow[]> {
    await this.deleteByExperienceId(experienceId);
    return this.insertMany(experienceId, questions);
  }
}
