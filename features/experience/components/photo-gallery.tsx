import type { Theme } from "@/types/theme";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

type PhotoGalleryProps = {
  photos: PublishedPhoto[];
  theme: Theme;
};

export function PhotoGallery({ photos, theme }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${theme.accentClassName}`}
          aria-hidden
        />
        Memory gallery
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.signedUrl}
              alt={`Memory photo ${photo.sort_order}`}
              className="aspect-square h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
