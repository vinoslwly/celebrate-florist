/**
 * FAQ content — verbatim from PRD-001 §8. Do not reword without a
 * founder/copy decision; Bible Celebrate Ch.7 treats copy as brand DNA.
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "duration",
    question: "Berapa lama proses pembuatannya?",
    answer: "Minimal pre-order 1 minggu sebelum tanggal yang diinginkan.",
  },
  {
    id: "custom",
    question: "Apakah bisa custom?",
    answer: "Bisa. Setiap Celebrate Experience dibuat khusus untuk order Anda.",
  },
  {
    id: "theme",
    question: "Apakah bisa pilih tema?",
    answer: "Bisa. Anda bisa memilih salah satu dari tiga Experience Theme.",
  },
  {
    id: "letter-content",
    question: "Apakah bisa request isi surat?",
    answer:
      "Bisa. Ceritakan kisah Anda, tim Celebrate akan membantu merangkainya.",
  },
  {
    id: "revision",
    question: "Apakah bisa revisi?",
    answer: "Bisa, selama Experience belum dipublish ke penerima.",
  },
];
