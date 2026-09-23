"use client";

import { useEffect, useRef, useState } from "react";

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
      <div ref={sentinelRef} aria-hidden="true" />
      <button
        type="button"
        onClick={handleClick}
        aria-label="Kembali ke atas"
        hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className="back-top"
      >
        ↑
      </button>
    </>
  );
}
