"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { useCamera } from "@/features/photobooth/hooks/use-camera";
import { useCaptureSequence } from "@/features/photobooth/hooks/use-capture-sequence";
import {
  composeStrip,
  composeStripForDownload,
} from "@/features/photobooth/lib/compose-strip";
import {
  buildPhotoboothFilename,
  downloadBlob,
} from "@/features/photobooth/lib/export";
import {
  getDefaultFilterId,
  getFilterPreset,
  PHOTOBOOTH_FILTERS,
} from "@/features/photobooth/lib/filters";
import {
  getLayoutAspectCss,
  getLayoutMeta,
} from "@/features/photobooth/lib/layouts";
import {
  getCompatibleStripPresets,
  resolveDefaultStripPreset,
} from "@/features/photobooth/lib/strip-presets";
import type {
  PhotoboothFilterId,
  PhotoboothStripPreset,
  PhotoboothThemeId,
} from "@/features/photobooth/lib/types";

type Step = "pick" | "shoot" | "download";

type FlowPalette = {
  ink: string;
  muted: string;
  heading: string;
  pill: string;
  pillActiveBg: string;
  pillActiveText: string;
  cardBg: string;
  cardBorder: string;
  cardBorderSelected: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  placeholder: string;
  chipActiveBg: string;
  chipActiveText: string;
  chipIdleBg: string;
  chipIdleText: string;
  outlineBorder: string;
  gradient: string;
  filterRing: string;
  error: string;
  success: string;
};

const SKY_FLOW_PALETTE: FlowPalette = {
  ink: "#E8F2FB",
  muted: "#9EC0DC",
  heading: "#FFFFFF",
  pill: "#12355C",
  pillActiveBg: "#F4F8FC",
  pillActiveText: "#071A33",
  cardBg: "#0C2748",
  cardBorder: "rgba(255,255,255,0.16)",
  cardBorderSelected: "#F4F8FC",
  inputBg: "rgba(255,255,255,0.10)",
  inputBorder: "rgba(255,255,255,0.15)",
  inputText: "#FFFFFF",
  placeholder: "rgba(255,255,255,0.45)",
  chipActiveBg: "#FFFFFF",
  chipActiveText: "#071A33",
  chipIdleBg: "rgba(255,255,255,0.10)",
  chipIdleText: "rgba(255,255,255,0.80)",
  outlineBorder: "rgba(255,255,255,0.25)",
  gradient: "linear-gradient(90deg, #3D7AAD 0%, #8EBFDE 100%)",
  filterRing: "#E8F2FB",
  error: "#FCA5A5",
  success: "#A7F3D0",
};

const BLOOM_FLOW_PALETTE: FlowPalette = {
  ink: "#8B2E3E",
  muted: "#C45B7A",
  heading: "#8B2E3E",
  pill: "#F4C9D6",
  pillActiveBg: "#FFFFFF",
  pillActiveText: "#8B2E3E",
  cardBg: "#FFFFFF",
  cardBorder: "rgba(196,91,122,0.28)",
  cardBorderSelected: "#C45B7A",
  inputBg: "#FFFFFF",
  inputBorder: "rgba(196,91,122,0.38)",
  inputText: "#8B2E3E",
  placeholder: "rgba(139,46,62,0.42)",
  chipActiveBg: "#FFFFFF",
  chipActiveText: "#8B2E3E",
  chipIdleBg: "rgba(255,255,255,0.62)",
  chipIdleText: "#C45B7A",
  outlineBorder: "rgba(196,91,122,0.38)",
  gradient: "linear-gradient(90deg, #F7A0B8 0%, #E05A7A 100%)",
  filterRing: "#C45B7A",
  error: "#B42318",
  success: "#2F6B3A",
};

const WARM_FLOW_PALETTE: FlowPalette = {
  ink: "#FFF8F0",
  muted: "#E8C96A",
  heading: "#FFF8F0",
  pill: "#6B0F16",
  pillActiveBg: "#FFF8F0",
  pillActiveText: "#4A0A10",
  cardBg: "#5A1016",
  cardBorder: "rgba(232,201,106,0.28)",
  cardBorderSelected: "#E8C96A",
  inputBg: "rgba(255,248,240,0.08)",
  inputBorder: "rgba(232,201,106,0.28)",
  inputText: "#FFF8F0",
  placeholder: "rgba(232,212,192,0.45)",
  chipActiveBg: "#FFF8F0",
  chipActiveText: "#4A0A10",
  chipIdleBg: "rgba(255,248,240,0.10)",
  chipIdleText: "#E8D4C0",
  outlineBorder: "rgba(232,201,106,0.35)",
  gradient: "linear-gradient(90deg, #7A121C 0%, #D4A24A 100%)",
  filterRing: "#E8C96A",
  error: "#FCA5A5",
  success: "#E8C96A",
};

function paletteFor(themeId: PhotoboothThemeId): FlowPalette {
  if (themeId === "bloom") return BLOOM_FLOW_PALETTE;
  if (themeId === "warm") return WARM_FLOW_PALETTE;
  return SKY_FLOW_PALETTE;
}

function stripPackTheme(themeId: PhotoboothThemeId): PhotoboothThemeId {
  return themeId === "sky" ? "bloom" : themeId;
}

type SkyPhotoboothFlowProps = {
  greetingName: string;
  themeId?: PhotoboothThemeId;
  customStripPresets?: PhotoboothStripPreset[];
  onComplete?: () => void;
};

export function SkyPhotoboothFlow({
  greetingName,
  themeId = "sky",
  customStripPresets,
  onComplete,
}: SkyPhotoboothFlowProps) {
  const palette = paletteFor(themeId);
  const layoutId = "B" as const;
  const layout = getLayoutMeta(layoutId);
  const aspectCss = getLayoutAspectCss(layoutId);
  const [filterId, setFilterId] =
    useState<PhotoboothFilterId>(getDefaultFilterId);
  const filter = getFilterPreset(filterId);

  const presets = useMemo(() => {
    if (customStripPresets && customStripPresets.length > 0) {
      return customStripPresets.filter((preset) =>
        preset.supportedLayouts.includes(layoutId),
      );
    }
    return getCompatibleStripPresets(stripPackTheme(themeId), layoutId);
  }, [customStripPresets, themeId]);

  const [step, setStep] = useState<Step>("pick");
  const [query, setQuery] = useState("");
  const [stripPresetId, setStripPresetId] = useState(
    () =>
      resolveDefaultStripPreset(stripPackTheme(themeId), layoutId)?.id ??
      presets[0]?.id ??
      "",
  );
  const [compositionUrl, setCompositionUrl] = useState<string | null>(null);
  const [compositionError, setCompositionError] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const compositionUrlRef = useRef<string | null>(null);

  const stripPreset =
    presets.find((preset) => preset.id === stripPresetId) ?? presets[0] ?? null;

  const visiblePresets = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return presets;
    return presets.filter((preset) =>
      preset.label.toLowerCase().includes(needle),
    );
  }, [presets, query]);

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
    countdownSeconds: 3,
    flashEnabled: true,
    videoRef,
  });

  const poseUrlsKey = poses.map((pose) => pose.objectUrl).join("|");
  const busy =
    phase === "counting" || phase === "flashing" || phase === "capturing";

  const replaceCompositionUrl = useCallback((next: string | null) => {
    if (compositionUrlRef.current) {
      URL.revokeObjectURL(compositionUrlRef.current);
    }
    compositionUrlRef.current = next;
    setCompositionUrl(next);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      resetAll();
      if (compositionUrlRef.current) {
        URL.revokeObjectURL(compositionUrlRef.current);
      }
    };
  }, [resetAll, stopCamera]);

  useEffect(() => {
    if (!isComplete || poses.length < layout.poseCount || !stripPreset) {
      const id = window.setTimeout(() => {
        replaceCompositionUrl(null);
        setCompositionError(null);
        setComposing(false);
      }, 0);
      return () => window.clearTimeout(id);
    }

    let cancelled = false;
    const urls = poses.map((pose) => pose.objectUrl);
    const id = window.setTimeout(() => {
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
            setCompositionError("Strip belum bisa disusun. Coba ulangi.");
            setComposing(false);
            return;
          }
          replaceCompositionUrl(result.objectUrl);
          setComposing(false);
          setStep("download");
        })
        .catch(() => {
          if (cancelled) return;
          setCompositionError("Strip belum bisa disusun. Coba ulangi.");
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
    poseUrlsKey,
    poses,
    replaceCompositionUrl,
    stripPreset,
  ]);

  async function handleDownload() {
    if (!isComplete || poses.length < layout.poseCount || downloading) return;
    setDownloading(true);
    setDownloadMessage(null);
    try {
      const result = await composeStripForDownload({
        layoutId,
        poseObjectUrls: poses.map((pose) => pose.objectUrl),
        preset: stripPreset,
        filterId,
      });
      if (!result) {
        setCompositionError("Unduhan gagal. Coba lagi.");
        return;
      }
      const filename = buildPhotoboothFilename(layoutId);
      downloadBlob(result.blob, filename);
      URL.revokeObjectURL(result.objectUrl);
      setDownloadMessage("Strip tersimpan.");
    } catch {
      setCompositionError("Unduhan gagal. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  }

  async function goShoot() {
    setDownloadMessage(null);
    setStep("shoot");
    await enableCamera();
  }

  const subtitle =
    step === "pick"
      ? "Pilih desain strip, lalu ambil foto sesuai jumlah bingkai."
      : step === "shoot"
        ? `Ambil ${layout.poseCount} foto. Foto hanya di browser ini.`
        : "Strip siap! Silakan unduh atau ganti desain.";

  return (
    <section
      className="flex w-full flex-col gap-5 px-1 pb-8 text-left"
      style={{ color: palette.ink }}
    >
      <header>
        <p
          className="font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: palette.muted }}
        >
          {"// PHOTOBOOTH"}
        </p>
        <h2
          className="mt-1 font-serif text-3xl font-semibold"
          style={{ color: palette.heading }}
        >
          Untuk {greetingName}
        </h2>
        <p className="mt-1 text-sm italic" style={{ color: palette.muted }}>
          {subtitle}
        </p>
      </header>

      <div className="flex gap-2">
        {(
          [
            ["pick", "1 Pilih strip"],
            ["shoot", "2 Ambil foto"],
            ["download", "3 Unduh"],
          ] as const
        ).map(([id, label]) => {
          const active = step === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (id === "download" && !isComplete) return;
                setStep(id);
              }}
              className="flex-1 rounded-full px-2 py-2 text-center text-[10px] font-semibold tracking-wide uppercase"
              style={{
                background: active ? palette.pillActiveBg : palette.pill,
                color: active ? palette.pillActiveText : palette.ink,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {step === "pick" ? (
        <div className="space-y-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari template strip..."
            className="w-full rounded-full px-4 py-2.5 text-sm outline-none"
            style={{
              background: palette.inputBg,
              border: `1px solid ${palette.inputBorder}`,
              color: palette.inputText,
            }}
          />
          <div className="flex gap-2">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{
                background: palette.chipActiveBg,
                color: palette.chipActiveText,
              }}
            >
              Semua
            </span>
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{
                background: palette.chipIdleBg,
                color: palette.chipIdleText,
              }}
            >
              3 bingkai
            </span>
          </div>
          <p className="text-xs" style={{ color: palette.muted }}>
            {visiblePresets.length} template tersedia
          </p>
          {visiblePresets.length === 0 ? (
            <p className="text-sm" style={{ color: palette.ink }}>
              Belum ada strip. Unggah PNG custom di Studio, atau gunakan katalog
              standar.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visiblePresets.map((preset, index) => {
                const selected = stripPreset?.id === preset.id;
                const cardLabel = preset.label || `Event strip ${index + 1}`;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setStripPresetId(preset.id)}
                    className="overflow-hidden rounded-2xl text-left"
                    style={{
                      border: selected
                        ? `2px solid ${palette.cardBorderSelected}`
                        : `1px solid ${palette.cardBorder}`,
                      background: palette.cardBg,
                    }}
                  >
                    <div className="relative mx-auto mt-3 aspect-[11/31] w-16 overflow-hidden rounded-sm bg-black/5">
                      {preset.frameSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={preset.frameSrc}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ background: preset.background }}
                        />
                      )}
                      <span
                        className="pointer-events-none absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/45 text-white"
                        aria-hidden
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                    </div>
                    <div className="p-3">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: palette.heading }}
                      >
                        {cardLabel}
                      </p>
                      <p
                        className="text-[11px]"
                        style={{ color: palette.muted }}
                      >
                        3 FOTO
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black",
          step !== "shoot" && "hidden",
        )}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ filter: filter.cssFilter }}
          className={cn(
            "h-full w-full object-cover scale-x-[-1]",
            !isLive && "opacity-0",
          )}
        />
        {step === "shoot" && !isLive ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/80">
            {cameraStatus === "requesting"
              ? "Meminta kameraâ€¦"
              : cameraError || "Aktifkan kamera untuk mulai."}
          </div>
        ) : null}
        {countdownValue != null ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="font-serif text-7xl text-white">
              {countdownValue}
            </span>
          </div>
        ) : null}
        {flashVisible ? (
          <div className="pointer-events-none absolute inset-0 bg-white" />
        ) : null}
      </div>

      {step === "shoot" ? (
        <div className="space-y-3">
          <p className="text-center text-xs" style={{ color: palette.muted }}>
            Foto{" "}
            {Math.min(
              currentPoseIndex + (isComplete ? 0 : 1),
              layout.poseCount,
            )}{" "}
            dari {layout.poseCount}
            {isComplete ? " Â· selesai" : ""}
          </p>
          {captureError ? (
            <p
              className="text-center text-sm"
              role="alert"
              style={{ color: palette.error }}
            >
              {captureError}
            </p>
          ) : null}
          <FilterPills
            filterId={filterId}
            onChange={setFilterId}
            palette={palette}
          />
        </div>
      ) : null}

      {step === "download" ? (
        <div className="space-y-4">
          <p
            className="font-mono text-[10px] tracking-[0.18em] uppercase"
            style={{ color: palette.muted }}
          >
            {"// PHOTOSTRIP KAMU"}
          </p>
          {composing ? (
            <p className="text-sm" style={{ color: palette.muted }}>
              Menyusun stripâ€¦
            </p>
          ) : null}
          {compositionError ? (
            <p
              className="text-sm"
              role="alert"
              style={{ color: palette.error }}
            >
              {compositionError}
            </p>
          ) : null}
          {compositionUrl ? (
            <>
              <div
                className="mx-auto overflow-hidden rounded-md bg-white"
                style={{
                  aspectRatio: aspectCss,
                  height: "min(70svh, 30rem)",
                  width: "auto",
                  maxWidth: "100%",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compositionUrl}
                  alt={`Photostrip untuk ${greetingName}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <p
                className="text-center text-[11px]"
                style={{ color: palette.muted }}
              >
                Ukuran cetak 5,5 Ã— 15,5 cm
              </p>
            </>
          ) : null}
          <button
            type="button"
            className="text-center text-sm underline"
            style={{ color: palette.muted }}
            onClick={() => setStep("pick")}
          >
            Ganti strip
          </button>
          <div>
            <p
              className="mb-2 text-[11px] font-semibold tracking-wide uppercase"
              style={{ color: palette.muted }}
            >
              Pilih strip lain (foto tetap)
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setStripPresetId(preset.id)}
                  className="w-24 shrink-0 rounded-xl p-2 text-left"
                  style={{
                    border:
                      stripPreset?.id === preset.id
                        ? `2px solid ${palette.cardBorderSelected}`
                        : `1px solid ${palette.cardBorder}`,
                    background: palette.cardBg,
                  }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: palette.heading }}
                  >
                    {preset.label}
                  </p>
                  <p className="text-[10px]" style={{ color: palette.muted }}>
                    3 FOTO
                  </p>
                </button>
              ))}
            </div>
          </div>
          {downloadMessage ? (
            <p
              className="text-center text-sm"
              style={{ color: palette.success }}
            >
              {downloadMessage}
            </p>
          ) : null}
          <FilterPills
            filterId={filterId}
            onChange={setFilterId}
            palette={palette}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {step !== "download" ? (
          <button
            type="button"
            disabled={
              busy ||
              (step === "pick" && !stripPreset) ||
              (step === "shoot" && (isComplete || !isLive))
            }
            onClick={() => {
              if (step === "pick") {
                if (!stripPreset) return;
                void goShoot();
                return;
              }
              startCapture();
            }}
            className="w-full rounded-full py-3 text-sm font-semibold text-white disabled:opacity-40"
            style={{ backgroundImage: palette.gradient }}
          >
            {step === "pick"
              ? "Ambil foto"
              : isComplete
                ? "Semua foto selesai"
                : `Ambil foto ${currentPoseIndex + 1}/${layout.poseCount}`}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              resetAll();
              setDownloadMessage(null);
              void goShoot();
            }}
            className="w-full rounded-full py-3 text-sm font-semibold text-white disabled:opacity-40"
            style={{ backgroundImage: palette.gradient }}
          >
            Ambil foto
          </button>
        )}
        <button
          type="button"
          disabled={busy || poses.length === 0}
          onClick={() => {
            retakeLast();
            setDownloadMessage(null);
            void goShoot();
          }}
          className="w-full rounded-full py-3 text-sm font-semibold disabled:opacity-40"
          style={{
            border: `1px solid ${palette.outlineBorder}`,
            color: palette.ink,
          }}
        >
          Ulangi foto terakhir
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            resetAll();
            setDownloadMessage(null);
            void goShoot();
          }}
          className="w-full rounded-full py-3 text-sm font-semibold disabled:opacity-40"
          style={{
            border: `1px solid ${palette.outlineBorder}`,
            color: palette.ink,
          }}
        >
          Ulangi semua
        </button>
        <button
          type="button"
          disabled={downloading || composing || !compositionUrl}
          onClick={() => void handleDownload()}
          className="w-full rounded-full py-3 text-sm font-semibold disabled:opacity-40"
          style={{
            border: `1px solid ${palette.outlineBorder}`,
            color: palette.ink,
          }}
        >
          {downloading ? "Menyiapkanâ€¦" : "Unduh strip"}
        </button>
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onComplete?.();
          }}
          className="w-full rounded-full py-3 text-sm font-semibold text-white"
          style={{ backgroundImage: palette.gradient }}
        >
          Selesai
        </button>
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onComplete?.();
          }}
          className="py-2 text-center text-sm underline"
          style={{ color: palette.muted }}
        >
          Lewati
        </button>
      </div>
    </section>
  );
}

function FilterPills({
  filterId,
  onChange,
  palette,
}: {
  filterId: PhotoboothFilterId;
  onChange: (id: PhotoboothFilterId) => void;
  palette: FlowPalette;
}) {
  return (
    <div className="space-y-2">
      <p
        className="font-serif text-sm tracking-wide uppercase"
        style={{ color: palette.heading }}
      >
        Filter
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PHOTOBOOTH_FILTERS.map((preset) => {
          const selected = filterId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.id)}
              className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold"
              style={{
                background: preset.swatch,
                color: "#1A1A1A",
                boxShadow: selected
                  ? `0 0 0 2px ${palette.filterRing}`
                  : "none",
              }}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
