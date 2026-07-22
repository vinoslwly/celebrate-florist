import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

/** Anonymous Theme Lab fixtures — Warm Moments; not real customer data. */
export const WARM_MOMENTS_LAB_EXPERIENCE = {
  id: "theme-lab-warm-moments",
  order_id: "theme-lab-order-warm",
  theme_id: "warm",
  experience_token: "theme-lab-warm",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "moments",
  quiz_title: null,
  final_unlock_message: null,
  letter_content:
    "Every moment with you feels so warm and precious. Thank you for being the soft place I land when the world feels loud. I made this little surprise just for you—open it with love, and feel every word I wrote from the heart. You are my favorite chapter.",
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
  created_at: "2026-07-21T00:00:00.000Z",
  updated_at: "2026-07-21T00:00:00.000Z",
} satisfies ExperienceRow;

/**
 * Theme Lab gallery fixtures for Warm Moments Scene 7.
 * Reuses Bloom mood plates as anonymous stand-ins (Theme Lab only).
 * Caption format: "Title · Body"
 */
export const WARM_MOMENTS_LAB_PHOTOS: PublishedPhoto[] = [
  {
    id: "warm-lab-photo-1",
    experience_id: "theme-lab-warm-moments",
    storage_path: "theme-lab-warm/coffee",
    sort_order: 0,
    caption:
      "First Coffee Together · The beginning of our everyday. A simple moment that means everything.",
    created_at: "2026-07-21T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/coffee.webp",
  },
  {
    id: "warm-lab-photo-2",
    experience_id: "theme-lab-warm-moments",
    storage_path: "theme-lab-warm/ferris",
    sort_order: 1,
    caption:
      "Sunset at the Ferris Wheel · The sky was beautiful, but you were prettier.",
    created_at: "2026-07-21T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/ferris.webp",
  },
  {
    id: "warm-lab-photo-3",
    experience_id: "theme-lab-warm-moments",
    storage_path: "theme-lab-warm/camera",
    sort_order: 2,
    caption: "Little Adventures · Collecting moments, not things.",
    created_at: "2026-07-21T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/camera.webp",
  },
  {
    id: "warm-lab-photo-4",
    experience_id: "theme-lab-warm-moments",
    storage_path: "theme-lab-warm/lights",
    sort_order: 3,
    caption: "Late Night Talks · The kind of talks that make time stand still.",
    created_at: "2026-07-21T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/lights.webp",
  },
];
