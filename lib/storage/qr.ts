import "server-only";

import QRCode from "qrcode";

type QrPngOptions = {
  width?: number;
  margin?: number;
};

/**
 * Generates a PNG buffer for a printable experience QR code.
 */
export async function generateQrPngBuffer(
  url: string,
  options: QrPngOptions = {},
): Promise<ArrayBuffer> {
  const buffer = await QRCode.toBuffer(url, {
    type: "png",
    width: options.width ?? 512,
    margin: options.margin ?? 2,
    errorCorrectionLevel: "M",
  });

  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}
