const RASTER_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

function looksLikeMarkup(buffer: ArrayBuffer): boolean {
  const head = Buffer.from(buffer)
    .subarray(0, 512)
    .toString("utf8")
    .replace(/^\uFEFF/, "")
    .trimStart()
    .toLowerCase();

  return (
    head.startsWith("<svg") ||
    head.startsWith("<?xml") ||
    head.startsWith("<!doctype") ||
    head.startsWith("<html") ||
    head.startsWith("<script") ||
    head.includes("<svg")
  );
}

/** True when the upload is not a raster image. MIME type alone is not trusted. */
export function isRejectedWebsiteAsset(
  mimeType: string,
  fileBuffer: ArrayBuffer,
): boolean {
  return (
    !RASTER_MIME.has(mimeType.toLowerCase()) || looksLikeMarkup(fileBuffer)
  );
}
