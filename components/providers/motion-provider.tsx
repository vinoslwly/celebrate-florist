"use client";

import type { ReactNode } from "react";

import { domAnimation, LazyMotion } from "framer-motion";

/**
 * Wraps the app in Framer Motion's reduced feature bundle
 * (`domAnimation`: animate/whileHover/whileInView/exit — no drag, no
 * layout animation, which we don't use). Per the Phase 02A Frontend
 * Blueprint, this is required so the client bundle only ships the
 * animation features actually used instead of the full library.
 * Sprint 01B/01C shipped `motion.*` directly, skipping this — fixed
 * during the Sprint 01C review.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
