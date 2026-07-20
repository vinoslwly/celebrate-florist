import { ExperienceSurfaceCard } from "@/features/experience/components/experience-surface-card";
import type { PreviewQuizView } from "@/features/quiz/types";

type BuyerPreviewQuizProps = {
  quiz: PreviewQuizView;
};

export function BuyerPreviewQuiz({ quiz }: BuyerPreviewQuizProps) {
  const sortedQuestions = [...quiz.questions].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const sortedBands = [...quiz.bands].sort(
    (left, right) => left.minPercent - right.minPercent,
  );

  return (
    <ExperienceSurfaceCard tone="preview" className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-serif text-lg font-semibold">
          {quiz.quizTitle?.trim() || "Connection quiz"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Preview structure — correct answers are hidden from buyers.
        </p>
      </header>

      {sortedQuestions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No quiz questions saved yet. Add questions in Studio before sending
          preview.
        </p>
      ) : null}

      <div className="space-y-4">
        {sortedQuestions.map((question, index) => (
          <article
            key={question.sortOrder}
            className="rounded-xl border border-border/70 bg-muted/15 p-4 space-y-2"
          >
            <h3 className="text-sm font-semibold">Question {index + 1}</h3>
            <p className="text-sm">{question.prompt}</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {question.options.map((option, optionIndex) => (
                <li key={`${question.sortOrder}-${optionIndex}`}>
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {sortedBands.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Score band messages</h3>
          {sortedBands.map((band, index) => (
            <div
              key={`band-${index}`}
              className="rounded-lg border border-border/70 px-3 py-2 text-sm"
            >
              <p className="font-medium">
                {band.minPercent}% – {band.maxPercent}%
              </p>
              <p className="mt-1 text-muted-foreground">{band.message}</p>
            </div>
          ))}
        </div>
      ) : null}
    </ExperienceSurfaceCard>
  );
}
