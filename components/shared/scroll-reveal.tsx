"use client";

import type { ReactNode } from "react";

import { m, useReducedMotion } from "framer-motion";

type ScrollRevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds, for revealing multiple items in sequence. */
  delay?: number;
  className?: string;
};

/**
 * Thin client-only wrapper that fades/slides its children in once they
 * enter the viewport. Kept deliberately small so the Server Components
 * it wraps stay Server Components — only this wrapper pays the "use
 * client" cost.
 *
 * Respects prefers-reduced-motion by skipping the animation entirely.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
