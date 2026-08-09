"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { PhotoboothCaptureFoundation } from "@/features/photobooth/components/photobooth-capture-foundation";
import type {
  PhotoboothLayoutId,
  PhotoboothThemeId,
} from "@/features/photobooth/lib/types";

export type PhotoboothProps = {
  greetingName: string;
  themeEmoji?: string;
  /**
   * `legacy` — single-shot card (default) for existing production imports.
   * `capture` — Sprint 14 multi-pose + strip composition (Theme Lab host).
   */
  variant?: "legacy" | "capture";
  /** Used when variant is `capture`. Default Layout B. */
  initialLayoutId?: PhotoboothLayoutId;
  /** Strip pack theme — Bloom in 14.4; Warm/Sky packs later. */
  themeId?: PhotoboothThemeId;
};

/**
 * Shared Photobooth entry.
 * Default API unchanged for legacy experience flows.
 * Theme Lab uses `variant="capture"`.
 */
export function Photobooth({
  greetingName,
  themeEmoji,
  variant = "legacy",
  initialLayoutId,
  themeId = "bloom",
}: PhotoboothProps) {
  if (variant === "capture") {
    return (
      <PhotoboothCaptureFoundation
        greetingName={greetingName}
        themeEmoji={themeEmoji}
        initialLayoutId={initialLayoutId}
        themeId={themeId}
      />
    );
  }

  return (
    <LegacyPhotobooth greetingName={greetingName} themeEmoji={themeEmoji} />
  );
}

/** Pre-14.2 single-shot UI — preserved for legacy imports. */
function LegacyPhotobooth({
  greetingName,
  themeEmoji,
}: {
  greetingName: string;
  themeEmoji?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  async function startCamera() {
    setError(null);
    setSnapshot(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: false,
      });
      streamRef.current = mediaStream;
      setActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError("Camera access is unavailable in this browser.");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0);
    setSnapshot(canvas.toDataURL("image/png"));
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
          {themeEmoji ? <span aria-hidden>{themeEmoji}</span> : null}
          Photobooth
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Snap a keepsake for {greetingName}. Photos stay in your browser only —
          nothing is uploaded.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        {!active ? (
          <Button type="button" onClick={() => void startCamera()}>
            Start photobooth
          </Button>
        ) : (
          <>
            <Button type="button" onClick={capturePhoto}>
              Capture
            </Button>
            <Button type="button" variant="outline" onClick={stopStream}>
              Stop camera
            </Button>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="aspect-square h-full w-full object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
          {snapshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={snapshot}
              alt="Photobooth snapshot"
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
              Your snapshot appears here
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}
