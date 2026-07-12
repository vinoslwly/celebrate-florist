"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { QUIZ_TEMPLATE_PICKER_OPTIONS } from "@/features/quiz/config/template-picker-options";
import type { QuizTemplateId } from "@/features/quiz/types";

type QuizTemplatePickerProps = {
  disabled?: boolean;
  isApplying?: boolean;
  hasExistingContent: boolean;
  onApply: (templateId: QuizTemplateId) => Promise<void>;
};

export function QuizTemplatePicker({
  disabled = false,
  isApplying = false,
  hasExistingContent,
  onApply,
}: QuizTemplatePickerProps) {
  const [pendingTemplateId, setPendingTemplateId] =
    useState<QuizTemplateId | null>(null);

  const pendingTemplate = QUIZ_TEMPLATE_PICKER_OPTIONS.find(
    (option) => option.id === pendingTemplateId,
  );

  async function confirmApply() {
    if (!pendingTemplateId) {
      return;
    }

    await onApply(pendingTemplateId);
    setPendingTemplateId(null);
  }

  async function handleSelect(templateId: QuizTemplateId) {
    if (hasExistingContent) {
      setPendingTemplateId(templateId);
      return;
    }

    await onApply(templateId);
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">Starter templates</h3>
        <p className="text-xs text-muted-foreground">
          Pre-fill questions and score bands, then edit before saving.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {QUIZ_TEMPLATE_PICKER_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => void handleSelect(option.id)}
            disabled={disabled || isApplying}
            className="rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
          >
            <span className="block text-sm font-medium">{option.label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {option.description}
            </span>
          </button>
        ))}
      </div>

      {pendingTemplate ? (
        <div
          role="dialog"
          aria-labelledby="quiz-template-confirm-title"
          className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4"
        >
          <p id="quiz-template-confirm-title" className="text-sm font-medium">
            Apply the {pendingTemplate.label} template?
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This will replace your current quiz questions and score bands.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => void confirmApply()}
              disabled={disabled || isApplying}
            >
              {isApplying ? "Applying…" : "Apply template"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setPendingTemplateId(null)}
              disabled={isApplying}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
