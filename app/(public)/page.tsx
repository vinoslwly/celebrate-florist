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
import { getWebsiteContent } from "@/features/website/services/get-website-content.service";

const SITE_URL = "https://celebrateflorist.id";

export default async function LandingPage() {
  const content = await getWebsiteContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: "Celebrate Florist",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surakarta",
      addressCountry: "ID",
    },
    url: SITE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection content={content} />
      <BackToTopButton />
      <WhatIsCelebrateSection content={content} />
      <WhyUsSection content={content} />
      <BouquetCollectionSection content={content} />
      <ExperienceCollectionSection content={content} />
      <HowItWorksSection />
      <DemoExperienceSection content={content} />
      <FaqSection content={content} />
      <FinalCtaSection content={content} />
    </>
  );
}
