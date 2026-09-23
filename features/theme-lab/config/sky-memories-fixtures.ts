import type { ExperienceRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import { SKY_MOMENTS_LAB_PHOTOS } from "@/features/theme-lab/config/sky-moments-fixtures";

/** One memory screen — photo first, three story options. */
export type SkyMemoriesLabStoryOption = {
  title: string;
  body: string;
  sortOrder: number;
};

export type SkyMemoriesLabMatchPair = {
  photoSortOrder: number;
  photoSignedUrl: string;
  photoAlt: string;
  storyOptions: [
    SkyMemoriesLabStoryOption,
    SkyMemoriesLabStoryOption,
    SkyMemoriesLabStoryOption,
  ];
};

export type SkyMemoriesLabMatch = {
  pairs: SkyMemoriesLabMatchPair[];
};

/** Anonymous Theme Lab fixtures — Sky Memories; not real customer data. */
export const SKY_MEMORIES_LAB_EXPERIENCE = {
  id: "theme-lab-sky-memories",
  order_id: "theme-lab-order-sky-memories",
  theme_id: "sky",
  experience_token: "theme-lab-sky-memories",
  greeting_name: "Alex",
  closing_name: "Jordan",
  event_type: "friendship",
  experience_mode: "memories",
  quiz_title: null,
  final_unlock_message: "These memories were always ours.",
  letter_content:
    "Every shared moment with you lives under this soft blue sky. Match a few of them, and a surprise waits for you.",
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
  created_at: "2026-07-31T00:00:00.000Z",
  updated_at: "2026-07-31T00:00:00.000Z",
} satisfies ExperienceRow;

/** Reuse Moments gallery stand-ins for later Memories gallery scenes. */
export const SKY_MEMORIES_LAB_PHOTOS: PublishedPhoto[] = SKY_MOMENTS_LAB_PHOTOS;

/**
 * Theme Lab match pairs — emotional synthetic stories (not real customer data).
 * Four memories; photos reuse Moments gallery plates.
 */
export const SKY_MEMORIES_LAB_MATCH: SkyMemoriesLabMatch = {
  pairs: [
    {
      photoSortOrder: 0,
      photoSignedUrl: "/themes/bloom/moments/gallery-fixtures/coffee.webp",
      photoAlt: "A warm letter moment under soft light",
      storyOptions: [
        {
          sortOrder: 0,
          title: "Kado Surat",
          body: "Waktu kamu kaget dan bahagia pas baca surat kejutan dari aku…",
        },
        {
          sortOrder: 1,
          title: "Tur Waktu",
          body: "kamu ketiduran pas kita lagi asyik cerita di malam itu…",
        },
        {
          sortOrder: 2,
          title: "Makan Malam",
          body: "Waktu kamu cerita konyol pas kita makan malam di restoran baru…",
        },
      ],
    },
    {
      photoSortOrder: 1,
      photoSignedUrl: "/themes/bloom/moments/gallery-fixtures/ferris.webp",
      photoAlt: "Sunset by the ferris wheel",
      storyOptions: [
        {
          sortOrder: 0,
          title: "Ferris Wheel",
          body: "Waktu langit jingga dan kamu bilang hari ini terasa abadi…",
        },
        {
          sortOrder: 1,
          title: "Hujan Gerimis",
          body: "Waktu kita berlari basah-basahan sambil tertawa…",
        },
        {
          sortOrder: 2,
          title: "Bioskop",
          body: "Waktu kamu memegang tanganku diam-diam di gelap bioskop…",
        },
      ],
    },
    {
      photoSortOrder: 2,
      photoSignedUrl: "/themes/bloom/moments/gallery-fixtures/camera.webp",
      photoAlt: "Little adventures with a camera",
      storyOptions: [
        {
          sortOrder: 0,
          title: "Petualangan Kecil",
          body: "Waktu kamu bilang “satu foto lagi” tapi yang tersimpan adalah senyummu…",
        },
        {
          sortOrder: 1,
          title: "Piknik",
          body: "Waktu bekalmu berantakan dan kita tertawa sampai kenyang…",
        },
        {
          sortOrder: 2,
          title: "Surat Rahasia",
          body: "Waktu kamu kaget dan bahagia pas baca surat kejutan dari aku…",
        },
      ],
    },
    {
      photoSortOrder: 3,
      photoSignedUrl: "/themes/bloom/moments/gallery-fixtures/lights.webp",
      photoAlt: "Late night talks under soft lights",
      storyOptions: [
        {
          sortOrder: 0,
          title: "Obrolan Malam",
          body: "Waktu jam berhenti dan kita lupa dunia ada di luar…",
        },
        {
          sortOrder: 1,
          title: "Ulang Tahun",
          body: "Waktu kamu terkejut melihat kue yang aku bawa diam-diam…",
        },
        {
          sortOrder: 2,
          title: "Lagu Favorit",
          body: "Waktu lagu favoritmu diputar dan kita ikut bernyanyi…",
        },
      ],
    },
  ],
};

/** Synthetic match grade for later score-reveal (holds until Scene 7–8). */
export type SkyMemoriesLabScoreResult = {
  percent: number;
  headline: string;
  message: string;
};

export const SKY_MEMORIES_LAB_SCORE_RESULT: SkyMemoriesLabScoreResult = {
  percent: 92,
  headline: "You know these memories well.",
  message: "Every soft sky holds a piece of your story together.",
};
