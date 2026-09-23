import Image from "next/image";

import type { WebsiteContent } from "@/features/website/config/types";

const THEME_CLASS: Record<string, string> = {
  bloom: "theme-card--bloom",
  warm: "theme-card--warm",
  sky: "theme-card--sky",
};

type ExperienceCollectionSectionProps = {
  content: WebsiteContent;
};

export function ExperienceCollectionSection({
  content,
}: ExperienceCollectionSectionProps) {
  return (
    <section id="experience" className="section band">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">{content.experience.eyebrow}</p>
          <h2>{content.experience.title}</h2>
          <p>{content.experience.intro}</p>
        </header>
        <div className="grid-3 theme-cards">
          {content.experience.themes.map((theme) => (
            <article
              className={`card theme-card ${THEME_CLASS[theme.slug] ?? ""}`}
              key={theme.slug}
            >
              <figure className="theme-preview">
                <Image
                  src={theme.imageUrl}
                  alt={`Tema ${theme.name}`}
                  width={1536}
                  height={1024}
                />
              </figure>
              <h3>{theme.name}</h3>
              <p>{theme.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
