import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import { SKY_MOMENTS_LAB_PHOTOS } from "@/features/theme-lab/config/sky-moments-fixtures";

/** Anonymous Theme Lab fixtures — Sky Connection; not real customer data. */
export const SKY_CONNECTION_LAB_EXPERIENCE = {
  id: "theme-lab-sky-connection",
  order_id: "theme-lab-order-sky-connection",
  theme_id: "sky",
  experience_token: "theme-lab-sky-connection",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "connection",
  quiz_title: "How well do you know me?",
  final_unlock_message: null,
  letter_content:
    "Every soft blue sky reminds me of the calm you bring. I made this little surprise just for you—open it gently, and feel every word written with care.",
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
  photobooth_strip_source: "catalog",
  ending_message:
    "Hadiah ini milikmu. Buka lagi kapan saja —\nkenangannya tetap di sini.",
  created_at: "2026-07-30T00:00:00.000Z",
  updated_at: "2026-07-30T00:00:00.000Z",
} satisfies ExperienceRow;

/** Reuse Moments gallery stand-ins for later Connection gallery scenes. */
export const SKY_CONNECTION_LAB_PHOTOS: PublishedPhoto[] =
  SKY_MOMENTS_LAB_PHOTOS;

export type SkyConnectionLabQuestion = {
  sortOrder: number;
  prompt: string;
  options: [string, string, string, string];
};

export type SkyConnectionLabQuiz = {
  quizTitle: string;
  questions: SkyConnectionLabQuestion[];
};

/**
 * Synthetic Connection quiz for Theme Lab Scene 6.
 * Five questions match the Founder progress-rail reference.
 * No correct answers — no Correct/Wrong feedback during quiz.
 */
export const SKY_CONNECTION_LAB_QUIZ: SkyConnectionLabQuiz = {
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
 * Synthetic quiz grade for Theme Lab Scene 8 — matches Founder reference tone (CF-1 warm).
 * Production uses ConnectionQuizSubmitResult.result after submit.
 */
export const SKY_CONNECTION_LAB_SCORE_RESULT = {
  percent: 92,
  headline: "You know me pretty well.",
  message:
    "You always notice the little things, and that means more than you know.",
} as const;

export type SkyConnectionLabScoreResult =
  typeof SKY_CONNECTION_LAB_SCORE_RESULT;
