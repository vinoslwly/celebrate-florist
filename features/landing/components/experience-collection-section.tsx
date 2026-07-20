import { PhotoSlot } from "@/components/shared/photo-slot";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getThemeStudioDisplayLabel } from "@/features/themes/config/active-themes";
import { ACTIVE_V1_THEMES } from "@/features/themes/config/all-themes";

export function ExperienceCollectionSection() {
  return (
    <section
      id="experience"
      className="bg-peach-soft/25 px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="experience-heading"
          eyebrow="Experience Themes"
          title="Choose your experience."
          subtitle="Empat suasana, masing-masing punya karakter sendiri — contoh gambar menyusul ya ✨"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {ACTIVE_V1_THEMES.map((theme, index) => {
            const displayName = getThemeStudioDisplayLabel(
              theme.id,
              theme.name,
            );

            return (
              <ScrollReveal key={theme.id} delay={index * 0.08}>
                <div className="flex flex-col gap-4 rounded-3xl border border-pink-soft/40 bg-card p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-3xl">
                      {theme.emoji}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {displayName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {theme.feeling} · {theme.flower}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <PhotoSlot
                      src={theme.greetingPreviewImage}
                      alt={`${displayName} greeting preview`}
                      placeholderLabel="Greeting"
                      className="aspect-[3/4] w-full"
                      sizes="(min-width: 1024px) 170px, (min-width: 640px) 22vw, 45vw"
                    />
                    <PhotoSlot
                      src={theme.photoboothPreviewImage}
                      alt={`${displayName} photobooth strip example`}
                      placeholderLabel="Photobooth"
                      className="aspect-[3/4] w-full"
                      sizes="(min-width: 1024px) 170px, (min-width: 640px) 22vw, 45vw"
                    />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
