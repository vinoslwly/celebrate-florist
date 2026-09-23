/**
 * Public website links may be a same-site path or an https URL.
 * Executable schemes (javascript, data, vbscript, and anything else) are rejected.
 */
export function isSafePublicHref(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) {
    return false;
  }
  if (trimmed.includes("\\") || /[\u0000-\u001f\u007f]/.test(trimmed)) {
    return false;
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    if (url.username || url.password) {
      return false;
    }
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/**
 * Field names whose stored values are non-empty and not a safe href.
 * Values are not returned, so logs do not repeat a rejected URL.
 */
export function unsafeStoredHrefFields(stored: unknown): string[] {
  const root = asRecord(stored);
  const brand = asRecord(root.brand);
  const links = asRecord(root.links);
  const hero = asRecord(root.hero);
  const experience = asRecord(root.experience);
  const fields: Array<[string, unknown]> = [
    ["brand.logoUrl", brand.logoUrl],
    ["brand.faviconUrl", brand.faviconUrl],
    ["links.bouquetUrl", links.bouquetUrl],
    ["links.instagramUrl", links.instagramUrl],
    ["links.demoHref", links.demoHref],
    ["hero.imageUrl", hero.imageUrl],
  ];

  const themes = Array.isArray(experience.themes) ? experience.themes : [];
  themes.forEach((theme, index) => {
    fields.push([
      `experience.themes.${index}.imageUrl`,
      asRecord(theme).imageUrl,
    ]);
  });

  return fields
    .filter(([, value]) => {
      return (
        typeof value === "string" &&
        value.trim() !== "" &&
        !isSafePublicHref(value)
      );
    })
    .map(([name]) => name);
}
