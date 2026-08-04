/**
 * Celebrate Motion Kit — minimal shared timing/easing (Sprint 13 P0).
 * Not a choreography DSL. Theme personality stays in scene components.
 */

/** Duration categories in seconds (Framer Motion). */
export const MOTION_DURATION = {
  instant: 0,
  fast: 0.2,
  base: 0.35,
  /** Default host scene enter/exit cross-fade. */
  scene: 0.45,
  /** Envelope / letter / gallery ceremonial beats. */
  ceremony: 0.85,
} as const;

export type MotionDurationKey = keyof typeof MOTION_DURATION;

/** Shared easing curves — prefer these over per-file copies. */
export const MOTION_EASE = {
  out: [0.22, 1, 0.36, 1] as const,
  soft: [0.25, 0.1, 0.25, 1] as const,
  pop: [0.16, 1.2, 0.3, 1] as const,
} as const;

export type MotionEaseKey = keyof typeof MOTION_EASE;

/** Small stagger delays for letter lines / gallery cards. */
export const MOTION_STAGGER = {
  tight: 0.06,
  base: 0.1,
  loose: 0.14,
} as const;
