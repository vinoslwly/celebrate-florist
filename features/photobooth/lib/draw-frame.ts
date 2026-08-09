import type { PhotoboothLayoutConfig } from "@/features/photobooth/lib/layouts";
import type { PhotoboothStripPreset } from "@/features/photobooth/lib/types";

function paintBackground(
  ctx: CanvasRenderingContext2D,
  layout: PhotoboothLayoutConfig,
  preset: PhotoboothStripPreset,
): void {
  const { width, height } = layout.canvas;
  ctx.fillStyle = preset.background;
  ctx.fillRect(0, 0, width, height);

  // Soft vertical wash — restrained stand-in until Founder art ships.
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, "rgba(255,255,255,0.35)");
  wash.addColorStop(0.55, "rgba(255,255,255,0)");
  wash.addColorStop(1, "rgba(196,91,122,0.06)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);
}

function strokeSlotFrames(
  ctx: CanvasRenderingContext2D,
  layout: PhotoboothLayoutConfig,
  preset: PhotoboothStripPreset,
  lineWidth: number,
): void {
  ctx.strokeStyle = preset.accentSoft;
  ctx.lineWidth = lineWidth;
  for (const slot of layout.slots) {
    ctx.strokeRect(slot.x - 1.5, slot.y - 1.5, slot.width + 3, slot.height + 3);
  }
}

function drawCornerPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  rotation: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(-10 * scale, 0, 12 * scale, 7 * scale, -0.35, 0, Math.PI * 2);
  ctx.ellipse(10 * scale, 0, 12 * scale, 7 * scale, 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, 4.5 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Decorative frame layer drawn in margin/gap zones only.
 * Must not cover photo slot interiors.
 * No application watermark — Celebrate branding belongs in Founder strip art.
 */
export function paintStripDecoration(
  ctx: CanvasRenderingContext2D,
  layout: PhotoboothLayoutConfig,
  preset: PhotoboothStripPreset,
): void {
  const { width, height } = layout.canvas;
  const m = layout.margins;

  ctx.strokeStyle = preset.accentSoft;
  ctx.lineWidth = 2;
  ctx.strokeRect(3, 3, width - 6, height - 6);

  switch (preset.treatment) {
    case "soft": {
      strokeSlotFrames(ctx, layout, preset, 1.5);
      ctx.fillStyle = preset.accentSoft;
      const dots = [
        [m.left / 2, m.top / 2],
        [width - m.right / 2, m.top / 2],
        [m.left / 2, height - m.bottom / 2],
        [width - m.right / 2, height - m.bottom / 2],
      ] as const;
      for (const [x, y] of dots) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "petal": {
      strokeSlotFrames(ctx, layout, preset, 1.25);
      const petalColor = `${preset.accent}55`;
      drawCornerPetal(ctx, m.left * 0.45, m.top * 0.55, 9, petalColor, -0.4);
      drawCornerPetal(
        ctx,
        width - m.right * 0.45,
        m.top * 0.55,
        9,
        petalColor,
        0.4,
      );
      drawCornerPetal(
        ctx,
        m.left * 0.45,
        height - m.bottom * 0.55,
        9,
        petalColor,
        0.9,
      );
      drawCornerPetal(
        ctx,
        width - m.right * 0.45,
        height - m.bottom * 0.55,
        9,
        petalColor,
        -0.9,
      );
      for (let i = 0; i < layout.slots.length - 1; i += 1) {
        const a = layout.slots[i]!;
        const b = layout.slots[i + 1]!;
        const gapY = (a.y + a.height + b.y) / 2;
        drawCornerPetal(ctx, m.left * 0.4, gapY, 6, petalColor, 0.2);
        drawCornerPetal(ctx, width - m.right * 0.4, gapY, 6, petalColor, -0.2);
      }
      break;
    }
    case "ribbon": {
      strokeSlotFrames(ctx, layout, preset, 1.5);
      drawBow(ctx, width / 2, m.top * 0.48, 1.05, preset.accent);
      drawBow(ctx, width / 2, height - m.bottom * 0.48, 0.9, preset.accentSoft);
      ctx.strokeStyle = preset.accentSoft;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.left * 0.35, m.top + 8);
      ctx.lineTo(m.left * 0.35, height - m.bottom - 8);
      ctx.moveTo(width - m.right * 0.35, m.top + 8);
      ctx.lineTo(width - m.right * 0.35, height - m.bottom - 8);
      ctx.stroke();
      break;
    }
    case "classic":
    default: {
      strokeSlotFrames(ctx, layout, preset, 2);
      ctx.strokeStyle = preset.accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, width - 12, height - 12);
      break;
    }
  }
}

export function paintStripBackground(
  ctx: CanvasRenderingContext2D,
  layout: PhotoboothLayoutConfig,
  preset: PhotoboothStripPreset,
): void {
  paintBackground(ctx, layout, preset);
}
