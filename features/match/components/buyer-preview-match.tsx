import { ExperienceSurfaceCard } from "@/features/experience/components/experience-surface-card";
import type { PreviewMatchView } from "@/features/match/types";
import type { BuyerPreviewPhoto } from "@/features/preview/types";

type BuyerPreviewMatchProps = {
  match: PreviewMatchView;
  photos: BuyerPreviewPhoto[];
};

function resolvePhotoUrl(
  photos: BuyerPreviewPhoto[],
  sortOrder: number,
): string | null {
  return (
    photos.find((photo) => photo.sort_order === sortOrder)?.signedUrl ?? null
  );
}

/** Buyer preview — match structure only; no mappings, gameplay, or cinematic reveal (FD-M2). */
export function BuyerPreviewMatch({ match, photos }: BuyerPreviewMatchProps) {
  const sortedStories = [...match.stories].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const sortedPhotoSlots = [...match.photos].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return (
    <ExperienceSurfaceCard tone="preview" className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-serif text-lg font-semibold">Match the memory</h2>
        <p className="text-sm text-muted-foreground">
          Preview structure — pairings stay hidden until recipients play.
        </p>
        <p className="text-sm text-muted-foreground">
          {match.pairCount} memory {match.pairCount === 1 ? "pair" : "pairs"}
        </p>
      </header>

      {sortedStories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No match stories saved yet. Add stories in Studio before sending
          preview.
        </p>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Stories</h3>
          {sortedStories.map((story, index) => (
            <article
              key={story.sortOrder}
              className="rounded-xl border border-border/70 bg-muted/15 p-4 space-y-2"
            >
              <h4 className="text-sm font-semibold">Memory {index + 1}</h4>
              <p className="text-sm leading-relaxed">{story.storyText}</p>
            </article>
          ))}
        </div>
      )}

      {sortedPhotoSlots.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Photos</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {sortedPhotoSlots.map((photoSlot) => {
              const signedUrl = resolvePhotoUrl(photos, photoSlot.sortOrder);

              return (
                <div
                  key={photoSlot.sortOrder}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  {signedUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={signedUrl}
                      alt={
                        photoSlot.caption?.trim() ||
                        `Memory photo ${photoSlot.sortOrder}`
                      }
                      className="aspect-square h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-muted/30 px-3 text-center text-xs text-muted-foreground">
                      Photo slot {photoSlot.sortOrder}
                    </div>
                  )}
                  {photoSlot.caption?.trim() ? (
                    <p className="px-2 py-1.5 text-center text-xs text-muted-foreground">
                      {photoSlot.caption}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </ExperienceSurfaceCard>
  );
}
