"use client";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import {
  allowAmbientLoop,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";

const ASSETS = {
  atmosphere: "/themes/warm/moments/scene-01-atmosphere.webp",
  roseIcon: "/themes/warm/moments/scene-01-rose-icon.png",
} as const;

const TITLE = "CELEBRATE";
const TAGLINE = "every moment deserves to be celebrated";

/** Champagne ivory — Warm luxury ink on crimson. */
const INK = "#E8D4C0";
const INK_SOFT = "rgba(232, 212, 192, 0.9)";

const FALLING_PETALS = [
  { left: "10%", delay: 0, duration: 8.5, size: 14, x: 12 },
  { left: "28%", delay: 1.4, duration: 9.2, size: 11, x: -10 },
  { left: "55%", delay: 0.6, duration: 7.8, size: 15, x: 8 },
  { left: "78%", delay: 2.1, duration: 8.8, size: 12, x: -14 },
  { left: "40%", delay: 3.2, duration: 9.5, size: 10, x: 16 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#A51C28"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * Warm Moments Scene 1 — Celebrate Loading.
 * Founder background plate + Founder rose icon; brand typography is live HTML.
 */
export function WarmCelebrateLoadingScene(_props: MomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);

  return (
    <div className={`${SCENE_VIEWPORT_LOCK} bg-[#4A0A10]`}>
      {/* Founder atmosphere — full-bleed visual plane (no baked title) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASSETS.atmosphere}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Soft readability wash behind brand (does not hide corners) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 36% at 50% 46%, rgba(55,8,12,0.18) 0%, transparent 72%)",
        }}
      />

      {/* Living light shimmer over the plate */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 14% 10%, rgba(255,220,190,0.16) 0%, transparent 55%)",
        }}
        animate={ambient ? { opacity: [0.4, 0.85, 0.45] } : { opacity: 0.7 }}
        transition={
          ambient
            ? { duration: 8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />

      {/* Extra falling petals — light motion only */}
      {ambient ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALLING_PETALS.map((petal, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: petal.left,
                top: "-6%",
                width: petal.size,
                height: petal.size * 1.35,
              }}
              animate={{
                opacity: [0, 0.65, 0.65, 0],
                y: ["0vh", "105vh"],
                x: [0, petal.x],
                rotate: [0, 40, -15],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Brand — live HTML + Founder rose icon */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="flex flex-col items-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={
              ambient ? { y: [0, -4, 0], rotate: [0, 1.5, -1.5, 0] } : undefined
            }
            transition={
              ambient
                ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.roseIcon}
              alt=""
              className="h-[4.5rem] w-auto drop-shadow-[0_2px_8px_rgba(40,0,0,0.35)] sm:h-24"
              width={140}
              height={180}
            />
          </motion.div>

          <h1
            className="mt-4 font-serif text-[2rem] font-semibold tracking-[0.3em] uppercase sm:mt-5 sm:text-5xl sm:tracking-[0.34em]"
            style={{ color: INK }}
            aria-label="celebrate"
          >
            {TITLE.split("").map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                className="inline-block"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={
                  ambient ? { opacity: 1, y: [0, -2.5, 0] } : { opacity: 1 }
                }
                transition={{
                  opacity: { duration: 0.4, delay: 0.18 + i * 0.05 },
                  y: ambient
                    ? {
                        duration: 3.4,
                        delay: 0.85 + i * 0.07,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0 },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="mt-5 flex items-center gap-3"
            style={{ color: INK }}
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.55 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.55 }}
          >
            <span
              className="h-px w-10 sm:w-14"
              style={{
                background: "linear-gradient(90deg, transparent, currentColor)",
              }}
              aria-hidden
            />
            <span
              className="text-[10px] tracking-[0.35em] opacity-80"
              aria-hidden
            >
              ❦
            </span>
            <span
              className="h-px w-10 sm:w-14"
              style={{
                background: "linear-gradient(90deg, currentColor, transparent)",
              }}
              aria-hidden
            />
          </motion.div>

          <motion.p
            className="mt-5 max-w-sm font-serif text-sm tracking-[0.06em] sm:text-base sm:tracking-[0.08em]"
            style={{ color: INK_SOFT }}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={
              reduceMotion
                ? { opacity: 0.92 }
                : { opacity: [0.75, 1, 0.75], y: [0, -3, 0] }
            }
            transition={{
              opacity: {
                duration: 4.8,
                delay: 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 4.8,
                delay: 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {TAGLINE}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
