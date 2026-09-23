import type { WebsiteContent } from "@/features/website/config/types";

type BouquetCollectionSectionProps = {
  content: WebsiteContent;
};

export function BouquetCollectionSection({
  content,
}: BouquetCollectionSectionProps) {
  return (
    <section id="bouquet" className="section">
      <div className="wrap narrow">
        <header className="section-head">
          <p className="eyebrow">{content.bouquet.eyebrow}</p>
          <h2>{content.bouquet.title}</h2>
          <p>{content.bouquet.body}</p>
        </header>
        <a
          className="btn btn-brand btn-lg"
          href={content.links.bouquetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.bouquet.ctaLabel}
        </a>
      </div>
    </section>
  );
}
