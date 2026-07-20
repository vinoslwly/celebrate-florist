import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { QuizQuestionInput } from "@/schemas/studio-quiz";

type QuizQuestionEditorProps = {
  question: QuizQuestionInput;
  index: number;
  disabled?: boolean;
  canRemove: boolean;
  onChange: (question: QuizQuestionInput) => void;
  onRemove: () => void;
};

const OPTION_LABELS = ["A", "B", "C"] as const;

export function QuizQuestionEditor({
  question,
  index,
  disabled = false,
  canRemove,
  onChange,
  onRemove,
}: QuizQuestionEditorProps) {
  const fieldId = `quiz-question-${question.sortOrder}`;

  return (
    <article
      aria-labelledby={`${fieldId}-heading`}
      className="rounded-xl border border-border bg-muted/20 p-4 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={`${fieldId}-heading`} className="text-sm font-semibold">
          Question {index + 1}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled || !canRemove}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          aria-label={`Remove question ${index + 1}`}
        >
          Remove
        </button>
      </div>

      <Field>
        <Label htmlFor={`${fieldId}-prompt`}>Question text</Label>
        <Textarea
          id={`${fieldId}-prompt`}
          rows={2}
          value={question.prompt}
          onChange={(event) =>
            onChange({ ...question, prompt: event.target.value })
          }
          disabled={disabled}
          placeholder="Write your question here"
        />
      </Field>

      <fieldset className="space-y-3" disabled={disabled}>
        <legend className="text-sm font-medium">Answer choices</legend>
        {OPTION_LABELS.map((label, optionIndex) => (
          <Field key={label} className="space-y-1">
            <Label
              htmlFor={`${fieldId}-option-${label}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Choice {label}
            </Label>
            <Input
              id={`${fieldId}-option-${label}`}
              type="text"
              value={question.options[optionIndex]}
              onChange={(event) => {
                const options = [...question.options] as [
                  string,
                  string,
                  string,
                ];
                options[optionIndex] = event.target.value;
                onChange({ ...question, options });
              }}
              disabled={disabled}
              placeholder={`Option ${label}`}
            />
          </Field>
        ))}
      </fieldset>

      <fieldset className="space-y-2" disabled={disabled}>
        <legend className="text-sm font-medium">Correct answer</legend>
        <div className="flex flex-wrap gap-4">
          {OPTION_LABELS.map((label, optionIndex) => {
            const inputId = `${fieldId}-correct-${label}`;

            return (
              <label
                key={label}
                htmlFor={inputId}
                className="inline-flex items-center gap-2 text-sm"
              >
                <input
                  id={inputId}
                  type="radio"
                  name={`${fieldId}-correct`}
                  checked={question.correctOptionIndex === optionIndex}
                  onChange={() =>
                    onChange({
                      ...question,
                      correctOptionIndex: optionIndex,
                    })
                  }
                  disabled={disabled}
                  className="size-4 accent-primary"
                />
                <span>Choice {label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </article>
  );
}
