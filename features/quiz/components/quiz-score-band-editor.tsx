import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor={`${fieldId}-min`}>Minimum %</Label>
          <Input
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
            disabled={disabled}
          />
        </Field>
        <Field>
          <Label htmlFor={`${fieldId}-max`}>Maximum %</Label>
          <Input
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
            disabled={disabled}
          />
        </Field>
      </FieldGroup>

      <Field>
        <Label htmlFor={`${fieldId}-message`}>
          Message shown for this score
        </Label>
        <Textarea
          id={`${fieldId}-message`}
          rows={3}
          value={band.message}
          onChange={(event) =>
            onChange({ ...band, message: event.target.value })
          }
          disabled={disabled}
          placeholder="Write the message recipients see for this score range"
        />
      </Field>
    </article>
  );
}
