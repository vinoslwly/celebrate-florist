"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

const ASSETS = {
  atmosphere: "/themes/sky/moments/scene-01-atmosphere.webp",
} as const;

const TITLE = "CELEBRATE";
const TAGLINE = "every moment deserves to be celebrated";

/** Sky navy ink on paper. */
const INK = "#1E3A5F";
const INK_SOFT = "rgba(30, 58, 95, 0.88)";
const ACCENT = "#6BA3C9";

/** Stylized hydrangea / fleur plant mark — Sky Moments Scene 1. */
function SkyPlantMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <path
        d="M32 54c0-10 1.5-18 4.5-24.5C40 22 44 18 48 16c-6 2-11 7-13.5 14.5C32 24 28 18 22 16c4 2 8 6 11.5 13.5C30.5 36 32 44 32 54Z"
        fill="#1E3A5F"
      />
      <circle cx="32" cy="18" r="5.5" fill="#1E3A5F" />
      <circle cx="22" cy="24" r="4.2" fill="#2A4A6E" />
      <circle cx="42" cy="24" r="4.2" fill="#2A4A6E" />
      <circle cx="26" cy="14" r="3.4" fill="#2A4A6E" />
      <circle cx="38" cy="14" r="3.4" fill="#2A4A6E" />
      <circle cx="32" cy="10" r="3" fill="#3A5F88" />
      <circle cx="32" cy="18" r="2" fill="#E8F2FA" opacity="0.85" />
    </svg>
  );
}

function SoftSkyPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#7EB6D9"
        opacity="0.85"
      />
      <path
        d="M12 6c-1.5 4-3 8-2.2 13"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function SparkleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill="#6BA3C9">
      <path d="M8 0.5 9.2 6.8 15.5 8 9.2 9.2 8 15.5 6.8 9.2 0.5 8 6.8 6.8Z" />
    </svg>
  );
}

const FALLING_PETALS = [
  { left: "12%", delay: 0, duration: 7.5, size: 18, x: 18 },
  { left: "28%", delay: 1.1, duration: 8.2, size: 14, x: -12 },
  { left: "45%", delay: 0.4, duration: 6.8, size: 20, x: 10 },
  { left: "62%", delay: 1.8, duration: 7.9, size: 16, x: -18 },
  { left: "78%", delay: 0.9, duration: 8.5, size: 15, x: 14 },
  { left: "88%", delay: 2.2, duration: 7.1, size: 12, x: -8 },
  { left: "35%", delay: 2.8, duration: 9, size: 13, x: 22 },
  { left: "70%", delay: 3.4, duration: 7.6, size: 17, x: -14 },
] as const;

/**
 * sky.moments.celebrate-loading — living recreation of Founder Scene 1.
 * Full collage on all sides + soft white diamond plate for live brand.
 */
export function SkyCelebrateLoadingScene(_props: SkyMomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={`${SCENE_VIEWPORT_LOCK} isolate overflow-hidden bg-[#EEF4FA]`}
    >
      {/* Full Founder collage — cover fills mobile (no empty sky band on top) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ASSETS.atmosphere}?v=12`}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full scale-[1.06] object-cover object-center"
        draggable={false}
      />

      {/* Soft living diamond plate — brand well feathered into collage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          className="relative"
          style={{
            width: "min(72vw, 20rem)",
            height: "min(72vw, 20rem)",
          }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wide feather halo — collage peeks through; no hard crop feel */}
          <div
            className="absolute inset-[-28%]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(249,247,243,0.82) 0%, rgba(249,247,243,0.45) 32%, rgba(201,221,240,0.16) 52%, transparent 70%)",
            }}
          />
          {/* Diamond body — soft corners, slightly translucent at rim */}
          <div
            className="absolute inset-[18%] rotate-45 rounded-[28%]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(249,247,243,0.9) 55%, rgba(238,244,250,0.78) 100%)",
              boxShadow: "0 0 42px rgba(249,247,243,0.55)",
            }}
          />
          {/* Extra soft edge veil */}
          <div
            className="absolute inset-[-2%] rotate-45 rounded-[32%] opacity-90"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 34%, rgba(249,247,243,0.55) 62%, transparent 78%)",
              filter: "blur(14px)",
            }}
          />
        </motion.div>
      </div>

      {/* Living light shimmer */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 12% 8%, rgba(255,255,255,0.18) 0%, transparent 55%)",
        }}
        animate={
          reduceMotion ? { opacity: 0.35 } : { opacity: [0.18, 0.42, 0.22] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Falling soft sky petals */}
      {!reduceMotion ? (
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
                top: "-8%",
                width: petal.size,
                height: petal.size * 1.35,
              }}
              animate={{
                opacity: [0, 0.75, 0.75, 0],
                y: ["0vh", "110vh"],
                x: [0, petal.x, petal.x * -0.4, petal.x],
                rotate: [0, 40, -25, 60],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftSkyPetal className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Brand center — real HTML only */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="flex flex-col items-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : { y: [0, -5, 0], rotate: [0, 3, -2.5, 0] }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <SkyPlantMark className="h-12 w-12 sm:h-14 sm:w-14" />
          </motion.div>

          <h1
            className="mt-5 font-serif text-[2rem] font-semibold tracking-[0.28em] uppercase sm:text-5xl sm:tracking-[0.32em]"
            style={{ color: INK }}
            aria-label="celebrate"
          >
            {TITLE.split("").map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                className="inline-block"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.18 + i * 0.045,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="mt-5 flex items-center gap-2.5"
            style={{ color: ACCENT }}
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
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
            <SparkleMark className="h-2 w-2 shrink-0" />
            <SparkleMark className="h-3 w-3 shrink-0 opacity-90" />
            <SparkleMark className="h-2 w-2 shrink-0" />
            <span
              className="h-px w-10 sm:w-14"
              style={{
                background: "linear-gradient(90deg, currentColor, transparent)",
              }}
              aria-hidden
            />
          </motion.div>

          <motion.p
            className="mt-5 max-w-sm font-serif text-sm tracking-[0.06em] italic sm:text-base sm:tracking-[0.08em]"
            style={{ color: INK_SOFT }}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={
              reduceMotion
                ? { opacity: 0.92 }
                : { opacity: [0.78, 1, 0.78], y: [0, -3, 0] }
            }
            transition={{
              opacity: {
                duration: 4.5,
                delay: 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 4.5,
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
