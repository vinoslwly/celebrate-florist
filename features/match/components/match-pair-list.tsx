import type { ExperiencePhotoRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import {
  createEmptyPair,
  nextAvailablePhotoSlot,
  nextPairSortOrder,
} from "@/features/match/components/match-draft";
import { MatchPairEditor } from "@/features/match/components/match-pair-editor";
import { MATCH_MAX_PAIRS } from "@/schemas/studio-match";

import type { MatchPairInput } from "@/schemas/studio-match";

type MatchPairListProps = {
  pairs: MatchPairInput[];
  photos: ExperiencePhotoRow[];
  disabled?: boolean;
  onChange: (pairs: MatchPairInput[]) => void;
};

export function MatchPairList({
  pairs,
  photos = [],
  disabled = false,
  onChange,
}: MatchPairListProps) {
  const sortedPairs = [...pairs].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const uploadedSlots = photos.map((photo) => photo.sort_order);
  const canAdd = pairs.length < MATCH_MAX_PAIRS;
  const canRemove = pairs.length > 0;

  function updatePair(index: number, updated: MatchPairInput) {
    const next = [...sortedPairs];
    next[index] = updated;
    onChange(next);
  }

  function removePair(index: number) {
    if (!canRemove) {
      return;
    }

    onChange(sortedPairs.filter((_, currentIndex) => currentIndex !== index));
  }

  function addPair() {
    if (!canAdd) {
      return;
    }

    onChange([
      ...sortedPairs,
      createEmptyPair(
        nextPairSortOrder(sortedPairs),
        nextAvailablePhotoSlot(sortedPairs, uploadedSlots),
      ),
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Match pairs</h3>
          <p className="text-xs text-muted-foreground">
            Add up to {MATCH_MAX_PAIRS} story–photo pairs. Publish requires at
            least 2 saved pairs (validated on publish).
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addPair}
          disabled={disabled || !canAdd}
          aria-disabled={disabled || !canAdd}
        >
          Add story
        </Button>
      </div>

      {sortedPairs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No stories yet. Upload photos above, then add your first story.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedPairs.map((pair, index) => {
            const usedPhotoSlots = new Set(
              sortedPairs
                .filter((entry) => entry.sortOrder !== pair.sortOrder)
                .map((entry) => entry.photoSortOrder),
            );

            return (
              <MatchPairEditor
                key={pair.sortOrder}
                pair={pair}
                index={index}
                photos={photos}
                usedPhotoSlots={usedPhotoSlots}
                disabled={disabled}
                canRemove={canRemove}
                onChange={(updated) => updatePair(index, updated)}
                onRemove={() => removePair(index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
