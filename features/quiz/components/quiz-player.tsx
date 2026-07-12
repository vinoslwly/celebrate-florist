"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { submitQuizAnswersAction } from "@/features/quiz/actions/recipient-quiz";
import type {
  QuizGradeResult,
  RecipientQuizQuestion,
  RecipientQuizView,
} from "@/features/quiz/types";

type QuizPlayerProps = {
  experienceId: string;
  experienceToken: string;
  quiz: RecipientQuizView;
};

type StoredQuizSession = {
  result: QuizGradeResult;
};

const OPTION_LABELS = ["A", "B", "C"] as const;

function sessionStorageKey(experienceId: string): string {
  return `cf_quiz_submitted_${experienceId}`;
}

function readStoredSession(experienceId: string): StoredQuizSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(sessionStorageKey(experienceId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredQuizSession;
  } catch {
    return null;
  }
}

function writeStoredSession(
  experienceId: string,
  result: QuizGradeResult,
): void {
  sessionStorage.setItem(
    sessionStorageKey(experienceId),
    JSON.stringify({ result }),
  );
}

export function QuizPlayer({
  experienceId,
  experienceToken,
  quiz,
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
  const [result, setResult] = useState<QuizGradeResult | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return readStoredSession(experienceId)?.result ?? null;
  });
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return readStoredSession(experienceId) !== null;
  });

  function updateAnswer(question: RecipientQuizQuestion, optionIndex: number) {
    setAnswers((current) => ({
      ...current,
      [question.sortOrder]: optionIndex,
    }));
  }

  async function handleSubmit() {
    if (submitted) {
      return;
    }

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

    setResult(response.data.result);
    setSubmitted(true);
    writeStoredSession(experienceId, response.data.result);
  }

  if (result) {
    return (
      <section
        aria-live="polite"
        className="rounded-2xl border border-border bg-card p-6 space-y-4 text-center"
      >
        <h2 className="font-serif text-2xl font-semibold">Your score</h2>
        <p className="text-5xl font-semibold tabular-nums">{result.percent}%</p>
        <p className="text-sm text-muted-foreground">
          {result.correctCount} of {result.totalQuestions} correct
        </p>
        <p className="text-base leading-relaxed">{result.message}</p>
      </section>
    );
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
            <fieldset className="space-y-2" disabled={busy || submitted}>
              <legend className="sr-only">
                Answers for question {index + 1}
              </legend>
              {OPTION_LABELS.map((label, optionIndex) => {
                const inputId = `quiz-${question.sortOrder}-${label}`;

                return (
                  <label
                    key={label}
                    htmlFor={inputId}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`quiz-${question.sortOrder}`}
                      checked={answers[question.sortOrder] === optionIndex}
                      onChange={() => updateAnswer(question, optionIndex)}
                      disabled={busy || submitted}
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
          disabled={busy || submitted || sortedQuestions.length === 0}
        >
          {busy ? "Submitting…" : "Submit answers"}
        </Button>
      </div>
    </section>
  );
}
