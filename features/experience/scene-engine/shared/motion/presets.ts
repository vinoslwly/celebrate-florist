import { MOTION_DURATION, MOTION_EASE, MOTION_STAGGER } from "./tokens";

import type { TargetAndTransition, Transition, Variants } from "framer-motion";

type MotionTarget = TargetAndTransition;

/**
 * Light fade + optional blur clear — supporting reveal tool (letter / gallery).
 * Skip blur entirely when reduced motion.
 */
export function getBlurReveal(
  reduceMotion: boolean,
  options?: { y?: number; delay?: number },
): {
  initial: false | MotionTarget;
  animate: MotionTarget;
  transition: Transition;
} {
  const delay = options?.delay ?? 0;
  if (reduceMotion) {
    return {
      initial: false,
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: { duration: MOTION_DURATION.instant },
    };
  }
  return {
    initial: {
      opacity: 0,
      y: options?.y ?? 12,
      filter: "blur(6px)",
    },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASE.out,
      delay,
    },
  };
}

/** Gentle scale settle — supporting zoom only (not a camera system). */
export function getGentleZoom(
  reduceMotion: boolean,
  options?: { delay?: number },
): {
  initial: false | MotionTarget;
  animate: MotionTarget;
  transition: Transition;
} {
  if (reduceMotion) {
    return {
      initial: false,
      animate: { opacity: 1, scale: 1 },
      transition: { duration: MOTION_DURATION.instant },
    };
  }
  return {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASE.out,
      delay: options?.delay ?? 0,
    },
  };
}

/** Parent stagger container for letter lines / gallery cards. */
export function getStaggerContainer(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      hidden: {},
      show: {
        transition: { staggerChildren: 0, delayChildren: 0 },
      },
    };
  }
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: MOTION_STAGGER.base,
        delayChildren: MOTION_STAGGER.tight,
      },
    },
  };
}

export function getStaggerItem(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 1, y: 0 },
      show: { opacity: 1, y: 0 },
    };
  }
  return {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION_DURATION.base, ease: MOTION_EASE.out },
    },
  };
}

/**
 * Ambient / decorative infinite loops — never on primary CTAs.
 * Under reduced motion, always return false (caller must disable animation).
 */
export function allowAmbientLoop(reduceMotion: boolean): boolean {
  return !reduceMotion;
}

/**
 * Primary CTAs must not use infinite motion.
 * Always false — kept as an explicit API so call sites document intent.
 */
export function allowPrimaryCtaInfiniteMotion(): false {
  return false;
}
