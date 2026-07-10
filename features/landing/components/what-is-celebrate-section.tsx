import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const PILLARS = [
  {
    emoji: "🌸",
    title: "A Real Bouquet",
    description: "Hand-arranged fresh flowers, delivered to your recipient.",
  },
  {
    emoji: "💌",
    title: "A Digital Greeting",
    description:
      "Scan the QR card to open a personal greeting experience made just for them.",
  },
  {
    emoji: "❤️",
    title: "A Lasting Memory",
    description:
      "The bouquet fades, but the experience stays — revisitable anytime.",
  },
];

export function WhatIsCelebrateSection() {
  return (
    <section
      id="what-is-celebrate"
      className="px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="what-is-celebrate-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="what-is-celebrate-heading"
          eyebrow="What is Celebrate?"
          title="More than a bouquet."
          subtitle="Celebrate pairs a real bouquet with a digital greeting experience, so the feeling lasts longer than the flowers."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <ScrollReveal key={pillar.title} delay={index * 0.1}>
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-pink-soft/40 bg-card p-6 text-center shadow-soft">
                <span aria-hidden="true" className="text-4xl">
                  {pillar.emoji}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
