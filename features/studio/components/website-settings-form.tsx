"use client";

import { useState } from "react";

import {
  saveWebsiteContentAction,
  uploadWebsiteAssetAction,
} from "@/features/studio/actions/website";
import type {
  WebsiteContent,
  WebsiteFaqItem,
} from "@/features/website/config/types";

import type { WebsiteAssetKind } from "@/schemas/studio-website";

type WebsiteSettingsFormProps = {
  initialContent: WebsiteContent;
};

export function WebsiteSettingsForm({
  initialContent,
}: WebsiteSettingsFormProps) {
  const [content, setContent] = useState(initialContent);
  const [busy, setBusy] = useState(false);
  const [uploadKind, setUploadKind] = useState<WebsiteAssetKind | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof WebsiteContent>(
    section: K,
    next: Partial<WebsiteContent[K]>,
  ) {
    setContent((current) => ({
      ...current,
      [section]: { ...current[section], ...next },
    }));
  }

  async function handleAsset(kind: WebsiteAssetKind, file: File) {
    setUploadKind(kind);
    setError(null);
    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("file", file);
    const result = await uploadWebsiteAssetAction(formData);
    setUploadKind(null);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    if (kind === "logo") patch("brand", { logoUrl: result.data.url });
    if (kind === "favicon") patch("brand", { faviconUrl: result.data.url });
    if (kind === "hero") patch("hero", { imageUrl: result.data.url });
    if (
      kind === "theme-bloom" ||
      kind === "theme-warm" ||
      kind === "theme-sky"
    ) {
      const slug = kind.replace("theme-", "") as "bloom" | "warm" | "sky";
      setContent((current) => ({
        ...current,
        experience: {
          ...current.experience,
          themes: current.experience.themes.map((theme) =>
            theme.slug === slug
              ? { ...theme, imageUrl: result.data.url }
              : theme,
          ),
        },
      }));
    }
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    setMessage(null);
    const result = await saveWebsiteContentAction(content);
    setBusy(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setContent(result.data.content);
    setMessage(
      "Pengaturan website tersimpan. Refresh beranda untuk melihatnya.",
    );
  }

  return (
    <form
      className="studio-settings"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSave();
      }}
    >
      {error ? (
        <p className="studio-banner studio-banner--bad" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="studio-banner studio-banner--ok" role="status">
          {message}
        </p>
      ) : null}

      <section className="studio-panel">
        <h2>Merek</h2>
        <div className="studio-form-grid">
          <label>
            Judul situs
            <input
              value={content.brand.siteTitle}
              onChange={(event) =>
                patch("brand", { siteTitle: event.target.value })
              }
            />
          </label>
          <label>
            Deskripsi
            <textarea
              rows={3}
              value={content.brand.siteDescription}
              onChange={(event) =>
                patch("brand", { siteDescription: event.target.value })
              }
            />
          </label>
        </div>
        <div className="studio-asset-row">
          <AssetField
            label="Logo"
            url={content.brand.logoUrl}
            kind="logo"
            accept="image/png,image/jpeg,image/webp"
            busy={uploadKind === "logo"}
            onFile={(file) => void handleAsset("logo", file)}
          />
          <AssetField
            label="Favicon"
            url={content.brand.faviconUrl}
            kind="favicon"
            accept="image/png,image/jpeg,image/webp"
            busy={uploadKind === "favicon"}
            onFile={(file) => void handleAsset("favicon", file)}
          />
        </div>
      </section>

      <section className="studio-panel">
        <h2>Warna</h2>
        <div className="studio-color-row">
          {(
            [
              ["cream", "Cream"],
              ["rose", "Rose"],
              ["gold", "Gold"],
              ["ink", "Tinta"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <span className="studio-color-input">
                <input
                  type="color"
                  value={content.colors[key]}
                  onChange={(event) =>
                    patch("colors", { [key]: event.target.value })
                  }
                />
                <input
                  value={content.colors[key]}
                  onChange={(event) =>
                    patch("colors", { [key]: event.target.value })
                  }
                />
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="studio-panel">
        <h2>WhatsApp & tautan</h2>
        <div className="studio-form-grid">
          <label>
            Nomor WhatsApp (62…)
            <input
              inputMode="numeric"
              value={content.whatsapp.number}
              onChange={(event) =>
                patch("whatsapp", {
                  number: event.target.value.replace(/\D/g, ""),
                })
              }
            />
          </label>
          <label>
            Pesan order
            <textarea
              rows={2}
              value={content.whatsapp.orderMessage}
              onChange={(event) =>
                patch("whatsapp", { orderMessage: event.target.value })
              }
            />
          </label>
          <label>
            URL katalog bouquet
            <input
              value={content.links.bouquetUrl}
              onChange={(event) =>
                patch("links", { bouquetUrl: event.target.value })
              }
            />
          </label>
          <label>
            Instagram
            <input
              value={content.links.instagramUrl}
              onChange={(event) =>
                patch("links", { instagramUrl: event.target.value })
              }
            />
          </label>
          <label>
            Tautan demo
            <input
              value={content.links.demoHref}
              onChange={(event) =>
                patch("links", { demoHref: event.target.value })
              }
            />
          </label>
        </div>
      </section>

      <section className="studio-panel">
        <h2>Hero</h2>
        <div className="studio-form-grid">
          <label>
            Eyebrow
            <input
              value={content.hero.eyebrow}
              onChange={(event) =>
                patch("hero", { eyebrow: event.target.value })
              }
            />
          </label>
          <label>
            Judul
            <input
              value={content.hero.title}
              onChange={(event) => patch("hero", { title: event.target.value })}
            />
          </label>
          <label>
            Lead
            <textarea
              rows={4}
              value={content.hero.lead}
              onChange={(event) => patch("hero", { lead: event.target.value })}
            />
          </label>
          <label>
            Label tombol order
            <input
              value={content.hero.ctaLabel}
              onChange={(event) =>
                patch("hero", { ctaLabel: event.target.value })
              }
            />
          </label>
          <label>
            Label tombol demo
            <input
              value={content.hero.demoLabel}
              onChange={(event) =>
                patch("hero", { demoLabel: event.target.value })
              }
            />
          </label>
          <label>
            Caption foto
            <input
              value={content.hero.caption}
              onChange={(event) =>
                patch("hero", { caption: event.target.value })
              }
            />
          </label>
        </div>
        <AssetField
          label="Gambar hero"
          url={content.hero.imageUrl}
          kind="hero"
          accept="image/png,image/jpeg,image/webp"
          busy={uploadKind === "hero"}
          onFile={(file) => void handleAsset("hero", file)}
        />
      </section>

      <section className="studio-panel">
        <h2>Tentang & koleksi</h2>
        <div className="studio-form-grid">
          <label>
            Judul “Apa itu Celebrate”
            <input
              value={content.whatIs.title}
              onChange={(event) =>
                patch("whatIs", { title: event.target.value })
              }
            />
          </label>
          <label>
            Isi tentang
            <textarea
              rows={4}
              value={content.whatIs.body}
              onChange={(event) =>
                patch("whatIs", { body: event.target.value })
              }
            />
          </label>
          <label>
            Judul “Mengapa”
            <input
              value={content.whyUs.title}
              onChange={(event) =>
                patch("whyUs", { title: event.target.value })
              }
            />
          </label>
          <label>
            Judul bouquet
            <input
              value={content.bouquet.title}
              onChange={(event) =>
                patch("bouquet", { title: event.target.value })
              }
            />
          </label>
        </div>
      </section>

      <section className="studio-panel">
        <h2>Kartu experience</h2>
        <div className="studio-form-grid">
          <label>
            Judul bagian
            <input
              value={content.experience.title}
              onChange={(event) =>
                patch("experience", { title: event.target.value })
              }
            />
          </label>
          <label>
            Intro
            <textarea
              rows={3}
              value={content.experience.intro}
              onChange={(event) =>
                patch("experience", { intro: event.target.value })
              }
            />
          </label>
        </div>
        <div className="studio-theme-editors">
          {content.experience.themes.map((theme, index) => (
            <article key={theme.slug} className="studio-theme-editor">
              <h3>
                {theme.slug === "bloom"
                  ? "Lovey"
                  : theme.slug === "warm"
                    ? "Darling"
                    : "Cloudie"}
              </h3>
              <label>
                Nama
                <input
                  value={theme.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setContent((current) => ({
                      ...current,
                      experience: {
                        ...current.experience,
                        themes: current.experience.themes.map(
                          (item, itemIndex) =>
                            itemIndex === index ? { ...item, name } : item,
                        ),
                      },
                    }));
                  }}
                />
              </label>
              <label>
                Deskripsi
                <textarea
                  rows={3}
                  value={theme.description}
                  onChange={(event) => {
                    const description = event.target.value;
                    setContent((current) => ({
                      ...current,
                      experience: {
                        ...current.experience,
                        themes: current.experience.themes.map(
                          (item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, description }
                              : item,
                        ),
                      },
                    }));
                  }}
                />
              </label>
              <AssetField
                label="Gambar"
                url={theme.imageUrl}
                kind={`theme-${theme.slug}`}
                accept="image/png,image/jpeg,image/webp"
                busy={uploadKind === `theme-${theme.slug}`}
                onFile={(file) => void handleAsset(`theme-${theme.slug}`, file)}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="studio-panel">
        <h2>FAQ</h2>
        <div className="studio-form-grid">
          {content.faq.items.map((item, index) => (
            <FaqEditor
              key={item.id}
              item={item}
              onChange={(next) =>
                setContent((current) => ({
                  ...current,
                  faq: {
                    ...current.faq,
                    items: current.faq.items.map((row, rowIndex) =>
                      rowIndex === index ? next : row,
                    ),
                  },
                }))
              }
              onRemove={
                content.faq.items.length > 1
                  ? () =>
                      setContent((current) => ({
                        ...current,
                        faq: {
                          ...current.faq,
                          items: current.faq.items.filter(
                            (_, rowIndex) => rowIndex !== index,
                          ),
                        },
                      }))
                  : undefined
              }
            />
          ))}
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() =>
            setContent((current) => ({
              ...current,
              faq: {
                ...current.faq,
                items: [
                  ...current.faq.items,
                  {
                    id: `faq-${Date.now()}`,
                    question: "Pertanyaan baru",
                    answer: "Jawaban…",
                  },
                ],
              },
            }))
          }
        >
          Tambah FAQ
        </button>
      </section>

      <section className="studio-panel">
        <h2>CTA & footer</h2>
        <div className="studio-form-grid">
          <label>
            Judul CTA
            <input
              value={content.finalCta.title}
              onChange={(event) =>
                patch("finalCta", { title: event.target.value })
              }
            />
          </label>
          <label>
            Isi CTA
            <textarea
              rows={3}
              value={content.finalCta.body}
              onChange={(event) =>
                patch("finalCta", { body: event.target.value })
              }
            />
          </label>
          <label>
            Copyright
            <input
              value={content.footer.copyright}
              onChange={(event) =>
                patch("footer", { copyright: event.target.value })
              }
            />
          </label>
        </div>
      </section>

      <div className="studio-sticky-save">
        <button className="btn btn-brand" type="submit" disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan semua pengaturan"}
        </button>
      </div>
    </form>
  );
}

function AssetField({
  label,
  url,
  kind,
  accept,
  busy,
  onFile,
}: {
  label: string;
  url: string;
  kind: string;
  accept: string;
  busy: boolean;
  onFile: (file: File) => void;
}) {
  return (
    <label className="studio-asset-field">
      {label}
      <span className="studio-asset-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" />
      </span>
      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
      />
      <span className="muted">{busy ? "Mengunggah…" : kind}</span>
    </label>
  );
}

function FaqEditor({
  item,
  onChange,
  onRemove,
}: {
  item: WebsiteFaqItem;
  onChange: (item: WebsiteFaqItem) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="studio-faq-editor">
      <label>
        Pertanyaan
        <input
          value={item.question}
          onChange={(event) =>
            onChange({ ...item, question: event.target.value })
          }
        />
      </label>
      <label>
        Jawaban
        <textarea
          rows={3}
          value={item.answer}
          onChange={(event) =>
            onChange({ ...item, answer: event.target.value })
          }
        />
      </label>
      {onRemove ? (
        <button type="button" className="btn btn-outline" onClick={onRemove}>
          Hapus
        </button>
      ) : null}
    </div>
  );
}
