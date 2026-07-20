import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import { themePhotoTreatment } from "@/features/themes/config/theme-assets";
import { themeAccent } from "@/features/themes/config/theme-surfaces";

type PhotoGalleryProps = {
  photos: PublishedPhoto[];
  theme: Theme;
  tone?: "recipient" | "preview";
};

export function PhotoGallery({
  photos,
  theme,
  tone = "recipient",
}: PhotoGalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  const isPreview = tone === "preview";
  const polaroid = themePhotoTreatment(theme) === "polaroid-tape";

  return (
    <section className={cn("space-y-4", isPreview && "pt-2")}>
      <h2
        className={cn(
          "flex items-center gap-2 font-serif font-semibold",
          isPreview ? "text-lg text-foreground/90" : "text-2xl",
        )}
      >
        {!isPreview ? (
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${themeAccent(theme)}`}
            aria-hidden
          />
        ) : null}
        Memory gallery
      </h2>
      <div
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3",
          isPreview && "rounded-xl border border-border/70 bg-muted/10 p-3",
        )}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              "overflow-hidden border bg-card",
              polaroid
                ? cn(
                    "relative rounded-sm border-border/60 bg-card p-2 pb-6 shadow-sm",
                    !isPreview && index % 2 === 0 && "sm:rotate-[-1.5deg]",
                    !isPreview && index % 2 === 1 && "sm:rotate-[1.5deg]",
                  )
                : "rounded-xl border-border",
            )}
          >
            {polaroid ? (
              <span
                aria-hidden
                className="absolute top-1 left-1/2 z-10 h-3 w-10 -translate-x-1/2 rounded-sm bg-pink-soft/80"
              />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.signedUrl}
              alt={`Memory photo ${photo.sort_order}`}
              className="aspect-square h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
