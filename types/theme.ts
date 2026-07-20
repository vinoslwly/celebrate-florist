/**
 * A Celebrate Experience Theme — a reusable digital "mood" a customer can
 * choose for the Greeting Experience. Themes are content, not features;
 * this type intentionally excludes anything about scenes, animation
 * timing, or database records (that belongs to the Greeting Experience
 * feature, not yet implemented).
 */

/** Optional Production Pending asset paths — safe to leave empty. */
export type ThemeAssetSlots = {
  headerMotif?: string;
  giftMotif?: string;
  atmosphereAsset?: string;
  cornerDecoration?: string;
  completionArtwork?: string;
  photoTreatment?: string;
};

/**
 * Presentation tokens for Recipient, Preview, and Studio swatches.
 * All fields receive safe defaults in resolve-theme when omitted.
 */
export type ThemePresentation = {
  /** Tailwind bg class — swatches, bars, dots, halo base */
  accent: string;
  /** Tailwind text class — theme-harmonious ink for accented UI */
  accentText: string;
  /** Recipient page atmosphere (gradient or tint classes) */
  pageAtmosphereRecipient: string;
  /** Calmer preview atmosphere */
  pageAtmospherePreview: string;
  /** Optional recipient surface wash */
  surfaceTintRecipient?: string;
  /** Optional preview surface wash */
  surfaceTintPreview?: string;
  /** Optional restrained border family */
  borderTint?: string;
  /** Halo opacity utility, e.g. opacity-20 */
  haloOpacity?: string;
  /** Production Pending decorative slots */
  assets?: ThemeAssetSlots;
  /** Motif opacity hint — consumed by theme atmosphere helpers (`themeDecorativeOpacity`). */
  decorativeIntensity?: "low" | "medium";
};

export type Theme = {
  id: string;
  /** Display name shown to customers, e.g. "Warm". */
  name: string;
  /** A single emoji representing the theme's personality, for quick visual scanning. */
  emoji: string;
  /** The core emotion this theme represents, e.g. "Close Friendship". */
  feeling: string;
  /** The signature flower associated with this theme, per Design Bible. */
  flower: string;
  /**
   * Tailwind bg class for accent swatches.
   * Mirrors `presentation.accent` after resolution — kept for existing consumers.
   */
  accentClassName: string;
  presentation: ThemePresentation;
  /**
   * Path under /public for a real greeting-page preview screenshot,
   * e.g. "/themes/bloom-greeting.jpg". Leave undefined until one
   * exists — the Landing Page falls back to a placeholder slot.
   */
  greetingPreviewImage?: string;
  /**
   * Path under /public for a real photobooth strip example,
   * e.g. "/themes/bloom-photobooth.jpg". Leave undefined until one
   * exists — the Landing Page falls back to a placeholder slot.
   */
  photoboothPreviewImage?: string;
};
