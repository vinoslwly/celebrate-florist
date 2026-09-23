import { DEFAULT_WEBSITE_CONTENT } from "@/features/website/config/defaults";
import { isSafePublicHref } from "@/features/website/config/safe-href";
import type {
  WebsiteContent,
  WebsiteFaqItem,
  WebsiteThemeCard,
} from "@/features/website/config/types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function href(value: unknown, fallback: string): string {
  if (typeof value === "string" && isSafePublicHref(value)) {
    return value.trim();
  }
  return isSafePublicHref(fallback) ? fallback : "";
}

function mergeThemeCards(value: unknown): WebsiteThemeCard[] {
  const incoming = Array.isArray(value) ? value : [];
  return DEFAULT_WEBSITE_CONTENT.experience.themes.map((fallback, index) => {
    const row = asRecord(incoming[index]);
    const slug = fallback.slug;
    return {
      slug,
      name: text(row.name, fallback.name),
      description: text(row.description, fallback.description),
      imageUrl: href(row.imageUrl, fallback.imageUrl),
    };
  });
}

function mergeFaqItems(value: unknown): WebsiteFaqItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_WEBSITE_CONTENT.faq.items;
  }
  return value
    .map((item, index) => {
      const row = asRecord(item);
      const question = text(row.question, "");
      const answer = text(row.answer, "");
      if (!question || !answer) return null;
      return {
        id: text(row.id, `faq-${index + 1}`),
        question,
        answer,
      };
    })
    .filter((item): item is WebsiteFaqItem => item !== null);
}

export function mergeWebsiteContent(stored: unknown): WebsiteContent {
  const root = asRecord(stored);
  const brand = asRecord(root.brand);
  const colors = asRecord(root.colors);
  const whatsapp = asRecord(root.whatsapp);
  const links = asRecord(root.links);
  const hero = asRecord(root.hero);
  const whatIs = asRecord(root.whatIs);
  const whyUs = asRecord(root.whyUs);
  const bouquet = asRecord(root.bouquet);
  const experience = asRecord(root.experience);
  const demo = asRecord(root.demo);
  const faq = asRecord(root.faq);
  const finalCta = asRecord(root.finalCta);
  const footer = asRecord(root.footer);
  const defaults = DEFAULT_WEBSITE_CONTENT;

  return {
    brand: {
      logoUrl: href(brand.logoUrl, defaults.brand.logoUrl),
      faviconUrl: href(brand.faviconUrl, defaults.brand.faviconUrl),
      siteTitle: text(brand.siteTitle, defaults.brand.siteTitle),
      siteDescription: text(
        brand.siteDescription,
        defaults.brand.siteDescription,
      ),
    },
    colors: {
      cream: text(colors.cream, defaults.colors.cream),
      rose: text(colors.rose, defaults.colors.rose),
      gold: text(colors.gold, defaults.colors.gold),
      ink: text(colors.ink, defaults.colors.ink),
    },
    whatsapp: {
      number: text(whatsapp.number, defaults.whatsapp.number).replace(
        /\D/g,
        "",
      ),
      orderMessage: text(whatsapp.orderMessage, defaults.whatsapp.orderMessage),
    },
    links: {
      bouquetUrl: href(links.bouquetUrl, defaults.links.bouquetUrl),
      instagramUrl: href(links.instagramUrl, defaults.links.instagramUrl),
      demoHref: href(links.demoHref, defaults.links.demoHref),
    },
    hero: {
      eyebrow: text(hero.eyebrow, defaults.hero.eyebrow),
      title: text(hero.title, defaults.hero.title),
      lead: text(hero.lead, defaults.hero.lead),
      ctaLabel: text(hero.ctaLabel, defaults.hero.ctaLabel),
      demoLabel: text(hero.demoLabel, defaults.hero.demoLabel),
      imageUrl: href(hero.imageUrl, defaults.hero.imageUrl),
      caption: text(hero.caption, defaults.hero.caption),
    },
    whatIs: {
      eyebrow: text(whatIs.eyebrow, defaults.whatIs.eyebrow),
      title: text(whatIs.title, defaults.whatIs.title),
      body: text(whatIs.body, defaults.whatIs.body),
    },
    whyUs: {
      eyebrow: text(whyUs.eyebrow, defaults.whyUs.eyebrow),
      title: text(whyUs.title, defaults.whyUs.title),
    },
    bouquet: {
      eyebrow: text(bouquet.eyebrow, defaults.bouquet.eyebrow),
      title: text(bouquet.title, defaults.bouquet.title),
      body: text(bouquet.body, defaults.bouquet.body),
      ctaLabel: text(bouquet.ctaLabel, defaults.bouquet.ctaLabel),
    },
    experience: {
      eyebrow: text(experience.eyebrow, defaults.experience.eyebrow),
      title: text(experience.title, defaults.experience.title),
      intro: text(experience.intro, defaults.experience.intro),
      themes: mergeThemeCards(experience.themes),
    },
    demo: {
      eyebrow: text(demo.eyebrow, defaults.demo.eyebrow),
      title: text(demo.title, defaults.demo.title),
      body: text(demo.body, defaults.demo.body),
      ctaLabel: text(demo.ctaLabel, defaults.demo.ctaLabel),
    },
    faq: {
      eyebrow: text(faq.eyebrow, defaults.faq.eyebrow),
      title: text(faq.title, defaults.faq.title),
      items: mergeFaqItems(faq.items),
    },
    finalCta: {
      eyebrow: text(finalCta.eyebrow, defaults.finalCta.eyebrow),
      title: text(finalCta.title, defaults.finalCta.title),
      body: text(finalCta.body, defaults.finalCta.body),
      ctaLabel: text(finalCta.ctaLabel, defaults.finalCta.ctaLabel),
    },
    footer: {
      copyright: text(footer.copyright, defaults.footer.copyright),
    },
  };
}
