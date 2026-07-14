import type { RecipientEnvelopeContent } from "@/features/treasures/types";

type EnvelopeContentViewProps = {
  content: RecipientEnvelopeContent;
  displayNumber: number;
};

/** FD-T5 — message, photo, or both; presence-based rendering only. */
export function EnvelopeContentView({
  content,
  displayNumber,
}: EnvelopeContentViewProps) {
  const hasMessage = Boolean(content.messageText?.trim());
  const hasPhoto = content.photo !== null;

  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-border bg-card p-6 space-y-4"
    >
      <h2 className="font-serif text-xl font-semibold">
        Envelope {displayNumber}
      </h2>

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
    </section>
  );
}
