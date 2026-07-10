import { PhotoSlot } from "@/components/shared/photo-slot";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { BOUQUET_CATALOG } from "@/features/landing/config/bouquet-catalog";

export function BouquetCollectionSection() {
  return (
    <section
      id="bouquet"
      className="px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="bouquet-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="bouquet-heading"
          eyebrow="Flower Collection"
          title="Choose your bouquet."
          subtitle="Pilih buket bunga fisik Anda — foto asli menyusul ya 🌸"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {BOUQUET_CATALOG.map((bouquet, index) => (
            <ScrollReveal key={bouquet.id} delay={index * 0.06}>
              <div
                className={`flex flex-col gap-3 rounded-3xl border border-pink-soft/40 bg-card p-4 shadow-soft transition-transform hover:-translate-y-1 ${
                  index % 2 === 0 ? "sm:rotate-[-1deg]" : "sm:rotate-[1deg]"
                }`}
              >
                <PhotoSlot
                  src={bouquet.image}
                  alt={bouquet.name}
                  placeholderLabel="Foto menyusul"
                  className="aspect-square w-full"
                />
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">
                    {bouquet.emoji}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {bouquet.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {bouquet.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
