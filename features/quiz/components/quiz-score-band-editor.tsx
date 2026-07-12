import { QUIZ_INPUT_CLASS } from "@/features/quiz/components/quiz-draft";

import type { QuizScoreBandInput } from "@/schemas/studio-quiz";

type QuizScoreBandEditorProps = {
  band: QuizScoreBandInput;
  index: number;
  disabled?: boolean;
  canRemove: boolean;
  onChange: (band: QuizScoreBandInput) => void;
  onRemove: () => void;
};

export function QuizScoreBandEditor({
  band,
  index,
  disabled = false,
  canRemove,
  onChange,
  onRemove,
}: QuizScoreBandEditorProps) {
  const fieldId = `quiz-band-${index}`;

  return (
    <article
      aria-labelledby={`${fieldId}-heading`}
      className="rounded-xl border border-border bg-muted/20 p-4 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={`${fieldId}-heading`} className="text-sm font-semibold">
          Score band {index + 1}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled || !canRemove}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          aria-label={`Remove score band ${index + 1}`}
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${fieldId}-min`} className="text-sm font-medium">
            Minimum %
          </label>
          <input
            id={`${fieldId}-min`}
            type="number"
            min={0}
            max={100}
            value={band.minPercent}
            onChange={(event) =>
              onChange({
                ...band,
                minPercent: Number(event.target.value),
              })
            }
            className={QUIZ_INPUT_CLASS}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${fieldId}-max`} className="text-sm font-medium">
            Maximum %
          </label>
          <input
            id={`${fieldId}-max`}
            type="number"
            min={0}
            max={100}
            value={band.maxPercent}
            onChange={(event) =>
              onChange({
                ...band,
                maxPercent: Number(event.target.value),
              })
            }
            className={QUIZ_INPUT_CLASS}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${fieldId}-message`} className="text-sm font-medium">
          Message shown for this score
        </label>
        <textarea
          id={`${fieldId}-message`}
          rows={3}
          value={band.message}
          onChange={(event) =>
            onChange({ ...band, message: event.target.value })
          }
          className={QUIZ_INPUT_CLASS}
          disabled={disabled}
          placeholder="Write the message recipients see for this score range"
        />
      </div>
    </article>
  );
}
