import { FAQ_ITEMS } from "@/features/landing/config/faq";
import {
  BRAND_LOGO,
  HERO_BOUQUET_PHOTO,
  THEME_PREVIEW_IMAGES,
} from "@/features/landing/config/hero-media";
import {
  BOUQUET_CATALOG_URL,
  DEMO_HREF,
  INSTAGRAM_URL,
} from "@/features/landing/config/marketing-links";
import type { WebsiteContent } from "@/features/website/config/types";

export const WEBSITE_SETTINGS_KEY = "website";

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  brand: {
    logoUrl: BRAND_LOGO,
    faviconUrl: "/icon.png",
    siteTitle: "Celebrate Florist — Every Flower Tells a Story",
    siteDescription:
      "Buket fisik bertemu kejutan digital yang emosional. Pesan Celebrate Experience di Surakarta.",
  },
  colors: {
    cream: "#fff5ed",
    rose: "#e56d8e",
    gold: "#ecbbba",
    ink: "#5c2a3a",
  },
  whatsapp: {
    number: "6281234567890",
    orderMessage: "Halo Celebrate Florist, saya ingin merayakan momen spesial.",
  },
  links: {
    bouquetUrl: BOUQUET_CATALOG_URL,
    instagramUrl: INSTAGRAM_URL,
    demoHref: DEMO_HREF,
  },
  hero: {
    eyebrow: "Celebrate Florist",
    title: "Every Flower Tells a Story",
    lead: "Di balik setiap bunga, selalu ada cerita yang ingin disimpan. Celebrate Florist menghadirkan kuang kecil untuk meninggalkan pesan, berbagi foto, mengabadikan momen bersama, dan membuka kembali kenangan yang pernah berarti.",
    ctaLabel: "Let's Celebrate →",
    demoLabel: "Coba experience",
    imageUrl: HERO_BOUQUET_PHOTO,
    caption: "Surakarta",
  },
  whatIs: {
    eyebrow: "Apa itu Celebrate",
    title: "More Than a Bouquet",
    body: "Celebrate hadir untuk membuat momen memberi bunga terasa lebih personal, lebih berarti, dan lebih berkesan. Kami percaya, buket bukan hanya tentang apa yang terlihat. Di baliknya ada pesan yang ingin disampaikan, foto yang ingin dikenang, cerita yang ingin dibagikan, ataupun kejutan kecil. Karena itu, setiap buket Celebrate punya cara tersendiri untuk membawa penerimanya masuk lebih jauh ke dalam cerita.",
  },
  whyUs: {
    eyebrow: "Mengapa Celebrate",
    title: "Karena setiap momen layak dirayakan.",
  },
  bouquet: {
    eyebrow: "Bouquet",
    title: "Pilih buket favoritmu.",
    body: "Lihat katalog rangkaian bunga kami — lalu ceritakan momennya lewat WhatsApp, dan kami yang merangkai sisanya.",
    ctaLabel: "Lihat Katalog Bouquet →",
  },
  experience: {
    eyebrow: "Experience",
    title: 'PILIH YANG PALING "DIA".',
    intro:
      "Setiap orang punya cara sendiri untuk merasa spesial. Ada yang suka romantis, ada yang suka hal gemas, ada juga yang suka sesuatu yang manis dan cantik. Pilih tema yang paling cocok dengan vibe-nya!",
    themes: [
      {
        slug: "bloom",
        name: "Lovey",
        description:
          "Pink lembut, bunga manis, dan sedikit rasa sayang yang susah dijelasin.",
        imageUrl: THEME_PREVIEW_IMAGES.lovey,
      },
      {
        slug: "warm",
        name: "Darling",
        description:
          "Untuk seseorang yang kamu sayang, yang rasanya kurang kalau cuma bilang “aku sayang kamu.”",
        imageUrl: THEME_PREVIEW_IMAGES.darling,
      },
      {
        slug: "sky",
        name: "Cloudie",
        description:
          "Biru lembut, awan putih, dan si kecil teddy bear yang siap ikut merayakan.",
        imageUrl: THEME_PREVIEW_IMAGES.cloudie,
      },
    ],
  },
  demo: {
    eyebrow: "Demo",
    title: "Penasaran apa yang ada di balik QR-nya?",
    body: "Sebelum doi yang buka, kamu boleh intip dulu loh. ♡",
    ctaLabel: "Coba demo Lovey →",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Masih penasaran?",
    items: FAQ_ITEMS,
  },
  finalCta: {
    eyebrow: "Celebrate",
    title: "Ceritakan semua momennya…",
    body: "Setiap bunga punya cerita. Biar kami yang merangkainya jadi kejutan yang tak terlupakan.",
    ctaLabel: "Let's Celebrate →",
  },
  footer: {
    copyright: "© 2026 Celebrate Florist, Surakarta.",
  },
};
