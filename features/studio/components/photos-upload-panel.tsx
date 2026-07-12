"use client";

import { useRef, useState } from "react";

import type { ExperiencePhotoRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import {
  deleteExperiencePhotoAction,
  uploadExperiencePhotoAction,
} from "@/features/studio/actions/photos";

type PhotosUploadPanelProps = {
  orderId: string;
  experienceId: string;
  initialPhotos: ExperiencePhotoRow[];
  disabled?: boolean;
};

const SLOTS = [1, 2, 3, 4, 5, 6] as const;

export function PhotosUploadPanel({
  orderId,
  experienceId,
  initialPhotos,
  disabled = false,
}: PhotosUploadPanelProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function photoForSlot(slot: number): ExperiencePhotoRow | undefined {
    return photos.find((photo) => photo.sort_order === slot);
  }

  async function handleUpload(slot: number, file: File) {
    setBusySlot(slot);
    setError(null);

    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("experienceId", experienceId);
    formData.set("sortOrder", String(slot));
    formData.set("file", file);

    const result = await uploadExperiencePhotoAction(formData);
    setBusySlot(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setPhotos((current) => {
      const withoutSlot = current.filter((p) => p.sort_order !== slot);
      return [...withoutSlot, result.data.photo].sort(
        (a, b) => a.sort_order - b.sort_order,
      );
    });
  }

  async function handleDelete(photo: ExperiencePhotoRow) {
    setBusySlot(photo.sort_order);
    setError(null);

    const result = await deleteExperiencePhotoAction({
      orderId,
      experienceId,
      photoId: photo.id,
    });

    setBusySlot(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setPhotos((current) => current.filter((p) => p.id !== photo.id));
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">Memory photos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Up to 6 photos per experience. Images are resized and saved as WebP.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SLOTS.map((slot) => {
          const photo = photoForSlot(slot);
          const isBusy = busySlot === slot;

          return (
            <div
              key={slot}
              className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-3 text-center"
            >
              <span className="text-xs font-medium text-muted-foreground">
                Slot {slot}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {photo ? "Uploaded" : "Empty"}
              </span>

              <input
                ref={(el) => {
                  inputRefs.current[slot] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp"
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

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled || isBusy}
                  onClick={() => inputRefs.current[slot]?.click()}
                >
                  {photo ? "Replace" : "Upload"}
                </Button>
                {photo ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled || isBusy}
                    onClick={() => void handleDelete(photo)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
