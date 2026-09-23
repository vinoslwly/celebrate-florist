import type { WebsiteContent } from "@/features/website/config/types";

const PILLARS = [
  {
    index: "01",
    title: "Buket yang Memorable",
    description:
      "Setiap buket dibuat bukan hanya untuk terlihat cantik, tetapi juga untuk terasa dekat dengan orang yang menerimanya.",
  },
  {
    index: "02",
    title: "Cerita di Balik Buket",
    description:
      "Temukan QR code di dalam buket dan buka kejutan yang sudah disiapkan khusus untukmu. Ada pesan, foto, video, hingga berbagai interaksi kecil yang membuat momen menerima bungamu terasa lebih berkesan.",
  },
  {
    index: "03",
    title: "Momen yang Bisa Diabadikan",
    description:
      "Bunga bisa berubah seiring waktu, tapi cerita di baliknya, selalu punya tempat untuk kembali. Ambil beberapa foto, pilih momen favoritmu, lalu cetak untuk disimpan sebagai pengingat tentang hari yang pernah begitu berarti.",
  },
];

type WhatIsCelebrateSectionProps = {
  content: WebsiteContent;
};

export function WhatIsCelebrateSection({
  content,
}: WhatIsCelebrateSectionProps) {
  return (
    <section id="what-is-celebrate" className="section">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">{content.whatIs.eyebrow}</p>
          <h2>{content.whatIs.title}</h2>
          <p>{content.whatIs.body}</p>
        </header>
        <div className="grid-3">
          {PILLARS.map((pillar) => (
            <article className="card" key={pillar.index}>
              <span className="feature-index">{pillar.index}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
