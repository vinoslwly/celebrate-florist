import type { WebsiteContent } from "@/features/website/config/types";

type FaqSectionProps = {
  content: WebsiteContent;
};

export function FaqSection({ content }: FaqSectionProps) {
  return (
    <section id="faq" className="section">
      <div className="wrap narrow">
        <header className="section-head">
          <p className="eyebrow">{content.faq.eyebrow}</p>
          <h2>{content.faq.title}</h2>
        </header>
        <div className="faq">
          {content.faq.items.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
