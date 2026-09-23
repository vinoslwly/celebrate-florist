/** Photobooth layout ids — Founder-locked (Sprint 14.1). */
export type PhotoboothLayoutId = "B" | "K";

/** Active V1 themes that may ship strip packs (Warm/Sky packs later). */
export type PhotoboothThemeId = "bloom" | "warm" | "sky";

export type CameraStatus =
  "idle" | "requesting" | "live" | "denied" | "unavailable";

export type CapturePhase =
  "ready" | "counting" | "flashing" | "capturing" | "complete";

export type CapturedPose = {
  id: string;
  /** Object URL from blob — must be revoked on reset/retake. */
  objectUrl: string;
};

export type CountdownSeconds = 3 | 5 | 10;

/** Canvas treatment family — drawn procedurally until Founder art ships. */
export type StripTreatment = "soft" | "petal" | "ribbon" | "classic";

/**
 * Visual strip/frame preset. Independent from Layout B/K geometry.
 * Branding lives in Founder strip artwork — no app watermark field.
 */
export type PhotoboothStripPreset = {
  id: string;
  themeId: PhotoboothThemeId;
  label: string;
  supportedLayouts: PhotoboothLayoutId[];
  /** Compact selector swatch color. */
  swatch: string;
  background: string;
  accent: string;
  accentSoft: string;
  treatment: StripTreatment;
  /** Optional future art path (Founder-designed strip). */
  frameSrc?: string;
};

/** Universal filter ids — shared across all themes/modes. */
export type PhotoboothFilterId =
  "original" | "soft" | "warm" | "bloom" | "cool" | "vintage" | "mono";

/**
 * One preset drives live CSS preview and Canvas composition filters.
 * Keep formulas aligned so preview ≈ final result.
 */
export type PhotoboothFilterPreset = {
  id: PhotoboothFilterId;
  label: string;
  /** Applied to live `<video>` via CSS `filter`. */
  cssFilter: string;
  /** Applied via Canvas `ctx.filter` when drawing photo slots. */
  canvasFilter: string;
  /** Selector swatch tint. */
  swatch: string;
};
