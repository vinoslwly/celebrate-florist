import { websiteOrderLink } from "@/features/website/config/order-link";
import type { WebsiteContent } from "@/features/website/config/types";

type FinalCtaSectionProps = {
  content: WebsiteContent;
};

export function FinalCtaSection({ content }: FinalCtaSectionProps) {
  return (
    <section id="final-cta" className="section">
      <div className="wrap">
        <div className="cta-banner">
          <p className="eyebrow">{content.finalCta.eyebrow}</p>
          <h2>{content.finalCta.title}</h2>
          <p>{content.finalCta.body}</p>
          <a
            className="btn btn-brand btn-lg"
            href={websiteOrderLink(content)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.finalCta.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
