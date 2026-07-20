import type { ExperiencePhotoRow } from "@/types/database";

import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MatchPhotoSlotSelector } from "@/features/match/components/match-photo-slot-selector";

import type { MatchPairInput } from "@/schemas/studio-match";

type MatchPairEditorProps = {
  pair: MatchPairInput;
  index: number;
  photos: ExperiencePhotoRow[];
  usedPhotoSlots: Set<number>;
  disabled?: boolean;
  canRemove: boolean;
  onChange: (pair: MatchPairInput) => void;
  onRemove: () => void;
};

export function MatchPairEditor({
  pair,
  index,
  photos,
  usedPhotoSlots,
  disabled = false,
  canRemove,
  onChange,
  onRemove,
}: MatchPairEditorProps) {
  const fieldId = `match-pair-${pair.sortOrder}`;

  return (
    <article
      aria-labelledby={`${fieldId}-heading`}
      className="rounded-xl border border-border bg-muted/20 p-4 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={`${fieldId}-heading`} className="text-sm font-semibold">
          Story {index + 1}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled || !canRemove}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          aria-label={`Remove story ${index + 1}`}
        >
          Remove
        </button>
      </div>

      <Field>
        <Label htmlFor={`${fieldId}-story`}>Story text</Label>
        <Textarea
          id={`${fieldId}-story`}
          rows={3}
          value={pair.storyText}
          onChange={(event) =>
            onChange({ ...pair, storyText: event.target.value })
          }
          disabled={disabled}
          placeholder="Write the memory story the recipient will match to a photo"
        />
      </Field>

      <MatchPhotoSlotSelector
        fieldId={fieldId}
        value={pair.photoSortOrder}
        usedByOtherPairs={usedPhotoSlots}
        photos={photos}
        disabled={disabled}
        onChange={(photoSortOrder) => onChange({ ...pair, photoSortOrder })}
      />
    </article>
  );
}
