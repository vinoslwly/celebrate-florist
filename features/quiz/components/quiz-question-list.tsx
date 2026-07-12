import { Button } from "@/components/ui/button";
import {
  createEmptyQuestion,
  nextQuestionSortOrder,
} from "@/features/quiz/components/quiz-draft";
import { QuizQuestionEditor } from "@/features/quiz/components/quiz-question-editor";
import { QUIZ_MAX_QUESTIONS, QUIZ_MIN_QUESTIONS } from "@/schemas/studio-quiz";

import type { QuizQuestionInput } from "@/schemas/studio-quiz";

type QuizQuestionListProps = {
  questions: QuizQuestionInput[];
  disabled?: boolean;
  onChange: (questions: QuizQuestionInput[]) => void;
};

export function QuizQuestionList({
  questions,
  disabled = false,
  onChange,
}: QuizQuestionListProps) {
  const sortedQuestions = [...questions].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const canAdd = questions.length < QUIZ_MAX_QUESTIONS;
  const canRemove = questions.length > QUIZ_MIN_QUESTIONS;

  function updateQuestion(index: number, updated: QuizQuestionInput) {
    const next = [...sortedQuestions];
    next[index] = updated;
    onChange(next);
  }

  function removeQuestion(index: number) {
    if (!canRemove) {
      return;
    }

    onChange(
      sortedQuestions.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function addQuestion() {
    if (!canAdd) {
      return;
    }

    onChange([
      ...sortedQuestions,
      createEmptyQuestion(nextQuestionSortOrder(sortedQuestions)),
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Questions</h3>
          <p className="text-xs text-muted-foreground">
            Add between {QUIZ_MIN_QUESTIONS} and {QUIZ_MAX_QUESTIONS}{" "}
            multiple-choice questions.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addQuestion}
          disabled={disabled || !canAdd}
          aria-disabled={disabled || !canAdd}
        >
          Add question
        </Button>
      </div>

      {sortedQuestions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No questions yet. Add a question or start from a template below.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedQuestions.map((question, index) => (
            <QuizQuestionEditor
              key={question.sortOrder}
              question={question}
              index={index}
              disabled={disabled}
              canRemove={canRemove}
              onChange={(updated) => updateQuestion(index, updated)}
              onRemove={() => removeQuestion(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
