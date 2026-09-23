export type WebsiteThemeCard = {
  slug: "bloom" | "warm" | "sky";
  name: string;
  description: string;
  imageUrl: string;
};

export type WebsiteFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type WebsiteContent = {
  brand: {
    logoUrl: string;
    faviconUrl: string;
    siteTitle: string;
    siteDescription: string;
  };
  colors: {
    cream: string;
    rose: string;
    gold: string;
    ink: string;
  };
  whatsapp: {
    number: string;
    orderMessage: string;
  };
  links: {
    bouquetUrl: string;
    instagramUrl: string;
    demoHref: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaLabel: string;
    demoLabel: string;
    imageUrl: string;
    caption: string;
  };
  whatIs: {
    eyebrow: string;
    title: string;
    body: string;
  };
  whyUs: {
    eyebrow: string;
    title: string;
  };
  bouquet: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    intro: string;
    themes: WebsiteThemeCard[];
  };
  demo: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: WebsiteFaqItem[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
  };
  footer: {
    copyright: string;
  };
};
