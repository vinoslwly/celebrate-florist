import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  {
    step: "1",
    title: "Order via WhatsApp",
    description: "Tell us the occasion, choose a bouquet and a theme.",
  },
  {
    step: "2",
    title: "We Design It",
    description:
      "Our team writes and designs your Greeting Experience, then sends a preview for your approval.",
  },
  {
    step: "3",
    title: "We Deliver",
    description:
      "Your bouquet arrives with a QR card. Scanning it opens the finished experience.",
  },
  {
    step: "4",
    title: "They Celebrate",
    description:
      "Your recipient opens a private greeting they can revisit anytime.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="Process"
          title="How it works."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item, index) => (
            <ScrollReveal key={item.step} delay={index * 0.08}>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-2xl font-bold text-pink-ink">
                  {item.step.padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
