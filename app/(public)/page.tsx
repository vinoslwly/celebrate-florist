import { BackToTopButton } from "@/features/landing/components/back-to-top-button";
import { BouquetCollectionSection } from "@/features/landing/components/bouquet-collection-section";
import { DemoExperienceSection } from "@/features/landing/components/demo-experience-section";
import { ExperienceCollectionSection } from "@/features/landing/components/experience-collection-section";
import { FaqSection } from "@/features/landing/components/faq-section";
import { FinalCtaSection } from "@/features/landing/components/final-cta-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { WhatIsCelebrateSection } from "@/features/landing/components/what-is-celebrate-section";
import { WhyUsSection } from "@/features/landing/components/why-us-section";

import type { Metadata } from "next";

const SITE_URL = "https://celebrateflorist.com";
const SITE_TITLE = "Celebrate Florist — Give Flowers. Create Memories.";
const SITE_DESCRIPTION =
  "Celebrate Florist pairs a real bouquet with a private digital greeting experience, delivered around Surakarta and UNS.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Celebrate Florist",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FloristShop",
  name: "Celebrate Florist",
  areaServed: "Surakarta, Indonesia",
  description: SITE_DESCRIPTION,
};

export default function LandingPage() {
  return (
    <>
      {/* Static, developer-authored JSON-LD — no user input reaches this markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <BackToTopButton />
      <WhatIsCelebrateSection />
      <WhyUsSection />
      <BouquetCollectionSection />
      <ExperienceCollectionSection />
      <HowItWorksSection />
      <DemoExperienceSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
