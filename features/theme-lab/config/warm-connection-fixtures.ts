import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import { WARM_MOMENTS_LAB_PHOTOS } from "@/features/theme-lab/config/warm-moments-fixtures";

/** Anonymous Theme Lab fixtures — Warm Connection; not real customer data. */
export const WARM_CONNECTION_LAB_EXPERIENCE = {
  id: "theme-lab-warm-connection",
  order_id: "theme-lab-order-warm-connection",
  theme_id: "warm",
  experience_token: "theme-lab-warm-connection",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "connection",
  quiz_title: "How well do you know me?",
  final_unlock_message: null,
  letter_content:
    "Every moment with you feels so warm and precious. I made this little surprise just for you—open it with love, and feel every word I wrote from the heart.",
  letter_closing: "With love,",
  /** Synthetic stub — Theme Lab never verifies Memory Codes. */
  memory_key_hash: "theme-lab",
  status: "published",
  is_opened: true,
  is_locked: false,
  locked_reason: null,
  qr_storage_path: null,
  content_locked_at: null,
  first_opened_at: null,
  last_accessed_at: null,
  published_at: null,
  archived_at: null,
  created_at: "2026-07-22T00:00:00.000Z",
  updated_at: "2026-07-22T00:00:00.000Z",
} satisfies ExperienceRow;

/** Reuse Moments gallery stand-ins for later Connection gallery scenes. */
export const WARM_CONNECTION_LAB_PHOTOS: PublishedPhoto[] =
  WARM_MOMENTS_LAB_PHOTOS;

export type WarmConnectionLabQuestion = {
  sortOrder: number;
  prompt: string;
  options: [string, string, string, string];
};

export type WarmConnectionLabQuiz = {
  quizTitle: string;
  questions: WarmConnectionLabQuestion[];
};

/**
 * Synthetic Connection quiz for Theme Lab Scene 6.
 * Five questions match the Founder progress-rail reference.
 * No correct answers — no Correct/Wrong feedback during quiz.
 */
export const WARM_CONNECTION_LAB_QUIZ: WarmConnectionLabQuiz = {
  quizTitle: "How well do you know me?",
  questions: [
    {
      sortOrder: 0,
      prompt: "Which movie did we watch on our first date?",
      options: [
        "About Time",
        "La La Land",
        "500 Days of Summer",
        "Notting Hill",
      ],
    },
    {
      sortOrder: 1,
      prompt: "What is my go-to comfort drink?",
      options: [
        "Iced matcha latte",
        "Hot chocolate",
        "Earl Grey tea",
        "Fresh orange juice",
      ],
    },
    {
      sortOrder: 2,
      prompt: "Where do I love spending quiet Sundays?",
      options: [
        "A cozy bookstore café",
        "The city park",
        "At home with a film",
        "By the seaside",
      ],
    },
    {
      sortOrder: 3,
      prompt: "Which flower always makes me smile?",
      options: ["Peonies", "Sunflowers", "Roses", "Lavender"],
    },
    {
      sortOrder: 4,
      prompt: "What do I value most in our connection?",
      options: [
        "Honest conversations",
        "Shared adventures",
        "Quiet togetherness",
        "Thoughtful surprises",
      ],
    },
  ],
};

/**
 * Synthetic quiz grade for Theme Lab Scene 8 — warm celebratory tone (CF-1).
 * Production uses ConnectionQuizSubmitResult.result after submit.
 */
export const WARM_CONNECTION_LAB_SCORE_RESULT = {
  percent: 92,
  headline: "You know me pretty well.",
  message:
    "You always notice the little things, and that means more than you know.",
} as const;

export type WarmConnectionLabScoreResult =
  typeof WARM_CONNECTION_LAB_SCORE_RESULT;
