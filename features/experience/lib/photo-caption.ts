/**
 * Gallery copy is stored in experience_photos.caption as "Title · Description".
 * Sky / Bloom / Warm Moments galleries parse the same format.
 */
export function parsePhotoCaption(caption: string | null): {
  title: string;
  body: string;
} {
  if (!caption?.trim()) {
    return { title: "", body: "" };
  }
  const parts = caption.split(" · ");
  if (parts.length >= 2) {
    return { title: parts[0]!.trim(), body: parts.slice(1).join(" · ").trim() };
  }
  return { title: "", body: caption.trim() };
}

export function formatPhotoCaption(title: string, description: string): string {
  const trimmedTitle = title.trim();
  const trimmedBody = description.trim();
  if (!trimmedTitle && !trimmedBody) {
    return "";
  }
  // Always include the separator so title-only vs description-only is unambiguous.
  return `${trimmedTitle} · ${trimmedBody}`;
}

export function galleryCaptionCopy(
  caption: string | null,
  fallback: { title: string; body: string },
): { title: string; body: string } {
  const parsed = parsePhotoCaption(caption);
  return {
    title: parsed.title || fallback.title,
    body: parsed.body || fallback.body,
  };
}
