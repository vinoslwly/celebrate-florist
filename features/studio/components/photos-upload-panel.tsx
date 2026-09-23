"use client";

import { useId, useRef, useState } from "react";

import type { ExperiencePhotoRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parsePhotoCaption } from "@/features/experience/lib/photo-caption";
import {
  deleteExperiencePhotoAction,
  updateExperiencePhotoCaptionAction,
  uploadExperiencePhotoAction,
} from "@/features/studio/actions/photos";

type PhotosUploadPanelProps = {
  orderId: string;
  experienceId: string;
  initialPhotos: ExperiencePhotoRow[];
  disabled?: boolean;
  onPhotosChange?: (photos: ExperiencePhotoRow[]) => void;
};

const SLOTS = [1, 2, 3, 4, 5, 6] as const;

export function PhotosUploadPanel({
  orderId,
  experienceId,
  initialPhotos,
  disabled = false,
  onPhotosChange,
}: PhotosUploadPanelProps) {
  const [photos, setPhotos] = useState(initialPhotos ?? []);
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function photoForSlot(slot: number): ExperiencePhotoRow | undefined {
    return photos.find((photo) => photo.sort_order === slot);
  }

  function replacePhoto(updated: ExperiencePhotoRow) {
    let next: ExperiencePhotoRow[] = [];
    setPhotos((current) => {
      next = current
        .map((row) => (row.id === updated.id ? updated : row))
        .sort((a, b) => a.sort_order - b.sort_order);
      return next;
    });
    onPhotosChange?.(next);
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

    let next: ExperiencePhotoRow[] = [];
    setPhotos((current) => {
      const withoutSlot = current.filter((p) => p.sort_order !== slot);
      next = [...withoutSlot, result.data.photo].sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      return next;
    });
    onPhotosChange?.(next);
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

    let next: ExperiencePhotoRow[] = [];
    setPhotos((current) => {
      next = current.filter((p) => p.id !== photo.id);
      return next;
    });
    onPhotosChange?.(next);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-serif text-base font-semibold text-foreground">
        Memory photos
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Up to 6 photos per experience. Images are resized and saved as WebP.
        Title and description appear next to each photo on the gallery.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SLOTS.map((slot) => {
          const photo = photoForSlot(slot);
          const isBusy = busySlot === slot;

          return (
            <div
              key={slot}
              className="flex flex-col rounded-xl border border-dashed border-border bg-muted/20 p-3"
            >
              <div className="flex min-h-28 flex-col items-center justify-center text-center">
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

              {photo ? (
                <PhotoCaptionFields
                  key={photo.id}
                  orderId={orderId}
                  experienceId={experienceId}
                  photo={photo}
                  disabled={disabled || isBusy}
                  onError={setError}
                  onSaved={replacePhoto}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PhotoCaptionFields({
  orderId,
  experienceId,
  photo,
  disabled,
  onError,
  onSaved,
}: {
  orderId: string;
  experienceId: string;
  photo: ExperiencePhotoRow;
  disabled: boolean;
  onError: (message: string | null) => void;
  onSaved: (photo: ExperiencePhotoRow) => void;
}) {
  const parsed = parsePhotoCaption(photo.caption);
  const titleId = useId();
  const descriptionId = useId();
  const [title, setTitle] = useState(parsed.title);
  const [description, setDescription] = useState(parsed.body);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setBusy(true);
    onError(null);
    setSaved(false);

    const result = await updateExperiencePhotoCaptionAction({
      orderId,
      experienceId,
      photoId: photo.id,
      title,
      description,
    });

    setBusy(false);

    if (!result.ok) {
      onError(result.error.message);
      return;
    }

    onSaved(result.data.photo);
    setSaved(true);
  }

  return (
    <div className="mt-3 space-y-2 border-t border-border/70 pt-3 text-left">
      <div className="space-y-1">
        <Label htmlFor={titleId} className="text-xs">
          Title
        </Label>
        <Input
          id={titleId}
          value={title}
          maxLength={80}
          placeholder="First Hello"
          disabled={disabled || busy}
          onChange={(event) => {
            setTitle(event.target.value);
            setSaved(false);
          }}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={descriptionId} className="text-xs">
          Description
        </Label>
        <Textarea
          id={descriptionId}
          value={description}
          maxLength={240}
          rows={3}
          placeholder="The sky felt wider the moment you walked in."
          disabled={disabled || busy}
          onChange={(event) => {
            setDescription(event.target.value);
            setSaved(false);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          disabled={disabled || busy}
          onClick={() => void handleSave()}
        >
          {busy ? "Saving…" : "Save copy"}
        </Button>
        {saved ? (
          <span className="text-xs text-muted-foreground">Saved</span>
        ) : null}
      </div>
    </div>
  );
}
