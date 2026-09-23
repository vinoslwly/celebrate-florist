export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "duration",
    question: "Berapa lama pre-order-nya?",
    answer:
      "Kami membutuhkan waktu untuk merangkai semuanya dengan baik, jadi minimal pesan 2 hari sebelum tanggal yang kamu inginkan. Jangan mepet ya, biar kami punya waktu untuk bikin experience-nya ✨",
  },
  {
    id: "theme",
    question: "Bisa pilih tema?",
    answer:
      "Tentu. Kamu bisa pilih salah satu dari tiga Experience Theme kami: Darling, Cloudie, atau Lovey. Pilih yang paling terasa “ini dia banget.”",
  },
  {
    id: "letter-content",
    question: "Bisa request isi surat, foto, atau video?",
    answer:
      "Yes! Kirim foto, video, dan cerita yang ingin kamu sampaikan lewat WhatsApp. Kami yang bantu merangkainya menjadi experience, lalu kamu bisa melihat preview-nya sebelum QR dicetak.",
  },
  {
    id: "revision",
    question: "Kalau ada yang mau diubah, bisa revisi?",
    answer:
      "Bisa. ♡ Selama experience belum dipublish untuk penerima, kamu masih bisa mengajukan revisi. Jadi nggak perlu khawatir kalau ada bagian yang terasa kurang “kalian banget.”",
  },
  {
    id: "recipient-view",
    question: "Apa yang dilihat penerima setelah scan QR?",
    answer:
      "Di sinilah kejutannya dimulai. ♡ Penerima akan masuk ke halaman hadiah privat yang berisi interaksi digital mulai dari surat, rangkaian foto, video, hingga photobooth di bagian akhir.",
  },
];
