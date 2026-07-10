"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating "back to top" button. Visibility is driven by an
 * IntersectionObserver watching a sentinel placed right after the
 * Hero section — this fires only when the visibility boundary is
 * actually crossed, unlike a `scroll` event listener which fires on
 * every scroll frame. Meaningfully cheaper on low-end mobile devices.
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setVisible(!entry.isIntersecting);
    });
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      {/* Marks the end of the Hero section; button appears once this scrolls out of view. */}
      <div ref={sentinelRef} aria-hidden="true" />
      <button
        type="button"
        onClick={handleClick}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        className={`fixed right-4 bottom-4 z-30 flex size-11 items-center justify-center rounded-full bg-gradient-to-r from-pink-deep to-peach text-lg shadow-soft-pink transition-all duration-300 sm:right-6 sm:bottom-6 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <span aria-hidden="true">⬆️</span>
      </button>
    </>
  );
}
