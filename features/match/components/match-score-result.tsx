import type { MatchGradeResult } from "@/features/match/types";

type MatchScoreResultProps = {
  result: MatchGradeResult;
};

function resolveMatchScoreMessage(percent: number): string {
  if (percent === 100) {
    return "Every memory matched — what a beautiful connection.";
  }

  if (percent >= 75) {
    return "You remember so many of these moments together.";
  }

  if (percent >= 50) {
    return "Some memories sparkle brighter than others — and that's okay.";
  }

  return "Every story holds meaning — thank you for playing along.";
}

/** Score + emotional feedback only — orchestrated by MemoriesExperienceFlow (Phase 6B). */
export function MatchScoreResult({ result }: MatchScoreResultProps) {
  const incorrectCount = result.totalPairs - result.correctCount;
  const percent =
    result.totalPairs > 0
      ? Math.round((result.correctCount / result.totalPairs) * 100)
      : 0;

  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-border bg-card p-6 space-y-4 text-center"
    >
      <h2 className="font-serif text-2xl font-semibold">Your score</h2>
      <p className="text-5xl font-semibold tabular-nums text-pink-ink">
        {percent}%
      </p>
      <p className="text-sm text-muted-foreground">
        {result.correctCount} correct · {incorrectCount} incorrect
      </p>
      <p className="text-base leading-relaxed">
        {resolveMatchScoreMessage(percent)}
      </p>
    </section>
  );
}
