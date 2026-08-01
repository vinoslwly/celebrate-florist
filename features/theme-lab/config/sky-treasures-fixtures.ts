import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import { SKY_MOMENTS_LAB_PHOTOS } from "@/features/theme-lab/config/sky-moments-fixtures";

/** Anonymous Theme Lab fixtures — Sky Treasures; not real customer data. */
export const SKY_TREASURES_LAB_EXPERIENCE = {
  id: "theme-lab-sky-treasures",
  order_id: "theme-lab-order-sky-treasures",
  theme_id: "sky",
  experience_token: "theme-lab-sky-treasures",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "treasures",
  quiz_title: null,
  final_unlock_message: null,
  letter_content:
    "Inside these gifts are pieces of us under a soft blue sky. Open each one when you are ready—the last one holds my letter.",
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
  created_at: "2026-08-01T00:00:00.000Z",
  updated_at: "2026-08-01T00:00:00.000Z",
} satisfies ExperienceRow;

/** Gallery stand-ins for later Treasures scenes — reuse Moments fixtures. */
export const SKY_TREASURES_LAB_PHOTOS: PublishedPhoto[] =
  SKY_MOMENTS_LAB_PHOTOS;

/** Theme Lab envelope micro-content (Scene 7) — not the primary reward letter. */
export type SkyTreasuresLabEnvelope = {
  sortOrder: number;
  isFinal: boolean;
  title: string;
  messageText: string | null;
  photoUrl: string | null;
};

const photo = (index: number) =>
  SKY_MOMENTS_LAB_PHOTOS[index]?.signedUrl ?? null;

/** Six lab gifts (5 sky + Final Pearl / white). Synthetic Theme Lab copy. */
export const SKY_TREASURES_LAB_ENVELOPES: SkyTreasuresLabEnvelope[] = [
  {
    sortOrder: 1,
    isFinal: false,
    title: "Gift 1",
    messageText: "Aku suka kamu sejak pertama kali kita bertemu.",
    photoUrl: photo(0),
  },
  {
    sortOrder: 2,
    isFinal: false,
    title: "Gift 2",
    messageText:
      "Terima kasih sudah jadi rumah yang tenang di hari-hari yang ramai.",
    photoUrl: photo(1),
  },
  {
    sortOrder: 3,
    isFinal: false,
    title: "Gift 3",
    messageText: "Momen kecil kita selalu terasa seperti hadiah.",
    photoUrl: photo(2),
  },
  {
    sortOrder: 4,
    isFinal: false,
    title: "Gift 4",
    messageText:
      "Kalau aku bisa mengulang satu hari, aku pilih hari kita tertawa sampai lupa waktu.",
    photoUrl: photo(3),
  },
  {
    sortOrder: 5,
    isFinal: false,
    title: "Gift 5",
    messageText: "Kamu membuat biasa menjadi berharga.",
    photoUrl: photo(0),
  },
  {
    sortOrder: 6,
    isFinal: true,
    title: "Final Treasure",
    messageText:
      "Ini hadiah terakhirku untukmu di grid ini—surat utama menunggu setelah semuanya terbuka.",
    photoUrl: photo(1),
  },
];

export function getSkyTreasuresLabEnvelope(
  sortOrder: number,
): SkyTreasuresLabEnvelope | undefined {
  return SKY_TREASURES_LAB_ENVELOPES.find((e) => e.sortOrder === sortOrder);
}
