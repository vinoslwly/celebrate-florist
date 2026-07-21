"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const FALLING_PETALS = [
  { left: "8%", delay: 0.2, duration: 9.2, size: 14, x: 18 },
  { left: "24%", delay: 1.4, duration: 10, size: 11, x: -12 },
  { left: "48%", delay: 0.6, duration: 8.6, size: 15, x: 10 },
  { left: "70%", delay: 1.9, duration: 9.4, size: 12, x: -14 },
  { left: "86%", delay: 1.1, duration: 8.8, size: 13, x: 8 },
] as const;

const HEART_SPARKS = [
  { x: -52, y: -36, delay: 0.55, size: 14 },
  { x: 58, y: -28, delay: 0.62, size: 12 },
  { x: -40, y: 42, delay: 0.7, size: 11 },
  { x: 46, y: 48, delay: 0.76, size: 13 },
  { x: 0, y: -58, delay: 0.5, size: 12 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.92"
      />
    </svg>
  );
}

function SoftSakura({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="18"
          rx="9"
          ry="14"
          fill="#F7A8BE"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5.5" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.2" fill="#F48CA8" />
    </svg>
  );
}

/**
 * memories.match-intro — tender gate before match gameplay.
 * Soft scrapbook wash, gift motif, Start → next scene.
 */
export function MemoriesMatchIntroScene({ onComplete }: MemoriesSceneProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-full w-full flex-1 overflow-hidden bg-[#F8E4E7]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 95% at 50% 38%, #FFFCFB 0%, #FFF4F6 32%, #F8E0E7 62%, #F0CDD8 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          mixBlendMode: "multiply",
        }}
      />

      {/* Torn paper corners */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1 -right-2 h-24 w-32 rotate-6 sm:h-32 sm:w-40"
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 0.95, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div
          className="h-full w-full bg-[#FFF8F2] shadow-md"
          style={{
            clipPath:
              "polygon(8% 0%, 45% 6%, 78% 0%, 100% 22%, 94% 100%, 40% 92%, 0% 100%, 4% 35%)",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-2 -left-3 h-28 w-36 -rotate-8 sm:h-36 sm:w-44"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 0.95, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
      >
        <div
          className="h-full w-full bg-[#FFF6F0] shadow-md"
          style={{
            clipPath:
              "polygon(0% 12%, 28% 0%, 70% 8%, 100% 0%, 96% 78%, 60% 100%, 20% 90%, 0% 100%)",
          }}
        />
      </motion.div>

      {/* Ambient petals */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALLING_PETALS.map((p, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: p.left,
                top: "-6%",
                width: p.size,
                height: p.size * 1.35,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.85, 0.85, 0],
                y: ["0vh", "110vh"],
                x: [0, p.x, p.x * -0.35],
                rotate: [0, 35, -20, 50],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-16 left-5 h-16 w-16 opacity-80 sm:top-20 sm:left-10 sm:h-20 sm:w-20"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
      >
        <SoftSakura className="h-full w-full drop-shadow-sm" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-6 bottom-28 h-14 w-14 opacity-75 sm:right-12 sm:bottom-32 sm:h-[4.5rem] sm:w-[4.5rem]"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.5, ease: EASE_OUT }}
      >
        <SoftSakura className="h-full w-full drop-shadow-sm" />
      </motion.div>

      <div className="relative z-10 flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8">
        <motion.div
          className="flex w-full max-w-md flex-col items-center text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
        >
          <motion.h1
            className="font-serif text-[1.65rem] leading-snug font-semibold tracking-tight text-[#6B2A38] sm:text-3xl md:text-[2.05rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.12,
              duration: 0.5,
              ease: EASE_OUT,
            }}
          >
            Some memories are waiting
            <br className="hidden sm:block" /> to be found.
          </motion.h1>

          <motion.div
            className="mt-5 mb-2 flex items-center gap-3 text-[#E8799A]"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.28, duration: 0.4 }}
          >
            <span className="h-px w-14 bg-current sm:w-20" />
            <span className="text-sm">♡</span>
            <span className="h-px w-14 bg-current sm:w-20" />
          </motion.div>

          {/* Gift focal — soft float + heart sparks */}
          <div className="relative mt-2 mb-1 flex items-center justify-center py-4">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute h-56 w-56 rounded-full sm:h-64 sm:w-64"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(247,168,190,0.4) 40%, transparent 70%)",
              }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: EASE_OUT }}
            />

            {!reduceMotion
              ? HEART_SPARKS.map((h, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute text-[#E8799A]"
                    style={{ fontSize: h.size }}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                    animate={{
                      opacity: [0, 1, 0.7],
                      x: h.x,
                      y: h.y,
                      scale: [0.4, 1.15, 1],
                    }}
                    transition={{
                      delay: h.delay,
                      duration: 0.85,
                      ease: EASE_OUT,
                    }}
                  >
                    ♡
                  </motion.span>
                ))
              : null}

            <motion.div
              className="relative z-10 w-[9.5rem] sm:w-[11rem]"
              initial={
                reduceMotion ? false : { opacity: 0, y: 24, scale: 0.88 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1, y: 0, scale: 1 }
                  : {
                      opacity: 1,
                      y: [0, -6, 0],
                      scale: 1,
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { delay: 0.22, duration: 0.45 },
                      scale: { delay: 0.22, duration: 0.45 },
                      y: {
                        delay: 0.7,
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
              }
            >
              <BloomGiftBox variant="closed" className="w-full" />
            </motion.div>
          </div>

          <motion.p
            className="mt-3 max-w-xs font-serif text-[0.95rem] leading-relaxed text-[#8A5A68] sm:text-base"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.48,
              duration: 0.45,
              ease: EASE_OUT,
            }}
          >
            Match every memory to{" "}
            <span className="font-semibold text-[#C45B7A]">
              unlock your surprise
            </span>
            .
          </motion.p>

          <motion.button
            type="button"
            onClick={onComplete}
            className="mt-8 inline-flex min-h-12 min-w-[12.5rem] items-center justify-center gap-2 rounded-full px-8 font-serif text-lg font-semibold text-white shadow-[0_12px_28px_-10px_rgba(180,70,100,0.55)] transition-[transform,box-shadow] hover:scale-[1.02] active:scale-[0.98] sm:min-w-[14rem]"
            style={{
              background:
                "linear-gradient(105deg, #E8799A 0%, #D46888 48%, #C45B7A 100%)",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.62,
              duration: 0.45,
              ease: EASE_OUT,
            }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            Start
            <span aria-hidden className="text-base font-normal">
              →
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
