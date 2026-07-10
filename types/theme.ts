/**
 * A Celebrate Experience Theme — a reusable digital "mood" a customer can
 * choose for the Greeting Experience. Themes are content, not features;
 * this type intentionally excludes anything about scenes, animation
 * timing, or database records (that belongs to the Greeting Experience
 * feature, not yet implemented).
 */
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
  /** Tailwind color token used for the theme's accent swatch. */
  accentClassName: string;
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
