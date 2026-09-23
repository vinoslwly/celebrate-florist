import type { WebsiteContent } from "@/features/website/config/types";

const REASONS = [
  {
    index: "01",
    title: "Dibuat Khusus",
    description:
      "Setiap experience ditulis dan ditinjau sebelum sampai ke penerima — bukan template mentah, tapi cerita yang benar-benar milik Anda.",
  },
  {
    index: "02",
    title: "Ada Cerita di Dalamnya",
    description:
      "Surat, foto, video, dan photobooth dirangkai jadi satu alur yang hangat — seperti membuka amplop dari seseorang yang sayang.",
  },
  {
    index: "03",
    title: "Sudah Punya Tanggalnya",
    description:
      "Pre-order minimal H-2 untuk Surakarta — supaya bunga segar, greeting rapi, dan waktu antar bisa diandalkan.",
  },
];

type WhyUsSectionProps = {
  content: WebsiteContent;
};

export function WhyUsSection({ content }: WhyUsSectionProps) {
  return (
    <section id="why-us" className="section band">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">{content.whyUs.eyebrow}</p>
          <h2>{content.whyUs.title}</h2>
        </header>
        <div className="grid-3">
          {REASONS.map((reason) => (
            <article key={reason.index}>
              <span className="feature-index">{reason.index}</span>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
