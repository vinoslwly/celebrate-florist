"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const ORBIT = [
  { angle: -40, dist: 78, delay: 0.2, size: 14, kind: "petal" as const },
  { angle: 35, dist: 86, delay: 0.28, size: 16, kind: "heart" as const },
  { angle: 120, dist: 80, delay: 0.36, size: 13, kind: "petal" as const },
  { angle: -130, dist: 88, delay: 0.24, size: 15, kind: "heart" as const },
  { angle: 200, dist: 74, delay: 0.42, size: 12, kind: "petal" as const },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.9"
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

function orbitOffset(angleDeg: number, dist: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist };
}

/**
 * connection.score-calculation — living Founder Scene 7.
 * Soft anticipation beat while submit settles (~2s in Theme Lab).
 * Warm romance — not an admin “calculating” screen.
 */
export function ConnectionScoreCalculationScene(_props: ConnectionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] bg-[#F8E4E7]"
      role="status"
      aria-live="polite"
      aria-label="Almost there"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 40%, #FFF9F7 0%, #FCF0F2 32%, #F7E0E6 62%, #F1D0D8 85%, #EBC4CE 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 100%, rgba(244,168,190,0.38) 0%, transparent 70%)",
        }}
      />

      {/* Soft bloom behind gift */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[42%] left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[58vmin] sm:w-[58vmin]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,230,200,0.45) 35%, rgba(247,168,190,0.25) 55%, transparent 72%)",
        }}
        initial={
          reduceMotion ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0.5 }
        }
        animate={
          reduceMotion
            ? { opacity: 0.6, scale: 1 }
            : { opacity: [0, 0.95, 0.55], scale: [0.5, 1.05, 1.15] }
        }
        transition={{ duration: 1.4, ease: EASE_OUT }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-5 right-4 sm:top-8 sm:right-10"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: EASE_OUT }}
      >
        <SoftSakura className="h-11 w-11 sm:h-14 sm:w-14" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-4 sm:bottom-12 sm:left-8"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
      >
        <SoftSakura className="h-10 w-10" />
      </motion.div>

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-6 py-12">
        <div className="relative flex flex-col items-center">
          {/* Gift + orbit */}
          <div className="relative mb-1 flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60">
            {/* Warm crack glow */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-[46%] left-1/2 h-44 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-52 sm:w-60"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,250,220,0.95) 0%, rgba(255,220,160,0.5) 38%, transparent 70%)",
              }}
              animate={
                reduceMotion
                  ? { opacity: 0.75, scale: 1 }
                  : { opacity: [0.55, 1, 0.7], scale: [0.94, 1.08, 1] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 1.6,
                      ease: EASE_OUT,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }
              }
            />

            {!reduceMotion
              ? ORBIT.map((o, i) => {
                  const { x, y } = orbitOffset(o.angle, o.dist);
                  return (
                    <motion.div
                      key={i}
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-1/2 flex items-center justify-center"
                      style={{
                        width: o.size,
                        height: o.kind === "petal" ? o.size * 1.35 : o.size,
                        marginLeft: -o.size / 2,
                        marginTop:
                          -(o.kind === "petal" ? o.size * 1.35 : o.size) / 2,
                      }}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                      animate={{
                        opacity: [0, 1, 0.85],
                        x: [0, x * 0.85, x],
                        y: [0, y * 0.85, y],
                        scale: [0.4, 1.1, 1],
                        rotate: [0, o.angle > 0 ? 18 : -18],
                      }}
                      transition={{
                        duration: 1.1,
                        delay: o.delay,
                        ease: EASE_OUT,
                      }}
                    >
                      {o.kind === "petal" ? (
                        <SoftPetal className="h-full w-full" />
                      ) : (
                        <span
                          className="text-[#E8799A]"
                          style={{ fontSize: o.size }}
                        >
                          ♡
                        </span>
                      )}
                    </motion.div>
                  );
                })
              : null}

            <motion.div
              className="relative z-10"
              initial={
                reduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.82, y: 18 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: [18, 0, -4, 0],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.4, ease: EASE_OUT },
                      scale: {
                        delay: 0.08,
                        type: "spring",
                        stiffness: 220,
                        damping: 16,
                      },
                      y: { duration: 1.8, ease: EASE_OUT },
                    }
              }
            >
              <BloomGiftBox
                variant="ajar"
                className="h-44 w-44 drop-shadow-[0_18px_32px_rgba(180,70,100,0.28)] sm:h-52 sm:w-52"
              />
            </motion.div>
          </div>

          <motion.span
            className="mt-2 font-serif text-2xl text-[#E8799A] sm:text-3xl"
            aria-hidden
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.6 }
            }
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [0.6, 1.18, 1] }
            }
            transition={{ delay: 0.35, duration: 0.55, ease: EASE_OUT }}
          >
            ♡
          </motion.span>

          <motion.h1
            className="mt-3 text-center font-serif text-[1.85rem] font-semibold tracking-tight text-[#6B2A38] sm:text-[2.35rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.45,
              duration: 0.5,
              ease: EASE_OUT,
            }}
          >
            Almost there…
          </motion.h1>

          <motion.div
            className="mt-4 mb-3 flex items-center justify-center gap-3 text-[#E8799A]/75"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.6,
              duration: 0.4,
              ease: EASE_OUT,
            }}
          >
            <span className="h-px w-12 bg-current sm:w-16" />
            <span className="text-sm">✿</span>
            <span className="h-px w-12 bg-current sm:w-16" />
          </motion.div>

          <motion.p
            className="max-w-[16rem] text-center font-serif text-base leading-relaxed text-[#D07090] sm:max-w-xs sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.7,
              duration: 0.45,
              ease: EASE_OUT,
            }}
          >
            Something sweet is gathering for you…
          </motion.p>

          {/* Soft heart pulse — not admin dots */}
          <motion.div
            className="mt-8 flex items-center gap-3"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.9, duration: 0.35 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-block text-[#E8799A]"
                animate={
                  reduceMotion
                    ? { opacity: 0.7, scale: 1 }
                    : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 1.1,
                        delay: i * 0.18,
                        repeat: Infinity,
                        ease: EASE_OUT,
                      }
                }
              >
                ♥
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
