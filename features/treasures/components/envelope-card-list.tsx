import type { ExperiencePhotoRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import { EnvelopeCardEditor } from "@/features/treasures/components/envelope-card-editor";
import {
  countFinalEnvelopes,
  createEmptyEnvelope,
  nextEnvelopeSortOrder,
} from "@/features/treasures/components/envelope-draft";
import {
  ENVELOPE_MAX_COUNT,
  ENVELOPE_MIN_COUNT,
  type EnvelopeItemInput,
} from "@/schemas/studio-envelope";

type EnvelopeCardListProps = {
  envelopes: EnvelopeItemInput[];
  photos: ExperiencePhotoRow[];
  disabled?: boolean;
  onChange: (envelopes: EnvelopeItemInput[]) => void;
};

export function EnvelopeCardList({
  envelopes,
  photos = [],
  disabled = false,
  onChange,
}: EnvelopeCardListProps) {
  const sortedEnvelopes = [...envelopes].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const canAdd = envelopes.length < ENVELOPE_MAX_COUNT;
  const canRemove = envelopes.length > 0;
  const finalCount = countFinalEnvelopes(sortedEnvelopes);

  function updateEnvelope(index: number, updated: EnvelopeItemInput) {
    let next = [...sortedEnvelopes];
    next[index] = updated;

    if (updated.isFinal) {
      next = next.map((envelope) =>
        envelope.sortOrder === updated.sortOrder
          ? envelope
          : { ...envelope, isFinal: false },
      );
    }

    onChange(next);
  }

  function removeEnvelope(index: number) {
    if (!canRemove) {
      return;
    }

    onChange(
      sortedEnvelopes.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function addEnvelope() {
    if (!canAdd) {
      return;
    }

    onChange([
      ...sortedEnvelopes,
      createEmptyEnvelope(nextEnvelopeSortOrder(sortedEnvelopes)),
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Your surprise envelopes</h3>
          <p className="text-xs text-muted-foreground">
            Arrange up to {ENVELOPE_MAX_COUNT} envelopes in your gift box.
            Recipients can open them in any order — each reveal is a complete
            memory.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addEnvelope}
          disabled={disabled || !canAdd}
          aria-disabled={disabled || !canAdd}
        >
          Add envelope
        </Button>
      </div>

      {sortedEnvelopes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No envelopes yet. Upload photos above, then add your first surprise
          envelope.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sortedEnvelopes.map((envelope, index) => (
            <EnvelopeCardEditor
              key={envelope.sortOrder}
              envelope={envelope}
              displayNumber={index + 1}
              photos={photos}
              disabled={disabled}
              canRemove={canRemove}
              onChange={(updated) => updateEnvelope(index, updated)}
              onRemove={() => removeEnvelope(index)}
            />
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-xs text-muted-foreground space-y-1">
        <p>
          Publish requires at least {ENVELOPE_MIN_COUNT} envelopes, each with a
          message, a photo, or both.
        </p>
        <p>
          Exactly one envelope should be marked Final — this is your creator
          note, not the unlock trigger.
        </p>
        {finalCount > 1 ? (
          <p className="text-amber-800 dark:text-amber-200">
            Exactly one envelope must be marked as Final.
          </p>
        ) : null}
      </div>
    </div>
  );
}
