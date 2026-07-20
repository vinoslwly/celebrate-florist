import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PreviewReviewFrameProps = {
  receiverName: string;
  children: ReactNode;
};

/** Calmer evaluation shell — structurally aligned with recipient, visually quieter. */
export function PreviewReviewFrame({
  receiverName,
  children,
}: PreviewReviewFrameProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:space-y-10">
      <header className="space-y-3 border-b border-border/80 pb-6 text-center">
        <p className="inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Buyer preview
        </p>
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
          {receiverName}&apos;s experience
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
          Review how the recipient experience will feel before publishing. This
          view is calmer and more evaluative than the live gift.
        </p>
      </header>
      {children}
    </div>
  );
}

type PreviewContextNoteProps = {
  children: ReactNode;
  className?: string;
};

export function PreviewContextNote({
  children,
  className,
}: PreviewContextNoteProps) {
  return (
    <p
      className={cn(
        "rounded-lg border border-border/70 bg-muted/20 px-3 py-2 text-center text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
