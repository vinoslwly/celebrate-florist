import { Button } from "@/components/ui/button";
import { createDefaultBand } from "@/features/quiz/components/quiz-draft";
import { QuizScoreBandEditor } from "@/features/quiz/components/quiz-score-band-editor";

import type { QuizScoreBandInput } from "@/schemas/studio-quiz";

type QuizScoreBandListProps = {
  bands: QuizScoreBandInput[];
  disabled?: boolean;
  onChange: (bands: QuizScoreBandInput[]) => void;
};

export function QuizScoreBandList({
  bands,
  disabled = false,
  onChange,
}: QuizScoreBandListProps) {
  const canRemove = bands.length > 1;

  function updateBand(index: number, updated: QuizScoreBandInput) {
    const next = [...bands];
    next[index] = updated;
    onChange(next);
  }

  function removeBand(index: number) {
    if (!canRemove) {
      return;
    }

    onChange(bands.filter((_, currentIndex) => currentIndex !== index));
  }

  function addBand() {
    onChange([...bands, createDefaultBand()]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Score bands</h3>
          <p className="text-xs text-muted-foreground">
            At least one band is required. Ranges must cover 0–100% without
            overlap.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addBand}
          disabled={disabled}
        >
          Add band
        </Button>
      </div>

      <div className="space-y-4">
        {bands.map((band, index) => (
          <QuizScoreBandEditor
            key={`band-${index}`}
            band={band}
            index={index}
            disabled={disabled}
            canRemove={canRemove}
            onChange={(updated) => updateBand(index, updated)}
            onRemove={() => removeBand(index)}
          />
        ))}
      </div>
    </div>
  );
}
