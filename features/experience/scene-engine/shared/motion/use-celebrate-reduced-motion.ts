"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** SSR + first client paint: always `false` so markup matches (no hydration mismatch). */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * SSR-safe reduced-motion preference.
 * Hydrates as `false`, then updates to the real preference after mount.
 * Prefer this over Framer's `useReducedMotion` when branching render trees.
 */
export function useCelebrateReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
