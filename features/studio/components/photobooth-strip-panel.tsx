"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type {
  ExperiencePhotoboothStripRow,
  PhotoboothStripSource,
} from "@/types/database";

import { Button } from "@/components/ui/button";
import { BLOOM_STRIP_PRESETS } from "@/features/photobooth/lib/strip-presets";
import {
  deletePhotoboothStripAction,
  setPhotoboothStripSourceAction,
  uploadPhotoboothStripAction,
} from "@/features/studio/actions/photobooth-strips";

type CatalogStripPreview = {
  id: string;
  name: string;
  url: string;
};

type PhotoboothStripPanelProps = {
  orderId: string;
  experienceId: string;
  initialSource: PhotoboothStripSource;
  initialStrips: ExperiencePhotoboothStripRow[];
  initialPreviewUrls: Record<string, string>;
  catalogStrips?: CatalogStripPreview[];
  disabled?: boolean;
};

const SLOTS = [1, 2, 3, 4, 5, 6] as const;

export function PhotoboothStripPanel({
  orderId,
  experienceId,
  initialSource,
  initialStrips,
  initialPreviewUrls,
  catalogStrips = [],
  disabled = false,
}: PhotoboothStripPanelProps) {
  const [source, setSource] = useState<PhotoboothStripSource>(
    initialSource ?? "catalog",
  );
  const [strips, setStrips] = useState(initialStrips ?? []);
  const [previewUrls, setPreviewUrls] = useState(initialPreviewUrls ?? {});
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function stripForSlot(
    slot: number,
  ): ExperiencePhotoboothStripRow | undefined {
    return strips.find((row) => row.sort_order === slot);
  }

  async function handleSourceChange(next: PhotoboothStripSource) {
    if (next === source || disabled) return;
    setSourceBusy(true);
    setError(null);
    const result = await setPhotoboothStripSourceAction({
      orderId,
      experienceId,
      source: next,
    });
    setSourceBusy(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setSource(result.data.experience.photobooth_strip_source);
  }

  async function handleUpload(slot: number, file: File) {
    setBusySlot(slot);
    setError(null);

    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("experienceId", experienceId);
    formData.set("sortOrder", String(slot));
    formData.set("layoutId", "B");
    formData.set("file", file);

    const result = await uploadPhotoboothStripAction(formData);
    setBusySlot(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setStrips((current) => {
      const withoutSlot = current.filter((row) => row.sort_order !== slot);
      return [...withoutSlot, result.data.strip].sort(
        (a, b) => a.sort_order - b.sort_order,
      );
    });
    setPreviewUrls((current) => ({
      ...current,
      [result.data.strip.id]: result.data.previewUrl,
    }));
  }

  async function handleDelete(strip: ExperiencePhotoboothStripRow) {
    setBusySlot(strip.sort_order);
    setError(null);
    const result = await deletePhotoboothStripAction({
      orderId,
      experienceId,
      stripId: strip.id,
    });
    setBusySlot(null);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setStrips((current) => current.filter((row) => row.id !== strip.id));
    setPreviewUrls((current) => {
      const next = { ...current };
      delete next[strip.id];
      return next;
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-serif text-base font-semibold text-foreground">
        Photobooth strip
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose the templates the recipient uses when taking photos. Standard
        catalog, or custom PNGs for this order.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <SourceCard
          selected={source === "catalog"}
          disabled={disabled || sourceBusy}
          title="Standard catalog"
          description="Recipient uses the 5.5 × 15.5 cm strip (3 stacked photos)."
          onSelect={() => void handleSourceChange("catalog")}
        />
        <SourceCard
          selected={source === "custom"}
          disabled={disabled || sourceBusy}
          title="Custom event"
          description="Only the transparent PNG overlays you upload for this order (max 6)."
          onSelect={() => void handleSourceChange("custom")}
        />
      </div>

      <div className="mt-4 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        {source === "catalog" ? (
          <p>
            Active mode: catalog. The recipient sees the standard strip
            templates in the photobooth.
          </p>
        ) : (
          <p>
            Active mode: custom. Upload PNG overlays with transparent photo
            holes. One layout only: 3 photos, 5.5 cm × 15.5 cm (portrait PNG).
          </p>
        )}
      </div>

      {source === "catalog" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {catalogStrips.length > 0
            ? catalogStrips.map((strip) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={strip.id}
                  src={strip.url}
                  alt={strip.name}
                  title={strip.name}
                  className="h-16 w-10 rounded-md border border-border object-contain bg-background"
                />
              ))
            : BLOOM_STRIP_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="h-16 w-10 rounded-md border border-border"
                  style={{ background: preset.background }}
                  title={preset.label}
                />
              ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SLOTS.map((slot) => {
            const strip = stripForSlot(slot);
            const isBusy = busySlot === slot;
            const preview = strip ? previewUrls[strip.id] : null;

            return (
              <div
                key={slot}
                className="flex flex-col rounded-xl border border-dashed border-border bg-muted/20 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Slot {slot}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {strip ? "Uploaded" : "Empty"}
                  </span>
                </div>

                <div className="mt-2 flex aspect-[1/3] items-center justify-center overflow-hidden rounded-md bg-background">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={`Custom strip ${slot}`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="px-2 text-center text-xs text-muted-foreground">
                      PNG overlay
                    </span>
                  )}
                </div>

                <input
                  ref={(el) => {
                    inputRefs.current[slot] = el;
                  }}
                  type="file"
                  accept="image/png"
                  className="hidden"
                  disabled={disabled || isBusy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleUpload(slot, file);
                    }
                    event.target.value = "";
                  }}
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled || isBusy}
                    onClick={() => inputRefs.current[slot]?.click()}
                  >
                    {strip ? "Replace" : "Upload PNG"}
                  </Button>
                  {strip ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled || isBusy}
                      onClick={() => void handleDelete(strip)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SourceCard({
  selected,
  disabled,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  disabled: boolean;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/40",
        disabled && "opacity-60",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex size-4 items-center justify-center rounded-full border",
            selected ? "border-primary" : "border-muted-foreground",
          )}
          aria-hidden
        >
          {selected ? (
            <span className="size-2 rounded-full bg-primary" />
          ) : null}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </span>
      <span className="mt-2 block text-xs text-muted-foreground">
        {description}
      </span>
    </button>
  );
}
