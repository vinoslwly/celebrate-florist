import Image from "next/image";

import { PlaceholderMedia } from "@/components/shared/placeholder-media";

type PhotoSlotProps = {
  /** Path under /public, e.g. "/bouquets/birthday.jpg". Leave undefined until a real photo exists. */
  src?: string;
  alt: string;
  placeholderLabel: string;
  className?: string;
  /**
   * Next/Image `sizes`, tuned to how wide this slot actually renders
   * at each breakpoint. Every call site rendered noticeably
   * differently-sized grids (a 5-column catalog vs. a half-width
   * theme preview) while sharing one hardcoded value — override this
   * per call site once real photos land instead of relying on the
   * default, which is only a reasonable guess.
   */
  sizes?: string;
};

/**
 * Renders a real optimized photo when `src` is provided, otherwise
 * falls back to the polaroid-style placeholder. This is the single
 * upgrade path for every "photo coming soon" slot on the Landing
 * Page (bouquet catalog, theme previews, hero) — swapping a
 * placeholder for a real photo only ever means adding a file under
 * `public/` and setting one config field, never touching this
 * component or the section that uses it.
 */
export function PhotoSlot({
  src,
  alt,
  placeholderLabel,
  className,
  sizes = "(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw",
}: PhotoSlotProps) {
  if (!src) {
    return <PlaceholderMedia label={placeholderLabel} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className ?? ""}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
