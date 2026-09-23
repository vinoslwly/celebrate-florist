import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

/** Anonymous Theme Lab fixtures — Sky Moments; not real customer data. */
export const SKY_MOMENTS_LAB_EXPERIENCE = {
  id: "theme-lab-sky-moments",
  order_id: "theme-lab-order-sky",
  theme_id: "sky",
  experience_token: "theme-lab-sky",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "moments",
  quiz_title: null,
  final_unlock_message: null,
  letter_content:
    "Every soft blue sky reminds me of the calm you bring. Thank you for being the quiet light in my days. I made this little surprise just for you—open it gently, and feel every word written with care. You are my favorite clear morning.",
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
  created_at: "2026-07-24T00:00:00.000Z",
  updated_at: "2026-07-24T00:00:00.000Z",
} satisfies ExperienceRow;

/** Gallery stand-ins — Theme Lab only. Caption format: `Title · body`.
 * No-photo fixture: pass `[]` (Lab: `?noPhotos=1`) — host skips gallery → photobooth.
 */
export const SKY_MOMENTS_LAB_PHOTOS: PublishedPhoto[] = [
  {
    id: "sky-lab-photo-1",
    experience_id: "theme-lab-sky-moments",
    storage_path: "theme-lab-sky/coffee",
    sort_order: 0,
    caption: "First Hello · The sky felt wider the moment you walked in.",
    created_at: "2026-07-24T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/coffee.webp",
  },
  {
    id: "sky-lab-photo-2",
    experience_id: "theme-lab-sky-moments",
    storage_path: "theme-lab-sky/camera",
    sort_order: 1,
    caption:
      "Weekend Adventures · Little lenses, big skies, and us somewhere in between.",
    created_at: "2026-07-24T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/camera.webp",
  },
  {
    id: "sky-lab-photo-3",
    experience_id: "theme-lab-sky-moments",
    storage_path: "theme-lab-sky/coffee-traditions",
    sort_order: 2,
    caption:
      "Our Little Traditions · Soft mornings that somehow always find us.",
    created_at: "2026-07-24T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/coffee.webp",
  },
  {
    id: "sky-lab-photo-4",
    experience_id: "theme-lab-sky-moments",
    storage_path: "theme-lab-sky/ferris",
    sort_order: 3,
    caption:
      "Dreaming Together · Looking at the horizon like it already knew our names.",
    created_at: "2026-07-24T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/ferris.webp",
  },
  {
    id: "sky-lab-photo-5",
    experience_id: "theme-lab-sky-moments",
    storage_path: "theme-lab-sky/lights",
    sort_order: 4,
    caption:
      "And So It Continues… · Every quiet glow still feels like a promise.",
    created_at: "2026-07-24T00:00:00.000Z",
    signedUrl: "/themes/bloom/moments/gallery-fixtures/lights.webp",
  },
];
