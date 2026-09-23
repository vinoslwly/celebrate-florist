import type { LayoutRect } from "@/features/photobooth/lib/layouts";

const HOLE_ALPHA = 40;
const MIN_AREA_RATIO = 0.012;
const MAX_AREA_RATIO = 0.28;

type Box = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  area: number;
};

function touchesOuterPadding(box: Box, width: number, height: number): boolean {
  let edges = 0;
  if (box.minX <= 1) edges += 1;
  if (box.minY <= 1) edges += 1;
  if (box.maxX >= width - 2) edges += 1;
  if (box.maxY >= height - 2) edges += 1;
  return edges >= 3;
}

/**
 * Find photo windows in a Founder overlay PNG (transparent holes).
 * Ignores outer padding transparency and tiny anti-alias specks.
 */
export function detectPhotoSlotsFromAlpha(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  poseCount: number,
): LayoutRect[] | null {
  const pixelCount = width * height;
  const minArea = Math.floor(pixelCount * MIN_AREA_RATIO);
  const maxArea = Math.floor(pixelCount * MAX_AREA_RATIO);
  const visited = new Uint8Array(pixelCount);
  const boxes: Box[] = [];

  const stackX: number[] = [];
  const stackY: number[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const start = y * width + x;
      if (visited[start]) continue;
      if (data[start * 4 + 3]! >= HOLE_ALPHA) continue;

      stackX.length = 0;
      stackY.length = 0;
      stackX.push(x);
      stackY.push(y);
      visited[start] = 1;

      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;
      let area = 0;

      while (stackX.length > 0) {
        const cx = stackX.pop()!;
        const cy = stackY.pop()!;
        area += 1;
        if (cx < minX) minX = cx;
        if (cy < minY) minY = cy;
        if (cx > maxX) maxX = cx;
        if (cy > maxY) maxY = cy;

        const neighbors = [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ] as const;
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = ny * width + nx;
          if (visited[ni]) continue;
          if (data[ni * 4 + 3]! >= HOLE_ALPHA) continue;
          visited[ni] = 1;
          stackX.push(nx);
          stackY.push(ny);
        }
      }

      if (area < minArea || area > maxArea) continue;
      const box = { minX, minY, maxX, maxY, area };
      if (touchesOuterPadding(box, width, height)) continue;
      boxes.push(box);
    }
  }

  if (boxes.length < poseCount) return null;

  boxes.sort((a, b) => b.area - a.area);
  const picked = boxes.slice(0, poseCount).sort((a, b) => a.minY - b.minY);

  return picked.map((box) => ({
    x: box.minX,
    y: box.minY,
    width: Math.max(1, box.maxX - box.minX + 1),
    height: Math.max(1, box.maxY - box.minY + 1),
  }));
}

export function detectPhotoSlotsFromCanvas(
  canvas: HTMLCanvasElement,
  poseCount: number,
): LayoutRect[] | null {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  try {
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return detectPhotoSlotsFromAlpha(
      image.data,
      image.width,
      image.height,
      poseCount,
    );
  } catch {
    return null;
  }
}
