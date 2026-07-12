import "server-only";

import sharp from "sharp";

/** Long edge cap for stored memory photos — balances quality and bandwidth. */
const DEFAULT_MAX_DIMENSION = 1920;

/** WebP quality for stored assets (resize + compress per architecture). */
const WEBP_QUALITY = 80;

export type ImagePipelineInput = {
  buffer: ArrayBuffer;
  mimeType: string;
  maxWidth?: number;
  maxHeight?: number;
};

export type ImagePipelineOutput = {
  buffer: ArrayBuffer;
  mimeType: string;
  width: number;
  height: number;
};

const SUPPORTED_INPUT_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

/**
 * Resizes, compresses, and converts uploads to WebP before storage.
 * All experience photos are stored as WebP in the experience-photos bucket.
 */
export async function processImageForStorage(
  input: ImagePipelineInput,
): Promise<ImagePipelineOutput> {
  const mime = input.mimeType.toLowerCase();
  if (!SUPPORTED_INPUT_MIME.has(mime)) {
    throw new Error(`Unsupported image type: ${input.mimeType}`);
  }

  const maxWidth = input.maxWidth ?? DEFAULT_MAX_DIMENSION;
  const maxHeight = input.maxHeight ?? DEFAULT_MAX_DIMENSION;

  const result = await sharp(Buffer.from(input.buffer))
    .rotate()
    .resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  const arrayBuffer = result.data.buffer.slice(
    result.data.byteOffset,
    result.data.byteOffset + result.data.byteLength,
  ) as ArrayBuffer;

  return {
    buffer: arrayBuffer,
    mimeType: "image/webp",
    width: result.info.width,
    height: result.info.height,
  };
}
