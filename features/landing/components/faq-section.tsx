import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/features/landing/config/faq";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          id="faq-heading"
          eyebrow="❔ Questions"
          title="Frequently asked."
        />

        <Accordion
          type="single"
          collapsible
          className="mt-10 rounded-3xl border border-pink-soft/40 bg-card px-6 shadow-soft"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
