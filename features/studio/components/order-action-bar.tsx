"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getQrDownloadUrlAction,
  publishExperienceAction,
  sendPreviewAction,
} from "@/features/studio/actions/publish";
import { SkipPreviewDialog } from "@/features/studio/components/skip-preview-dialog";

type OrderActionBarProps = {
  orderId: string;
  experienceId: string;
  canPublish: boolean;
  isPublished: boolean;
  buyerWhatsapp: string | null;
  /** Persisted recipient URL — available after publish. */
  publishedRecipientUrl: string | null;
  /** Same-origin QR download URL — available when QR exists. */
  qrDownloadUrl: string | null;
  onOrderUpdated?: () => void;
};

export function OrderActionBar({
  orderId,
  experienceId,
  canPublish,
  isPublished,
  buyerWhatsapp,
  publishedRecipientUrl,
  qrDownloadUrl: initialQrDownloadUrl,
  onOrderUpdated,
}: OrderActionBarProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recipientUrl, setRecipientUrl] = useState<string | null>(
    publishedRecipientUrl,
  );
  const [qrDownloadUrl, setQrDownloadUrl] = useState<string | null>(
    initialQrDownloadUrl,
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const activeRecipientUrl = recipientUrl ?? publishedRecipientUrl;

  async function handleSendPreview() {
    setBusy("preview");
    setError(null);

    const result = await sendPreviewAction({ orderId, experienceId });
    setBusy(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setPreviewUrl(result.data.previewUrl);
    onOrderUpdated?.();
  }

  async function handlePublish(skipPreview = false) {
    setBusy("publish");
    setError(null);

    const result = await publishExperienceAction({
      orderId,
      experienceId,
      skipPreview,
    });
    setBusy(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setRecipientUrl(result.data.recipientUrl);
    setQrDownloadUrl(result.data.qrDownloadUrl);
    onOrderUpdated?.();
  }

  async function downloadQrFile(url: string) {
    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(body?.error ?? "Failed to download QR code.");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `celebrate-qr-${orderId.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleQrDownload() {
    setBusy("qr");
    setError(null);

    try {
      let url = qrDownloadUrl;

      if (!url) {
        const result = await getQrDownloadUrlAction({ orderId, experienceId });

        if (!result.ok) {
          setError(result.error.message);
          return;
        }

        url = result.data.qrDownloadUrl;
        setQrDownloadUrl(url);
      }

      await downloadQrFile(url);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to download QR code.",
      );
    } finally {
      setBusy(null);
    }
  }

  const whatsappTemplate = previewUrl
    ? `Hi! Your Celebrate Florist bouquet preview is ready: ${previewUrl}`
    : null;

  return (
    <div className="space-y-4" aria-live="polite" aria-busy={busy !== null}>
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!isPublished ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={busy !== null}
              onClick={() => void handleSendPreview()}
            >
              {busy === "preview" ? "Sending…" : "Send preview"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy !== null}
              onClick={() => setShowSkipDialog(true)}
            >
              Skip preview
            </Button>
            <Button
              type="button"
              disabled={!canPublish || busy !== null}
              onClick={() => void handlePublish(false)}
            >
              {busy === "publish" ? "Publishing…" : "Publish"}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={busy !== null}
            onClick={() => void handleQrDownload()}
          >
            {busy === "qr" ? "Loading…" : "Download QR"}
          </Button>
        )}
      </div>

      {previewUrl ? (
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-2">
          <p className="font-medium">Preview link</p>
          <p className="break-all font-mono text-xs">{previewUrl}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void navigator.clipboard.writeText(previewUrl)}
            >
              Copy preview link
            </Button>
          </div>
          {buyerWhatsapp ? (
            <p className="text-xs text-muted-foreground">
              Buyer WhatsApp: {buyerWhatsapp}
            </p>
          ) : null}
          {whatsappTemplate ? (
            <p className="text-xs text-muted-foreground break-words">
              WhatsApp template: {whatsappTemplate}
            </p>
          ) : null}
        </div>
      ) : null}

      {isPublished && activeRecipientUrl ? (
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-3">
          <p className="font-medium">Recipient experience</p>
          <p className="break-all font-mono text-xs">{activeRecipientUrl}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" asChild>
              <a
                href={activeRecipientUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open link
              </a>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                void navigator.clipboard.writeText(activeRecipientUrl)
              }
            >
              Copy link
            </Button>
          </div>
          {qrDownloadUrl ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy !== null}
              onClick={() => void handleQrDownload()}
            >
              Download QR again
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              Use Download QR above for the printable bouquet QR.
            </p>
          )}
        </div>
      ) : null}

      <SkipPreviewDialog
        open={showSkipDialog}
        orderId={orderId}
        experienceId={experienceId}
        onClose={() => setShowSkipDialog(false)}
        onSkipped={() => {
          setShowSkipDialog(false);
          onOrderUpdated?.();
        }}
        onPublishAfterSkip={() => {
          setShowSkipDialog(false);
          void handlePublish(true);
        }}
      />
    </div>
  );
}
