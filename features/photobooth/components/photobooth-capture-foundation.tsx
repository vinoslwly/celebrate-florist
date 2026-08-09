"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useCamera } from "@/features/photobooth/hooks/use-camera";
import { useCaptureSequence } from "@/features/photobooth/hooks/use-capture-sequence";
import {
  composeStrip,
  composeStripForDownload,
} from "@/features/photobooth/lib/compose-strip";
import {
  buildPhotoboothFilename,
  downloadBlob,
  getExportPixelSize,
  PHOTOBOOTH_EXPORT_MIRROR,
} from "@/features/photobooth/lib/export";
import {
  getDefaultFilterId,
  getFilterPreset,
  PHOTOBOOTH_FILTERS,
} from "@/features/photobooth/lib/filters";
import {
  getLayoutAspectCss,
  getLayoutMeta,
  PHOTOBOOTH_LAYOUTS,
} from "@/features/photobooth/lib/layouts";
import {
  getCompatibleStripPresets,
  resolveDefaultStripPreset,
} from "@/features/photobooth/lib/strip-presets";
import type {
  CountdownSeconds,
  PhotoboothFilterId,
  PhotoboothLayoutId,
  PhotoboothThemeId,
} from "@/features/photobooth/lib/types";

export type PhotoboothCaptureFoundationProps = {
  greetingName: string;
  themeEmoji?: string;
  /** Default Layout B (3 poses). */
  initialLayoutId?: PhotoboothLayoutId;
  /** Theme pack for strip presets — Bloom only in 14.4. */
  themeId?: PhotoboothThemeId;
};

/**
 * Shared Photobooth (Sprint 14.2–14.5).
 * Capture → strip + filter → final preview → client-side download.
 * No stickers · no app watermark · branding in Founder strip art.
 */
export function PhotoboothCaptureFoundation({
  greetingName,
  themeEmoji,
  initialLayoutId = "B",
  themeId = "bloom",
}: PhotoboothCaptureFoundationProps) {
  const [layoutId, setLayoutId] = useState<PhotoboothLayoutId>(initialLayoutId);
  const [mirrorPreview, setMirrorPreview] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState<CountdownSeconds>(3);
  const [filterId, setFilterId] =
    useState<PhotoboothFilterId>(getDefaultFilterId);
  const [compositionUrl, setCompositionUrl] = useState<string | null>(null);
  const [compositionError, setCompositionError] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const compositionUrlRef = useRef<string | null>(null);

  const compatiblePresets = useMemo(
    () => getCompatibleStripPresets(themeId, layoutId),
    [themeId, layoutId],
  );
  const [stripPresetId, setStripPresetId] = useState(
    () =>
      resolveDefaultStripPreset(themeId, initialLayoutId)?.id ?? "bloom-soft",
  );
  const stripPreset =
    compatiblePresets.find((p) => p.id === stripPresetId) ??
    compatiblePresets[0] ??
    null;

  const filter = getFilterPreset(filterId);
  const layout = getLayoutMeta(layoutId);
  const aspectCss = getLayoutAspectCss(layoutId);

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

  const poseUrlsKey = poses.map((p) => p.objectUrl).join("|");

  const replaceCompositionUrl = useCallback((next: string | null) => {
    if (compositionUrlRef.current) {
      URL.revokeObjectURL(compositionUrlRef.current);
    }
    compositionUrlRef.current = next;
    setCompositionUrl(next);
  }, []);

  /** Layout change resets captures (filter + strip preference preserved where possible). */
  useEffect(() => {
    resetAll();
  }, [layoutId, resetAll]);

  const selectLayout = (id: PhotoboothLayoutId) => {
    if (id === layoutId) return;
    const next = resolveDefaultStripPreset(themeId, id, stripPresetId);
    if (next) setStripPresetId(next.id);
    setLayoutId(id);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      resetAll();
      if (compositionUrlRef.current) {
        URL.revokeObjectURL(compositionUrlRef.current);
        compositionUrlRef.current = null;
      }
    };
  }, [stopCamera, resetAll]);

  /** Drop composition when capture set is incomplete. */
  useEffect(() => {
    if (isComplete && poses.length >= layout.poseCount) return;
    const id = window.setTimeout(() => {
      replaceCompositionUrl(null);
      setCompositionError(null);
      setComposing(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [isComplete, layout.poseCount, poses.length, replaceCompositionUrl]);

  /**
   * Compose when poses ready. Strip/filter changes recompose without
   * resetting captures or camera.
   */
  useEffect(() => {
    if (!isComplete || poses.length < layout.poseCount) return;

    let cancelled = false;
    const urls = poses.map((p) => p.objectUrl);

    const id = window.setTimeout(() => {
      if (cancelled) return;
      setComposing(true);
      setCompositionError(null);

      void composeStrip({
        layoutId,
        poseObjectUrls: urls,
        preset: stripPreset,
        filterId,
      })
        .then((result) => {
          if (cancelled) {
            if (result) URL.revokeObjectURL(result.objectUrl);
            return;
          }
          if (!result) {
            setCompositionError("Could not compose the strip. Try Reset.");
            setComposing(false);
            return;
          }
          replaceCompositionUrl(result.objectUrl);
          setComposing(false);
        })
        .catch(() => {
          if (cancelled) return;
          setCompositionError("Could not compose the strip. Try Reset.");
          setComposing(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [
    filterId,
    isComplete,
    layout.poseCount,
    layoutId,
    poseUrlsKey,
    poses,
    replaceCompositionUrl,
    stripPreset,
  ]);

  const busy =
    phase === "counting" || phase === "flashing" || phase === "capturing";

  const exportPixels = getExportPixelSize(layoutId);

  const handleDownload = async () => {
    if (!isComplete || poses.length < layout.poseCount || downloading) return;
    setDownloading(true);
    setDownloadMessage(null);
    setCompositionError(null);
    try {
      const result = await composeStripForDownload({
        layoutId,
        poseObjectUrls: poses.map((p) => p.objectUrl),
        preset: stripPreset,
        filterId,
      });
      if (!result) {
        setCompositionError("Could not prepare download. Try again.");
        return;
      }
      const filename = buildPhotoboothFilename(layoutId);
      downloadBlob(result.blob, filename);
      // Preview URL is separate — revoke only the export object URL.
      URL.revokeObjectURL(result.objectUrl);
      setDownloadMessage(`Saved ${filename}`);
    } catch {
      setCompositionError("Download failed. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleStartOver = () => {
    resetAll();
    setDownloadMessage(null);
    setCompositionError(null);
  };

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
          Strip + filter · {layout.label}
          {stripPreset ? ` · ${stripPreset.label}` : ""} · {filter.label} ·{" "}
          {layout.canvas.width}×{layout.canvas.height}px
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_minmax(0,10.5rem)] lg:items-start">
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
                  onClick={() => selectLayout(id)}
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
          <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-[#2a2a2e]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              data-testid="live-preview"
              data-filter-id={filterId}
              style={{ filter: filter.cssFilter }}
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
            Live preview may mirror for aiming · download is{" "}
            {PHOTOBOOTH_EXPORT_MIRROR ? "mirrored" : "unmirrored"} (Option A).
          </p>

          {isComplete ? (
            <div
              className="mt-3 w-full max-w-md rounded-2xl border border-[#F5B8C8]/80 bg-gradient-to-b from-[#FFF8FA] to-card p-4 shadow-sm"
              data-testid="final-preview"
              data-layout-id={layoutId}
              data-strip-id={stripPreset?.id ?? ""}
              data-filter-id={filterId}
              data-aspect={`${layout.aspectRatio.w}:${layout.aspectRatio.h}`}
              data-export-mirror={PHOTOBOOTH_EXPORT_MIRROR ? "1" : "0"}
              data-export-size={`${exportPixels.width}x${exportPixels.height}`}
            >
              <p className="text-center font-serif text-lg font-semibold text-[#7A2436]">
                Your keepsake for {greetingName}
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {layout.label}
                {stripPreset ? ` · ${stripPreset.label}` : ""} · {filter.label}
              </p>
              <p className="mt-0.5 text-center font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                Final preview · download {exportPixels.width}×
                {exportPixels.height} JPEG
              </p>

              {composing ? (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Preparing preview…
                </p>
              ) : null}
              {compositionError ? (
                <p
                  className="mt-3 text-center text-sm text-destructive"
                  role="alert"
                >
                  {compositionError}
                </p>
              ) : null}

              {compositionUrl ? (
                <div
                  className="mx-auto mt-4 max-h-[min(70vh,36rem)] w-full overflow-hidden rounded-lg border border-border bg-white/70"
                  style={{
                    aspectRatio: aspectCss,
                    maxWidth: layoutId === "B" ? "12rem" : "18rem",
                  }}
                  data-testid="composition-preview"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={compositionUrl}
                    alt={`Photobooth keepsake for ${greetingName}`}
                    className="h-full w-full object-contain"
                    data-testid="composition-image"
                    draggable={false}
                  />
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  className="min-w-[10rem] rounded-full bg-[#C45B7A] hover:bg-[#A84566]"
                  disabled={downloading || composing || !compositionUrl}
                  data-testid="download-button"
                  onClick={() => void handleDownload()}
                >
                  {downloading ? "Preparing…" : "Download"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={busy || downloading}
                  data-testid="start-over-button"
                  onClick={handleStartOver}
                >
                  Start over
                </Button>
              </div>

              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Change strip or filter on the right anytime — no retake needed.
              </p>
              {downloadMessage ? (
                <p
                  className="mt-2 text-center text-xs text-[#7A2436]"
                  data-testid="download-message"
                >
                  {downloadMessage}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Right: strip + filter + poses */}
        <aside className="mx-auto flex w-full max-w-[11rem] flex-col gap-3">
          <div
            className="rounded-xl border border-border bg-card p-2"
            data-testid="strip-selector"
            aria-label="Strip designs"
          >
            <p className="mb-1.5 text-center font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              Strip design
            </p>
            <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto overscroll-contain">
              {compatiblePresets.map((preset) => {
                const selected = stripPreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    data-testid={`strip-preset-${preset.id}`}
                    data-selected={selected ? "true" : "false"}
                    onClick={() => setStripPresetId(preset.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition-colors",
                      selected
                        ? "border-[#C45B7A] bg-[#C45B7A]/10 text-[#7A2436]"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-7 w-5 shrink-0 rounded-sm border border-black/10"
                      style={{ background: preset.swatch }}
                    />
                    <span className="leading-tight font-medium">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-xl border border-border bg-card p-2"
            data-testid="filter-selector"
            aria-label="Photo filters"
          >
            <p className="mb-1.5 text-center font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              Filter
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {PHOTOBOOTH_FILTERS.map((preset) => {
                const selected = filterId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    data-testid={`filter-${preset.id}`}
                    data-selected={selected ? "true" : "false"}
                    onClick={() => setFilterId(preset.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-[10px] transition-colors",
                      selected
                        ? "border-[#C45B7A] bg-[#C45B7A]/10 text-[#7A2436]"
                        : "border-border hover:bg-muted/50",
                    )}
                    title={preset.label}
                  >
                    <span
                      aria-hidden
                      className="h-6 w-6 rounded-full border border-black/10"
                      style={{
                        background: preset.swatch,
                        filter:
                          preset.id === "original"
                            ? undefined
                            : preset.cssFilter,
                      }}
                    />
                    <span className="leading-none font-medium">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-center text-[9px] text-muted-foreground">
              Live preview · universal
            </p>
          </div>

          <div
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2"
            aria-label="Captured poses"
            data-testid="raw-strip"
            data-pose-count={layout.poseCount}
          >
            <p className="text-center font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              Poses · raw
            </p>
            {Array.from({ length: layout.poseCount }).map((_, i) => {
              const pose = poses[i];
              return (
                <div
                  key={`slot-${layoutId}-${i}`}
                  className="relative aspect-square overflow-hidden rounded-lg border border-dashed border-border bg-muted/40"
                  data-testid={`raw-slot-${i}`}
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
          </div>
        </aside>
      </div>
    </section>
  );
}
