import type { ExperienceRow } from "@/types/database";

/**
 * Theme Lab quiz question — presentation fixture.
 * Founder Scene 6 reference uses 4 options; production RecipientQuizView is 3.
 * Lab stays faithful to the living design; production mapping comes later.
 */
export type BloomConnectionLabQuestion = {
  sortOrder: number;
  prompt: string;
  options: [string, string, string, string];
};

export type BloomConnectionLabQuiz = {
  quizTitle: string;
  questions: BloomConnectionLabQuestion[];
};

/** Anonymous Theme Lab fixtures — Connection mode; not real customer data. */
export const BLOOM_CONNECTION_LAB_EXPERIENCE = {
  id: "theme-lab-connection",
  order_id: "theme-lab-order-connection",
  theme_id: "bloom",
  experience_token: "theme-lab-connection",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "connection",
  quiz_title: "How well do you know me?",
  final_unlock_message: null,
  letter_content:
    "Every moment with you feels so warm and precious. I made this little surprise just for you—open it with love, and feel every word I wrote from the heart.",
  letter_closing: "With love,",
  /** Synthetic stub — Theme Lab never verifies Memory Codes. Not a real hash. */
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
  created_at: "2026-07-20T00:00:00.000Z",
  updated_at: "2026-07-20T00:00:00.000Z",
} satisfies ExperienceRow;

/**
 * Synthetic Connection quiz for Theme Lab Scene 6.
 * Five questions match the Founder progress-rail reference.
 * No correct answers — CF feedback rules: no Correct/Wrong during quiz.
 */
export const BLOOM_CONNECTION_LAB_QUIZ: BloomConnectionLabQuiz = {
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
      options: ["Peonies", "Sunflowers", "Cherry blossoms", "Lavender"],
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
 * Synthetic quiz grade for Theme Lab Scene 8 — matches Founder reference tone (CF-1 warm).
 * Production uses ConnectionQuizSubmitResult.result after submit.
 */
export const BLOOM_CONNECTION_LAB_SCORE_RESULT = {
  percent: 92,
  headline: "You know me pretty well.",
  message:
    "You always notice the little things, and that means more than you know.",
} as const;

export type BloomConnectionLabScoreResult =
  typeof BLOOM_CONNECTION_LAB_SCORE_RESULT;

/**
 * Theme Lab gallery plates for Connection Scenes 12–14.
 * Same fixtures as Moments gallery (Founder: reuse Moments).
 */
export { BLOOM_MOMENTS_LAB_PHOTOS as BLOOM_CONNECTION_LAB_PHOTOS } from "@/features/theme-lab/config/bloom-moments-fixtures";
