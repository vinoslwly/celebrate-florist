import type { ExperienceRow } from "@/types/database";

import { BLOOM_MOMENTS_LAB_PHOTOS } from "@/features/theme-lab/config/bloom-moments-fixtures";

/** Anonymous Theme Lab fixtures — Treasures mode; not real customer data. */
export const BLOOM_TREASURES_LAB_EXPERIENCE = {
  id: "theme-lab-treasures",
  order_id: "theme-lab-order-treasures",
  theme_id: "bloom",
  experience_token: "theme-lab-treasures",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "treasures",
  quiz_title: null,
  final_unlock_message: null,
  letter_content:
    "Inside these gifts are pieces of us. Open each one when you are ready—the last one holds my letter.",
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
  created_at: "2026-07-21T00:00:00.000Z",
  updated_at: "2026-07-21T00:00:00.000Z",
} satisfies ExperienceRow;

/**
 * Gallery plates for later Treasures scenes — reuse Moments fixtures.
 */
export { BLOOM_MOMENTS_LAB_PHOTOS as BLOOM_TREASURES_LAB_PHOTOS } from "@/features/theme-lab/config/bloom-moments-fixtures";

/** Theme Lab envelope micro-content (Scene 7) — not the primary reward letter. */
export type BloomTreasuresLabEnvelope = {
  sortOrder: number;
  isFinal: boolean;
  /** Founder-facing card title (letter object). */
  title: string;
  messageText: string | null;
  photoUrl: string | null;
};

const photo = (index: number) =>
  BLOOM_MOMENTS_LAB_PHOTOS[index]?.signedUrl ?? null;

/**
 * Six lab gifts (5 standard + Final Gold). Messages are synthetic Theme Lab copy.
 */
export const BLOOM_TREASURES_LAB_ENVELOPES: BloomTreasuresLabEnvelope[] = [
  {
    sortOrder: 1,
    isFinal: false,
    title: "Envelope 1",
    messageText: "Aku suka Kamu Sewaktu pertama kali",
    photoUrl: photo(0),
  },
  {
    sortOrder: 2,
    isFinal: false,
    title: "Envelope 2",
    messageText:
      "Terima kasih sudah jadi rumah yang tenang di hari-hari yang ramai.",
    photoUrl: photo(1),
  },
  {
    sortOrder: 3,
    isFinal: false,
    title: "Envelope 3",
    messageText: "Momen kecil kita selalu terasa seperti hadiah.",
    photoUrl: photo(2),
  },
  {
    sortOrder: 4,
    isFinal: false,
    title: "Envelope 4",
    messageText:
      "Kalau aku bisa mengulang satu hari, aku pilih hari kita tertawa sampai lupa waktu.",
    photoUrl: photo(3),
  },
  {
    sortOrder: 5,
    isFinal: false,
    title: "Envelope 5",
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

export function getBloomTreasuresLabEnvelope(
  sortOrder: number,
): BloomTreasuresLabEnvelope | undefined {
  return BLOOM_TREASURES_LAB_ENVELOPES.find((e) => e.sortOrder === sortOrder);
}
