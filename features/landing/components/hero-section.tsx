import Image from "next/image";

import { websiteOrderLink } from "@/features/website/config/order-link";
import type { WebsiteContent } from "@/features/website/config/types";

type HeroSectionProps = {
  content: WebsiteContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  const { hero } = content;
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow script-accent">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero-cta">
            <a
              className="btn btn-brand btn-lg"
              href={websiteOrderLink(content)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hero.ctaLabel}
            </a>
            <a className="btn btn-outline btn-lg" href={content.links.demoHref}>
              {hero.demoLabel}
            </a>
          </div>
        </div>
        <figure className="hero-art hero-art--bloom">
          <Image
            src={hero.imageUrl}
            alt="Pratinjau experience Celebrate Florist"
            width={1536}
            height={1024}
            priority
          />
          <figcaption>{hero.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
