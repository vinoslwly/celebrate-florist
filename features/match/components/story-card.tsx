import type { MemoriesGatePhotoOption } from "@/features/experience/types/memories-gate.types";
import { PhotoChoice } from "@/features/match/components/photo-choice";
import type { RecipientMatchStory } from "@/features/match/types";

type StoryCardProps = {
  story: RecipientMatchStory;
  index: number;
  photoOptions: MemoriesGatePhotoOption[];
  selectedPhotoSortOrder: number | null;
  disabled: boolean;
  onSelectPhoto: (photoSortOrder: number) => void;
};

/** Dumb story card — prompt + photo choices; no grading or orchestration. */
export function StoryCard({
  story,
  index,
  photoOptions,
  selectedPhotoSortOrder,
  disabled,
  onSelectPhoto,
}: StoryCardProps) {
  const fieldName = `match-story-${story.sortOrder}`;

  return (
    <article
      className="rounded-xl border border-border bg-muted/20 p-4 space-y-4"
      aria-labelledby={`match-story-heading-${story.sortOrder}`}
    >
      <header className="space-y-1">
        <h3
          id={`match-story-heading-${story.sortOrder}`}
          className="text-sm font-semibold"
        >
          Memory {index + 1}
        </h3>
        <p className="text-sm leading-relaxed">{story.storyText}</p>
      </header>

      <fieldset className="space-y-2" disabled={disabled}>
        <legend className="sr-only">
          Choose the photo for memory {index + 1}
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photoOptions.map((photo) => (
            <PhotoChoice
              key={photo.sortOrder}
              photo={photo}
              selected={selectedPhotoSortOrder === photo.sortOrder}
              disabled={disabled}
              name={fieldName}
              onSelect={() => onSelectPhoto(photo.sortOrder)}
            />
          ))}
        </div>
      </fieldset>
    </article>
  );
}
