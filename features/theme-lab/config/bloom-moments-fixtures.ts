import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

/** Anonymous Theme Lab fixtures — not real customer data. */
export const BLOOM_MOMENTS_LAB_EXPERIENCE = {
  id: "theme-lab-moments",
  order_id: "theme-lab-order",
  theme_id: "bloom",
  experience_token: "theme-lab",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "moments",
  quiz_title: null,
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
  photobooth_strip_source: "catalog",
  ending_message:
    "Hadiah ini milikmu. Buka lagi kapan saja —\nkenangannya tetap di sini.",
  created_at: "2026-07-19T00:00:00.000Z",
  updated_at: "2026-07-19T00:00:00.000Z",
} satisfies ExperienceRow;

/**
 * Theme Lab gallery fixtures — Founder Scene 8/9 sample memories.
 * Caption format: "Title · Body"
 * Photos: warm mood plates in /public/themes/bloom/moments/gallery-fixtures/
 */
export const BLOOM_MOMENTS_LAB_PHOTOS: PublishedPhoto[] = [
  {
    id: "lab-photo-1",
    experience_id: "theme-lab-moments",
    storage_path: "theme-lab/coffee",
    sort_order: 0,
    caption:
      "First Coffee Together · The beginning of our everyday. A simple moment that means everything.",
    created_at: "2026-07-19T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/coffee.webp",
  },
  {
    id: "lab-photo-2",
    experience_id: "theme-lab-moments",
    storage_path: "theme-lab/ferris",
    sort_order: 1,
    caption:
      "Sunset at the Ferris Wheel · The sky was beautiful, but you were prettier.",
    created_at: "2026-07-19T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/ferris.webp",
  },
  {
    id: "lab-photo-3",
    experience_id: "theme-lab-moments",
    storage_path: "theme-lab/camera",
    sort_order: 2,
    caption: "Little Adventures · Collecting moments, not things.",
    created_at: "2026-07-19T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/camera.webp",
  },
  {
    id: "lab-photo-4",
    experience_id: "theme-lab-moments",
    storage_path: "theme-lab/lights",
    sort_order: 3,
    caption: "Late Night Talks · The kind of talks that make time stand still.",
    created_at: "2026-07-19T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/lights.webp",
  },
];
