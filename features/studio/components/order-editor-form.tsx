"use client";

import { useState } from "react";

import type { ExperienceMode, ExperienceRow, OrderRow } from "@/types/database";
import type { ExperiencePhotoRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import { MatchBuilderPanel } from "@/features/match/components/match-builder-panel";
import type { MatchStudioConfig } from "@/features/match/types";
import { QuizBuilderPanel } from "@/features/quiz/components/quiz-builder-panel";
import type { ExperienceQuiz } from "@/features/quiz/types";
import {
  changeExperienceModeAction,
  updateExperienceDraftAction,
} from "@/features/studio/actions/orders";
import { ExperienceModeBadge } from "@/features/studio/components/experience-mode-badge";
import { MemoryCodePanel } from "@/features/studio/components/memory-code-panel";
import { ModePanelStub } from "@/features/studio/components/mode-panel-stub";
import { OrderActionBar } from "@/features/studio/components/order-action-bar";
import { PhotosUploadPanel } from "@/features/studio/components/photos-upload-panel";
import { PublishChecklist } from "@/features/studio/components/publish-checklist";
import { EXPERIENCE_MODES } from "@/features/studio/config/experience-modes";
import type { PublishChecklistItem } from "@/features/studio/config/publish-checklist";
import { EnvelopeBuilderPanel } from "@/features/treasures/components/envelope-builder-panel";
import type { EnvelopeStudioConfig } from "@/features/treasures/types";

type OrderEditorFormProps = {
  order: OrderRow;
  experience: ExperienceRow;
  photos: ExperiencePhotoRow[];
  initialQuiz: ExperienceQuiz;
  initialMatch: MatchStudioConfig;
  initialEnvelopes: EnvelopeStudioConfig;
  checklistItems: PublishChecklistItem[];
  canPublish: boolean;
  adminMemoryCodeReference: string | null;
  publishedRecipientUrl: string | null;
  qrDownloadUrl: string | null;
};

export function OrderEditorForm({
  order,
  experience,
  photos,
  initialQuiz,
  initialMatch,
  initialEnvelopes,
  checklistItems,
  canPublish,
  adminMemoryCodeReference,
  publishedRecipientUrl,
  qrDownloadUrl,
}: OrderEditorFormProps) {
  const [greetingName, setGreetingName] = useState(experience.greeting_name);
  const [closingName, setClosingName] = useState(experience.closing_name);
  const [letterContent, setLetterContent] = useState(experience.letter_content);
  const [letterClosing, setLetterClosing] = useState(experience.letter_closing);
  const [experiencePhotos, setExperiencePhotos] = useState<
    ExperiencePhotoRow[]
  >(photos ?? []);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>(
    experience.experience_mode,
  );
  const [pendingMode, setPendingMode] = useState<ExperienceMode | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPublished = experience.status === "published";
  const isLocked = Boolean(experience.content_locked_at);

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

  async function handleSaveDraft() {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const result = await updateExperienceDraftAction({
      orderId: order.id,
      experienceId: experience.id,
      greetingName,
      closingName,
      letterContent,
      letterClosing,
    });

    setIsSaving(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setMessage("Draft saved.");
  }

  function requestModeChange(mode: ExperienceMode) {
    if (mode === experienceMode) return;
    setPendingMode(mode);
  }

  async function confirmModeChange() {
    if (!pendingMode) return;

    setIsSaving(true);
    setError(null);

    const result = await changeExperienceModeAction({
      orderId: order.id,
      experienceId: experience.id,
      experienceMode: pendingMode,
    });

    setIsSaving(false);
    setPendingMode(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setExperienceMode(pendingMode);
    setMessage(`Mode changed to ${pendingMode}.`);
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              {order.order_number}
            </p>
            <h1 className="font-serif text-2xl font-semibold">
              {order.receiver_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              From {order.sender_name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExperienceModeBadge mode={experienceMode} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
              Order: {order.status.replace("_", " ")}
            </span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
              Experience: {experience.status}
            </span>
          </div>
        </div>
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

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold">Core — letter</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="greetingName" className="text-sm font-medium">
              Greeting name
            </label>
            <input
              id="greetingName"
              value={greetingName}
              onChange={(e) => setGreetingName(e.target.value)}
              className={inputClass}
              disabled={isSaving || isLocked}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="closingName" className="text-sm font-medium">
              Closing name
            </label>
            <input
              id="closingName"
              value={closingName}
              onChange={(e) => setClosingName(e.target.value)}
              className={inputClass}
              disabled={isSaving || isLocked}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="letterContent" className="text-sm font-medium">
            Letter content
          </label>
          <textarea
            id="letterContent"
            rows={6}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className={inputClass}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="letterClosing" className="text-sm font-medium">
            Letter closing
          </label>
          <input
            id="letterClosing"
            value={letterClosing}
            onChange={(e) => setLetterClosing(e.target.value)}
            className={inputClass}
            disabled={isSaving}
          />
        </div>
      </section>

      <PhotosUploadPanel
        orderId={order.id}
        experienceId={experience.id}
        initialPhotos={experiencePhotos}
        disabled={isLocked}
        onPhotosChange={(next) => setExperiencePhotos(next ?? [])}
      />

      {experienceMode === "connection" ? (
        <QuizBuilderPanel
          key={[
            experience.id,
            experience.quiz_title ?? "",
            ...initialQuiz.questions.map((question) => question.id),
            ...initialQuiz.bands.map((band) => band.id),
          ].join(":")}
          orderId={order.id}
          experienceId={experience.id}
          initialQuiz={initialQuiz}
          initialQuizTitle={experience.quiz_title ?? ""}
          letterDraft={{
            greetingName,
            closingName,
            letterContent,
            letterClosing,
          }}
          disabled={isLocked}
        />
      ) : experienceMode === "memories" ? (
        <MatchBuilderPanel
          key={[
            experience.id,
            experience.final_unlock_message ?? "",
            ...initialMatch.pairs.map((pair) => pair.id),
          ].join(":")}
          orderId={order.id}
          experienceId={experience.id}
          initialMatch={initialMatch}
          photos={experiencePhotos}
          disabled={isLocked}
        />
      ) : experienceMode === "treasures" ? (
        <EnvelopeBuilderPanel
          key={[
            experience.id,
            ...initialEnvelopes.envelopes.map((envelope) => envelope.id),
          ].join(":")}
          orderId={order.id}
          experienceId={experience.id}
          initialEnvelopes={initialEnvelopes}
          photos={experiencePhotos}
          disabled={isLocked}
        />
      ) : (
        <ModePanelStub mode={experienceMode} />
      )}

      <MemoryCodePanel
        orderId={order.id}
        experienceId={experience.id}
        memoryKeyHash={experience.memory_key_hash}
        adminMemoryCodeReference={adminMemoryCodeReference}
        disabled={isLocked}
      />

      <PublishChecklist items={checklistItems} />

      <OrderActionBar
        orderId={order.id}
        experienceId={experience.id}
        canPublish={canPublish}
        isPublished={isPublished}
        buyerWhatsapp={order.buyer_whatsapp}
        publishedRecipientUrl={publishedRecipientUrl}
        qrDownloadUrl={qrDownloadUrl}
      />

      <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-sm font-semibold">Change mode (draft only)</h2>
        <p className="text-xs text-muted-foreground">
          Changing mode may remove incompatible configuration in future sprints.
        </p>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => requestModeChange(mode.value)}
              disabled={isSaving || mode.value === experienceMode}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
            >
              {mode.label}
            </button>
          ))}
        </div>
      </section>

      {pendingMode ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm font-medium">Change mode to {pendingMode}?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {experienceMode === "connection" && pendingMode !== "connection"
              ? "Saved quiz questions, score bands, and quiz title will be permanently removed."
              : experienceMode === "memories" && pendingMode !== "memories"
                ? "Saved match pairs and final unlock message will be permanently removed."
                : experienceMode === "treasures" && pendingMode !== "treasures"
                  ? "Saved envelope configuration will be permanently removed."
                  : "Incompatible premium configuration will be removed when changing mode."}
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={confirmModeChange}
              disabled={isSaving || isLocked}
            >
              Confirm
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setPendingMode(null)}
              disabled={isSaving || isLocked}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaving || isLocked}
        >
          {isSaving ? "Saving…" : "Save draft"}
        </Button>
      </div>
    </div>
  );
}
