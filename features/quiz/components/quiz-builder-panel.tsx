"use client";

import { useId, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field, FieldHelper } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  applyQuizTemplateAction,
  saveQuizConfigAction,
} from "@/features/quiz/actions/quiz-config";
import {
  createDefaultBand,
  createEmptyQuestion,
  experienceQuizToDraft,
  hasQuizContent,
  type QuizDraftState,
} from "@/features/quiz/components/quiz-draft";
import { QuizQuestionList } from "@/features/quiz/components/quiz-question-list";
import { QuizScoreBandList } from "@/features/quiz/components/quiz-score-band-list";
import { QuizTemplatePicker } from "@/features/quiz/components/quiz-template-picker";
import type { ExperienceQuiz, QuizTemplateId } from "@/features/quiz/types";
import { updateExperienceDraftAction } from "@/features/studio/actions/orders";

type LetterDraft = {
  greetingName: string;
  closingName: string;
  letterContent: string;
  letterClosing: string;
};

type QuizBuilderPanelProps = {
  orderId: string;
  experienceId: string;
  initialQuiz: ExperienceQuiz;
  initialQuizTitle: string;
  letterDraft: LetterDraft;
  disabled?: boolean;
};

function createInitialDraft(quiz: ExperienceQuiz): QuizDraftState {
  const draft = experienceQuizToDraft(quiz);

  if (draft.questions.length === 0) {
    draft.questions = [createEmptyQuestion(1)];
  }

  if (draft.bands.length === 0) {
    draft.bands = [createDefaultBand()];
  }

  return draft;
}

export function QuizBuilderPanel({
  orderId,
  experienceId,
  initialQuiz,
  initialQuizTitle,
  letterDraft,
  disabled = false,
}: QuizBuilderPanelProps) {
  const router = useRouter();
  const quizTitleHelperId = useId();
  const [quizTitle, setQuizTitle] = useState(initialQuizTitle);
  const [draft, setDraft] = useState<QuizDraftState>(() =>
    createInitialDraft(initialQuiz),
  );
  const [busy, setBusy] = useState<"save" | "apply" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setBusy("save");
    setError(null);
    setMessage(null);

    const titleResult = await updateExperienceDraftAction({
      orderId,
      experienceId,
      greetingName: letterDraft.greetingName,
      closingName: letterDraft.closingName,
      letterContent: letterDraft.letterContent,
      letterClosing: letterDraft.letterClosing,
      quizTitle: quizTitle.trim() || null,
    });

    if (!titleResult.ok) {
      setBusy(null);
      setError(titleResult.error.message);
      return;
    }

    const saveResult = await saveQuizConfigAction({
      orderId,
      experienceId,
      questions: draft.questions,
      bands: draft.bands,
    });

    setBusy(null);

    if (!saveResult.ok) {
      setError(saveResult.error.message);
      return;
    }

    setDraft(experienceQuizToDraft(saveResult.data.quiz));
    setMessage("Quiz saved.");
    router.refresh();
  }

  async function handleApplyTemplate(templateId: QuizTemplateId) {
    setBusy("apply");
    setError(null);
    setMessage(null);

    const result = await applyQuizTemplateAction({
      orderId,
      experienceId,
      templateId,
    });

    setBusy(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setDraft(experienceQuizToDraft(result.data.quiz));
    setMessage("Template applied. Review the content, then save if needed.");
    router.refresh();
  }

  const hasExistingContent = hasQuizContent(draft, initialQuiz);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="font-serif text-base font-semibold text-foreground">
          Mode experience — Connection quiz
        </h2>
        <p className="text-sm text-muted-foreground">
          Build a personal quiz with up to six multiple-choice questions and
          score band messages.
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground">
          {message}
        </div>
      ) : null}

      <Field>
        <Label htmlFor="quiz-builder-title">Quiz title</Label>
        <Input
          id="quiz-builder-title"
          type="text"
          value={quizTitle}
          onChange={(event) => setQuizTitle(event.target.value)}
          disabled={disabled || busy !== null}
          placeholder="How well do you know me?"
          aria-describedby={quizTitleHelperId}
        />
        <FieldHelper id={quizTitleHelperId}>
          Optional heading shown above the quiz for recipients.
        </FieldHelper>
      </Field>

      <QuizQuestionList
        questions={draft.questions}
        disabled={disabled || busy !== null}
        onChange={(questions) =>
          setDraft((current) => ({ ...current, questions }))
        }
      />

      <QuizScoreBandList
        bands={draft.bands}
        disabled={disabled || busy !== null}
        onChange={(bands) => setDraft((current) => ({ ...current, bands }))}
      />

      <QuizTemplatePicker
        disabled={disabled}
        isApplying={busy === "apply"}
        hasExistingContent={hasExistingContent}
        onApply={handleApplyTemplate}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={disabled || busy !== null}
        >
          {busy === "save" ? "Saving quiz…" : "Save quiz"}
        </Button>
        {busy ? (
          <span className="text-xs text-muted-foreground" aria-live="polite">
            Please wait…
          </span>
        ) : null}
      </div>
    </section>
  );
}
