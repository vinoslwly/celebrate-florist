import { QUIZ_INPUT_CLASS } from "@/features/quiz/components/quiz-draft";

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

      <div className="space-y-2">
        <label htmlFor={`${fieldId}-prompt`} className="text-sm font-medium">
          Question text
        </label>
        <textarea
          id={`${fieldId}-prompt`}
          rows={2}
          value={question.prompt}
          onChange={(event) =>
            onChange({ ...question, prompt: event.target.value })
          }
          className={QUIZ_INPUT_CLASS}
          disabled={disabled}
          placeholder="Write your question here"
        />
      </div>

      <fieldset className="space-y-3" disabled={disabled}>
        <legend className="text-sm font-medium">Answer choices</legend>
        {OPTION_LABELS.map((label, optionIndex) => (
          <div key={label} className="space-y-1">
            <label
              htmlFor={`${fieldId}-option-${label}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Choice {label}
            </label>
            <input
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
              className={QUIZ_INPUT_CLASS}
              disabled={disabled}
              placeholder={`Option ${label}`}
            />
          </div>
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
