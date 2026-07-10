/**
 * "Choose Your Bouquet" catalog. Intentionally minimal placeholder
 * content — the founder will replace `description` and add real photos
 * per occasion once actual product photography exists. Do not treat
 * these descriptions as final copy.
 */
export type BouquetCatalogItem = {
  id: string;
  emoji: string;
  name: string;
  description: string;
  /**
   * Path under /public, e.g. "/bouquets/birthday.jpg". Leave
   * undefined until a real photo of this bouquet exists — the card
   * automatically falls back to a placeholder slot when this is
   * unset. To add a real photo: drop the file in
   * `public/bouquets/` and set this field, nothing else changes.
   */
  image?: string;
};

export const BOUQUET_CATALOG: BouquetCatalogItem[] = [
  {
    id: "birthday",
    emoji: "🌸",
    name: "Birthday Bouquet",
    description: "Cocok untuk kado ulang tahun sahabat atau pasangan.",
  },
  {
    id: "graduation",
    emoji: "🎓",
    name: "Graduation Bouquet",
    description: "Pilihan pas untuk momen kelulusan, wisuda, atau sidang.",
  },
  {
    id: "anniversary",
    emoji: "🤍",
    name: "Anniversary Bouquet",
    description: "Dirancang elegan untuk merayakan hari jadian Anda.",
  },
  {
    id: "friendship",
    emoji: "💐",
    name: "Friendship Bouquet",
    description: "Kado hangat untuk mengapresiasi sahabat terbaik.",
  },
  {
    id: "custom",
    emoji: "🧸",
    name: "Custom Bouquet",
    description: "Custom bunga, warna, dan tema ucapan sesuai keinginan Anda.",
  },
];
