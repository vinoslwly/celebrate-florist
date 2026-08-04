import { MOTION_DURATION, MOTION_EASE } from "./tokens";

import type { TargetAndTransition, Transition } from "framer-motion";

export type HostSceneFade = {
  /** Prefer `wait` so enter/exit do not overlap into a blank stack. */
  presenceMode: "wait";
  initial: false | TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
};

/**
 * Canonical host scene cross-fade.
 * Reduced motion → near-instant opacity (no lingering fade / dead click window).
 */
export function getHostSceneFade(reduceMotion: boolean): HostSceneFade {
  const duration = reduceMotion
    ? MOTION_DURATION.instant
    : MOTION_DURATION.scene;

  return {
    presenceMode: "wait",
    initial: reduceMotion ? false : { opacity: 0 },
    animate: { opacity: 1 },
    exit: reduceMotion ? { opacity: 1 } : { opacity: 0 },
    transition: {
      duration,
      ease: MOTION_EASE.out,
    },
  };
}
