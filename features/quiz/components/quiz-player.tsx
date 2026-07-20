"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import type { ConnectionQuizSubmitResult } from "@/features/experience/types/connection-gate.types";
import { submitQuizAnswersAction } from "@/features/quiz/actions/recipient-quiz";
import type {
  RecipientQuizQuestion,
  RecipientQuizView,
} from "@/features/quiz/types";

type QuizPlayerProps = {
  experienceToken: string;
  quiz: RecipientQuizView;
  /** When set, parent orchestrates unlock — no internal result card or sessionStorage. */
  onSubmitSuccess?: (data: ConnectionQuizSubmitResult) => void;
};

const OPTION_LABELS = ["A", "B", "C"] as const;

export function QuizPlayer({
  experienceToken,
  quiz,
  onSubmitSuccess,
}: QuizPlayerProps) {
  const sortedQuestions = useMemo(
    () =>
      [...quiz.questions].sort(
        (left, right) => left.sortOrder - right.sortOrder,
      ),
    [quiz.questions],
  );

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    for (const question of sortedQuestions) {
      initial[question.sortOrder] = 0;
    }
    return initial;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateAnswer(question: RecipientQuizQuestion, optionIndex: number) {
    setAnswers((current) => ({
      ...current,
      [question.sortOrder]: optionIndex,
    }));
  }

  async function handleSubmit() {
    setBusy(true);
    setError(null);

    const payload = sortedQuestions.map((question) => ({
      sortOrder: question.sortOrder,
      selectedOptionIndex: answers[question.sortOrder] ?? 0,
    }));

    const response = await submitQuizAnswersAction({
      experienceToken,
      answers: payload,
    });

    setBusy(false);

    if (!response.ok) {
      setError(response.error.message);
      return;
    }

    onSubmitSuccess?.(response.data);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <header className="space-y-1 text-center">
        <h2 className="font-serif text-2xl font-semibold">
          {quiz.quizTitle?.trim() || "How well do you know them?"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose the best answer for each question.
        </p>
      </header>

      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="space-y-5">
        {sortedQuestions.map((question, index) => (
          <article
            key={question.sortOrder}
            className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
            aria-labelledby={`quiz-q-${question.sortOrder}`}
          >
            <h3
              id={`quiz-q-${question.sortOrder}`}
              className="text-sm font-semibold"
            >
              Question {index + 1}
            </h3>
            <p className="text-sm leading-relaxed">{question.prompt}</p>
            <fieldset className="space-y-2" disabled={busy}>
              <legend className="sr-only">
                Answers for question {index + 1}
              </legend>
              {OPTION_LABELS.map((label, optionIndex) => {
                const inputId = `quiz-${question.sortOrder}-${label}`;

                return (
                  <label
                    key={label}
                    htmlFor={inputId}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm transition-colors min-h-11",
                      answers[question.sortOrder] === optionIndex
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : "border-border bg-background",
                    )}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`quiz-${question.sortOrder}`}
                      checked={answers[question.sortOrder] === optionIndex}
                      onChange={() => updateAnswer(question, optionIndex)}
                      disabled={busy}
                      className="mt-0.5 size-4 accent-primary"
                    />
                    <span>
                      <span className="font-medium">{label}.</span>{" "}
                      {question.options[optionIndex]}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </article>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={busy || sortedQuestions.length === 0}
          aria-busy={busy}
          className="min-h-11"
        >
          {busy ? "Submitting…" : "Submit answers"}
        </Button>
      </div>
    </section>
  );
}
