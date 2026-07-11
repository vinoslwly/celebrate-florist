/**
 * Future image pipeline hooks.
 *
 * Sprint 04 prepares the interface only — no transforms run yet.
 * Studio upload sprint will add resize/WebP conversion before storage.
 */
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

/**
 * Placeholder for the future server-side image pipeline.
 * Throws until Sprint 05+ implements transforms.
 */
export async function processImageForStorage(
  _input: ImagePipelineInput,
): Promise<ImagePipelineOutput> {
  throw new Error(
    "Image pipeline not implemented — upload feature ships in a future sprint",
  );
}
