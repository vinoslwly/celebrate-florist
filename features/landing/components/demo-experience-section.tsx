import type { WebsiteContent } from "@/features/website/config/types";

type DemoExperienceSectionProps = {
  content: WebsiteContent;
};

export function DemoExperienceSection({ content }: DemoExperienceSectionProps) {
  return (
    <section id="demo" className="section band">
      <div className="wrap narrow">
        <header className="section-head">
          <p className="eyebrow">{content.demo.eyebrow}</p>
          <h2>{content.demo.title}</h2>
          <p>{content.demo.body}</p>
        </header>
        <a className="btn btn-brand btn-lg" href={content.links.demoHref}>
          {content.demo.ctaLabel}
        </a>
      </div>
    </section>
  );
}
