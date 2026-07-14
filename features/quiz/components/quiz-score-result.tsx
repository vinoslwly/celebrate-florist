import type { QuizGradeResult } from "@/features/quiz/types";

type QuizScoreResultProps = {
  result: QuizGradeResult;
};

/** Score + band message display — orchestrated by ConnectionExperienceFlow (Sprint 08R-B). */
export function QuizScoreResult({ result }: QuizScoreResultProps) {
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
