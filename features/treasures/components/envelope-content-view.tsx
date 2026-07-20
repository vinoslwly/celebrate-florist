import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import { ExperienceSurfaceCard } from "@/features/experience/components/experience-surface-card";
import {
  GiftFinalBadge,
  GiftMotif,
  giftDisplayName,
} from "@/features/treasures/components/gift-presentation";
import type { RecipientEnvelopeContent } from "@/features/treasures/types";

type EnvelopeContentViewProps = {
  content: RecipientEnvelopeContent;
  displayNumber: number;
  tone?: "recipient" | "preview";
  isFinal?: boolean;
  theme?: Theme;
};

/** FD-T5 — opened gift content: message, photo, or both. */
export function EnvelopeContentView({
  content,
  displayNumber,
  tone = "recipient",
  isFinal = false,
  theme,
}: EnvelopeContentViewProps) {
  const hasMessage = Boolean(content.messageText?.trim());
  const hasPhoto = content.photo !== null;
  const isPreview = tone === "preview";

  return (
    <ExperienceSurfaceCard
      tone={isPreview ? "preview" : "recipient"}
      theme={theme}
      aria-live="polite"
      aria-label={
        isFinal
          ? `${giftDisplayName(displayNumber - 1)}, final gift, opened`
          : `${giftDisplayName(displayNumber - 1)}, opened gift`
      }
      className={cn(
        !isPreview && "border-l-4 border-l-primary/40 pl-5",
        isFinal && !isPreview && "ring-1 ring-pink-ink/15",
      )}
    >
      <div className="flex items-start gap-3">
        <GiftMotif
          state="opened"
          kind={isFinal ? "final" : "standard"}
          size="sm"
          theme={theme}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={cn(
                "font-serif font-semibold",
                isPreview ? "text-lg" : "text-2xl",
              )}
            >
              {giftDisplayName(displayNumber - 1)}
            </h2>
            {isFinal ? <GiftFinalBadge theme={theme} /> : null}
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Opened gift
          </p>
        </div>
      </div>

      {hasMessage ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Message</p>
          <p className="whitespace-pre-wrap text-base leading-relaxed">
            {content.messageText}
          </p>
        </div>
      ) : null}

      {hasPhoto && content.photo ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Photo</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.photo.signedUrl}
            alt={content.photo.caption ?? `Memory photo ${displayNumber}`}
            className="max-h-96 w-full rounded-xl object-cover"
          />
          {content.photo.caption ? (
            <p className="text-sm text-muted-foreground">
              {content.photo.caption}
            </p>
          ) : null}
        </div>
      ) : null}
    </ExperienceSurfaceCard>
  );
}
