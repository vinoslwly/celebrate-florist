"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useCamera } from "@/features/photobooth/hooks/use-camera";
import { useCaptureSequence } from "@/features/photobooth/hooks/use-capture-sequence";
import {
  getLayoutMeta,
  PHOTOBOOTH_LAYOUTS,
} from "@/features/photobooth/lib/layouts";
import type {
  CountdownSeconds,
  PhotoboothLayoutId,
} from "@/features/photobooth/lib/types";

export type PhotoboothCaptureFoundationProps = {
  greetingName: string;
  themeEmoji?: string;
  /** Default Layout B (3 poses). */
  initialLayoutId?: PhotoboothLayoutId;
};

/**
 * Sprint 14.2 — shared capture foundation UI.
 * Center preview · right raw strip thumbs · left layout / mirror / flash.
 * No final frame/sticker/watermark/download composition yet.
 */
export function PhotoboothCaptureFoundation({
  greetingName,
  themeEmoji,
  initialLayoutId = "B",
}: PhotoboothCaptureFoundationProps) {
  const [layoutId, setLayoutId] = useState<PhotoboothLayoutId>(initialLayoutId);
  const [mirrorPreview, setMirrorPreview] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState<CountdownSeconds>(3);

  const layout = getLayoutMeta(layoutId);
  const {
    videoRef,
    status: cameraStatus,
    errorMessage: cameraError,
    isLive,
    enableCamera,
    stopCamera,
  } = useCamera();
  const {
    phase,
    countdownValue,
    flashVisible,
    poses,
    currentPoseIndex,
    captureError,
    isComplete,
    startCapture,
    retakeLast,
    resetAll,
  } = useCaptureSequence({
    poseCount: layout.poseCount,
    countdownSeconds,
    flashEnabled,
    videoRef,
  });

  /** Changing layout resets captures so pose counts stay consistent. */
  useEffect(() => {
    resetAll();
  }, [layoutId, resetAll]);

  useEffect(() => {
    return () => {
      stopCamera();
      resetAll();
    };
  }, [stopCamera, resetAll]);

  const busy =
    phase === "counting" || phase === "flashing" || phase === "capturing";

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="text-center sm:text-left">
        <h2 className="flex items-center justify-center gap-2 font-serif text-xl font-semibold sm:justify-start">
          {themeEmoji ? <span aria-hidden>{themeEmoji}</span> : null}
          Photobooth
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A keepsake for {greetingName}. Photos stay in your browser only —
          nothing is uploaded.
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          Capture foundation · {layout.label}
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-2">
        {([3, 5, 10] as const).map((sec) => (
          <button
            key={sec}
            type="button"
            disabled={busy}
            onClick={() => setCountdownSeconds(sec)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              countdownSeconds === sec
                ? "border-[#C45B7A] bg-[#C45B7A]/10 text-[#7A2436]"
                : "border-border text-muted-foreground hover:bg-muted/60",
            )}
          >
            {sec}s
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_minmax(0,8.5rem)] lg:items-start">
        {/* Left controls */}
        <aside className="flex flex-row flex-wrap gap-2 lg:flex-col">
          <p className="w-full text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Layout
          </p>
          {(Object.keys(PHOTOBOOTH_LAYOUTS) as PhotoboothLayoutId[]).map(
            (id) => {
              const meta = PHOTOBOOTH_LAYOUTS[id];
              return (
                <button
                  key={id}
                  type="button"
                  disabled={busy}
                  onClick={() => setLayoutId(id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                    layoutId === id
                      ? "border-[#C45B7A] bg-[#C45B7A]/10 text-[#7A2436]"
                      : "border-border bg-card hover:bg-muted/50",
                  )}
                >
                  <span className="font-semibold">{meta.shortLabel}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {meta.physicalInches.width}×{meta.physicalInches.height}{" "}
                    portrait
                  </span>
                </button>
              );
            },
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => setMirrorPreview((v) => !v)}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-semibold",
              mirrorPreview
                ? "border-[#C45B7A] bg-[#C45B7A] text-white"
                : "border-[#F5B8C8] bg-white text-[#C45B7A]",
            )}
          >
            Mirror: {mirrorPreview ? "On" : "Off"}
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => setFlashEnabled((v) => !v)}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-semibold",
              flashEnabled
                ? "border-[#C45B7A] bg-[#C45B7A] text-white"
                : "border-[#F5B8C8] bg-white text-[#C45B7A]",
            )}
          >
            Flash: {flashEnabled ? "On" : "Off"}
          </button>
        </aside>

        {/* Center camera */}
        <div className="flex min-w-0 flex-col items-center gap-3">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-[#2a2a2e] aspect-[3/4]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "h-full w-full object-cover",
                mirrorPreview && "scale-x-[-1]",
                !isLive && "opacity-0",
              )}
            />

            {!isLive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
                {cameraStatus === "idle" || cameraStatus === "requesting" ? (
                  <p className="text-sm text-white/85">
                    {cameraStatus === "requesting"
                      ? "Requesting camera…"
                      : "Enable your camera to begin."}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      {cameraStatus === "denied"
                        ? "Camera access denied"
                        : "Camera unavailable"}
                    </p>
                    <p className="max-w-xs text-xs text-white/75">
                      {cameraError}
                    </p>
                  </>
                )}
              </div>
            ) : null}

            {countdownValue != null ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35">
                <span className="font-serif text-7xl font-semibold text-white drop-shadow-lg">
                  {countdownValue}
                </span>
              </div>
            ) : null}

            {flashVisible ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-white"
              />
            ) : null}
          </div>

          {captureError ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {captureError}
            </p>
          ) : null}

          <div className="flex w-full max-w-md flex-wrap justify-center gap-2">
            {!isLive ? (
              <Button
                type="button"
                className="min-w-[12rem] rounded-full bg-[#C45B7A] hover:bg-[#A84566]"
                disabled={cameraStatus === "requesting"}
                onClick={() => void enableCamera()}
              >
                {cameraStatus === "denied" || cameraStatus === "unavailable"
                  ? "Try again"
                  : "Enable camera"}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  className="min-w-[10rem] rounded-full bg-[#C45B7A] hover:bg-[#A84566]"
                  disabled={busy || isComplete}
                  onClick={() => startCapture()}
                >
                  {isComplete
                    ? "All poses captured"
                    : `Capture pose ${currentPoseIndex + 1}/${layout.poseCount}`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={busy || poses.length === 0}
                  onClick={() => retakeLast()}
                >
                  Retake last
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={busy}
                  onClick={() => resetAll()}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full"
                  disabled={busy}
                  onClick={() => {
                    resetAll();
                    stopCamera();
                  }}
                >
                  Stop camera
                </Button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Pose{" "}
            {Math.min(
              currentPoseIndex + (isComplete ? 0 : 1),
              layout.poseCount,
            )}{" "}
            of {layout.poseCount}
            {isComplete ? " · complete" : ""}
            {" · "}
            Preview mirror does not bake into capture yet (export decision in
            14.3/14.5).
          </p>
        </div>

        {/* Right strip thumbs */}
        <aside
          className="mx-auto flex w-full max-w-[9rem] flex-col gap-2 rounded-xl border border-border bg-card p-2"
          aria-label="Captured poses"
        >
          <p className="text-center font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
            Strip preview
          </p>
          {Array.from({ length: layout.poseCount }).map((_, i) => {
            const pose = poses[i];
            return (
              <div
                key={`slot-${layoutId}-${i}`}
                className="relative aspect-square overflow-hidden rounded-lg border border-dashed border-border bg-muted/40"
              >
                {pose ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pose.objectUrl}
                    alt={`Pose ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-muted-foreground">
                    Awaiting
                  </div>
                )}
              </div>
            );
          })}
        </aside>
      </div>
    </section>
  );
}
