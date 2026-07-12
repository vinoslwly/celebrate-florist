import type { QuizQuestionRow, QuizScoreBandRow } from "@/types/database";

/** Starter template identifiers — application config only (Phase 3). */
export type QuizTemplateId =
  "anniversary" | "graduation" | "birthday" | "proposal";

/** Full quiz payload for an experience — questions + score bands. */
export type ExperienceQuiz = {
  questions: QuizQuestionRow[];
  bands: QuizScoreBandRow[];
};

/** Draft question row for insert/replace (no server-generated fields). */
export type QuizQuestionInsert = {
  sortOrder: number;
  prompt: string;
  options: [string, string, string];
  correctOptionIndex: number;
};

/** Draft score band row for insert/replace (no server-generated fields). */
export type QuizScoreBandInsert = {
  minPercent: number;
  maxPercent: number;
  message: string;
};

/** Atomic replace payload for immutable draft edits. */
export type QuizConfigReplace = {
  questions: QuizQuestionInsert[];
  bands: QuizScoreBandInsert[];
};

/** Starter template definition — application config only. */
export type QuizTemplateDefinition = {
  id: QuizTemplateId;
  quizTitle: string;
  questions: QuizQuestionInsert[];
  bands: QuizScoreBandInsert[];
};

/** Recipient answer for a single question — not persisted (OD-5). */
export type QuizAnswerSubmission = {
  sortOrder: number;
  selectedOptionIndex: number;
};

/** Server-side grading result — stateless, no DB write. */
export type QuizGradeResult = {
  percent: number;
  correctCount: number;
  totalQuestions: number;
  message: string;
};

/** Input shape for quiz configuration validation. */
export type QuizConfigValidationInput = {
  questions: QuizQuestionInsert[];
  bands: QuizScoreBandInsert[];
};

/** Recipient-safe question — never includes correct_option_index. */
export type RecipientQuizQuestion = {
  sortOrder: number;
  prompt: string;
  options: [string, string, string];
};

/** Quiz content safe to render before submission. */
export type RecipientQuizView = {
  quizTitle: string | null;
  questions: RecipientQuizQuestion[];
};

/** Score band message safe for buyer preview (no answers). */
export type PreviewQuizBandView = {
  minPercent: number;
  maxPercent: number;
  message: string;
};

/** Buyer preview quiz — questions + bands, no correct answers. */
export type PreviewQuizView = {
  quizTitle: string | null;
  questions: RecipientQuizQuestion[];
  bands: PreviewQuizBandView[];
};

/** Cached client session result after submit (sessionStorage only). */
export type RecipientQuizSessionResult = QuizGradeResult;
