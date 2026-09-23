"use client";

import { useRef, useState } from "react";

import {
  deleteCatalogStripAction,
  renameCatalogStripAction,
  uploadCatalogStripAction,
} from "@/features/studio/actions/catalog-strips";
import type { CatalogStripWithUrl } from "@/features/studio/services/list-catalog-strips.service";
import { CATALOG_STRIP_MAX } from "@/schemas/studio-catalog-strips";

type CatalogStripsPanelProps = {
  initialStrips: CatalogStripWithUrl[];
};

export function CatalogStripsPanel({ initialStrips }: CatalogStripsPanelProps) {
  const [strips, setStrips] = useState(initialStrips);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload(file: File) {
    setBusy(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("displayName", file.name.replace(/\.png$/i, ""));
    const result = await uploadCatalogStripAction(formData);
    setBusy(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setStrips((current) => [...current, result.data.strip]);
  }

  async function handleRename(strip: CatalogStripWithUrl, displayName: string) {
    const next = displayName.trim();
    if (!next || next === strip.display_name) {
      setRenamingId(null);
      return;
    }
    setBusy(true);
    setError(null);
    const result = await renameCatalogStripAction({
      stripId: strip.id,
      displayName: next,
    });
    setBusy(false);
    setRenamingId(null);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setStrips((current) =>
      current.map((row) => (row.id === strip.id ? result.data.strip : row)),
    );
  }

  async function handleDelete(strip: CatalogStripWithUrl) {
    setBusy(true);
    setError(null);
    const result = await deleteCatalogStripAction({ stripId: strip.id });
    setBusy(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setStrips((current) => current.filter((row) => row.id !== strip.id));
  }

  const atLimit = strips.length >= CATALOG_STRIP_MAX;

  return (
    <section className="studio-panel">
      <div className="studio-page-head">
        <div>
          <h2>Katalog strip</h2>
          <p className="muted">
            {strips.length}/{CATALOG_STRIP_MAX} PNG. Layout B saja — 3 foto, 5,5
            × 15,5 cm, lubang transparan.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-brand"
          disabled={busy || atLimit}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Mengunggah…" : "Unggah PNG"}
        </button>
      </div>

      {error ? (
        <p className="studio-banner studio-banner--bad" role="alert">
          {error}
        </p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/png"
        className="hidden"
        hidden
        disabled={busy || atLimit}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
          event.target.value = "";
        }}
      />

      {strips.length === 0 ? (
        <p className="muted">
          Belum ada strip katalog. Unggah PNG overlay — photobooth mode katalog
          akan memakai ini, bukan preset prosedural.
        </p>
      ) : (
        <div className="studio-strip-grid">
          {strips.map((strip) => (
            <article key={strip.id} className="studio-strip-card">
              <div className="studio-strip-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={strip.publicUrl} alt={strip.display_name} />
              </div>
              {renamingId === strip.id ? (
                <input
                  defaultValue={strip.display_name}
                  autoFocus
                  disabled={busy}
                  onBlur={(event) =>
                    void handleRename(strip, event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.currentTarget.blur();
                    }
                    if (event.key === "Escape") {
                      setRenamingId(null);
                    }
                  }}
                />
              ) : (
                <strong>{strip.display_name}</strong>
              )}
              <div className="studio-strip-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={busy}
                  onClick={() => setRenamingId(strip.id)}
                >
                  Ubah nama
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={busy}
                  onClick={() => void handleDelete(strip)}
                >
                  Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
