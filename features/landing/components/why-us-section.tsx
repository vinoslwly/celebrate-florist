import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const REASONS = [
  {
    emoji: "✨",
    title: "Curated by Us",
    description:
      "Every Celebrate Experience is designed and reviewed by our team before it reaches your recipient.",
  },
  {
    emoji: "🔒",
    title: "Private by Design",
    description:
      "Only your recipient can open the memory — protected by a Memory Key only they will have.",
  },
  {
    emoji: "🛵",
    title: "Made for Surakarta",
    description:
      "Fast, local delivery around UNS and surrounding campuses, so timing is never a worry.",
  },
];

export function WhyUsSection() {
  return (
    <section
      id="why-us"
      className="bg-pink-soft/15 px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="why-us-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="why-us-heading"
          eyebrow="Why Celebrate"
          title="Why choose us?"
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {REASONS.map((reason, index) => (
            <ScrollReveal key={reason.title} delay={index * 0.1}>
              <div className="flex flex-col items-center gap-3 text-center">
                <span aria-hidden="true" className="text-4xl">
                  {reason.emoji}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
