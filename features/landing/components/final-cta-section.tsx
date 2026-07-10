import { Button } from "@/components/ui/button";
import { ORDER_LINK } from "@/features/landing/config/whatsapp-messages";

export function FinalCtaSection() {
  return (
    <section
      id="final-cta"
      className="px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto max-w-2xl rounded-3xl border border-pink-soft bg-gradient-to-br from-pink-soft/40 to-peach-soft/40 px-6 py-14 text-center shadow-soft-lg sm:px-12">
        <p className="font-mono text-xs font-bold tracking-widest text-pink-ink uppercase">
          Start Your Surprise Today
        </p>
        <h2
          id="final-cta-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Ready to celebrate someone today?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Give a bouquet that carries a memory, not just a moment.
        </p>
        <Button asChild variant="brand" size="lg" className="mt-8">
          <a href={ORDER_LINK} target="_blank" rel="noopener noreferrer">
            🌸 Order Now
          </a>
        </Button>
      </div>
    </section>
  );
}
