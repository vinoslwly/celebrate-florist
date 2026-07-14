import type { ThemeRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type { QuizGradeResult, RecipientQuizView } from "@/features/quiz/types";

/**
 * Safe experience fields for Connection Phase A (gate) payload.
 * Excludes letter_content, letter_closing, closing_name (CF-4).
 */
export type ConnectionGateExperience = {
  id: string;
  greeting_name: string;
  theme_id: string;
  experience_mode: "connection";
  quiz_title: string | null;
};

/** Phase A — initial Connection recipient load (quiz only, no reward content). */
export type ConnectionGatePayload = {
  experience: ConnectionGateExperience;
  theme: ThemeRow;
  quiz: RecipientQuizView;
};

/** Letter fields delivered only in Phase B after successful quiz submit (CF-4). */
export type ConnectionRewardLetter = {
  greetingName: string;
  letterContent: string;
  letterClosing: string;
  closingName: string;
};

/** Phase B — reward content unlocked after quiz submit. */
export type ConnectionRewardPayload = {
  letter: ConnectionRewardLetter;
  photos: PublishedPhoto[];
};

/** Full Connection submit response — grade result plus reward payload (Sprint 08R). */
export type ConnectionQuizSubmitResult = {
  result: QuizGradeResult;
  reward: ConnectionRewardPayload;
};
