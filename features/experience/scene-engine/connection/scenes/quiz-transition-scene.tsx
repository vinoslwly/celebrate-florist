"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** One-shot burst — fills space without scrapbook clutter. */
const BURST = [
  {
    x: -110,
    y: -70,
    rotate: -24,
    delay: 0.12,
    size: 22,
    kind: "petal" as const,
  },
  { x: 118, y: -78, rotate: 28, delay: 0.16, size: 20, kind: "petal" as const },
  { x: -130, y: 20, rotate: -12, delay: 0.2, size: 18, kind: "heart" as const },
  { x: 135, y: 28, rotate: 16, delay: 0.22, size: 18, kind: "heart" as const },
  { x: -70, y: 95, rotate: -20, delay: 0.26, size: 16, kind: "petal" as const },
  { x: 78, y: 100, rotate: 22, delay: 0.28, size: 17, kind: "petal" as const },
  { x: 0, y: -120, rotate: 6, delay: 0.14, size: 20, kind: "heart" as const },
  {
    x: -160,
    y: -30,
    rotate: -30,
    delay: 0.24,
    size: 14,
    kind: "petal" as const,
  },
  { x: 165, y: -20, rotate: 32, delay: 0.25, size: 14, kind: "petal" as const },
] as const;

const CORNER_SAKURA = [
  {
    className:
      "absolute -top-3 -right-2 h-28 w-28 sm:top-1 sm:right-3 sm:h-36 sm:w-36",
    delay: 0.2,
    opacity: 0.92,
  },
  {
    className:
      "absolute top-16 right-14 h-14 w-14 sm:top-24 sm:right-28 sm:h-[4.5rem] sm:w-[4.5rem]",
    delay: 0.32,
    opacity: 0.7,
  },
  {
    className:
      "absolute -bottom-4 -left-3 h-32 w-32 sm:bottom-1 sm:left-2 sm:h-40 sm:w-40",
    delay: 0.22,
    opacity: 0.9,
  },
  {
    className:
      "absolute bottom-20 left-16 h-12 w-12 sm:bottom-28 sm:left-28 sm:h-16 sm:w-16",
    delay: 0.38,
    opacity: 0.65,
  },
  {
    className:
      "absolute top-20 left-3 h-16 w-16 sm:top-28 sm:left-8 sm:h-20 sm:w-20",
    delay: 0.28,
    opacity: 0.75,
  },
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
 * connection.quiz-transition — big romantic “Quiz Time!” celebration beat.
 * Auto-advance (~2s); no controls / CTA chrome — energy via scale + burst only.
 */
export function ConnectionQuizTransitionScene(_props: ConnectionSceneProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative flex min-h-full w-full flex-1 overflow-hidden bg-[#F8E4E7]"
      role="status"
      aria-live="polite"
      aria-label="Quiz time"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 42%, #FFFFFF 0%, #FFF5F7 28%, #FCE8EE 55%, #F5D0DC 82%, #EBC4CE 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 100%, rgba(244,168,190,0.42) 0%, transparent 72%)",
        }}
      />

      {/* Expanding celebration rings */}
      {!reduceMotion
        ? [0, 1].map((i) => (
            <motion.div
              key={`ring-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-[#F2A7B5]/55"
              style={{
                width: "18vmin",
                height: "18vmin",
                marginLeft: "-9vmin",
                marginTop: "-9vmin",
              }}
              initial={{ opacity: 0.7, scale: 0.4 }}
              animate={{ opacity: 0, scale: 4.2 + i * 0.55 }}
              transition={{
                duration: 1.55,
                delay: 0.08 + i * 0.18,
                ease: EASE_OUT,
              }}
            />
          ))
        : null}

      {/* Big soft bloom behind hero */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[95vmin] w-[95vmin] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[80vmin] sm:w-[80vmin]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,210,225,0.55) 32%, rgba(247,168,190,0.28) 55%, transparent 72%)",
        }}
        initial={
          reduceMotion
            ? { opacity: 0.7, scale: 1 }
            : { opacity: 0, scale: 0.35 }
        }
        animate={
          reduceMotion
            ? { opacity: 0.7, scale: 1 }
            : { opacity: [0, 1, 0.65], scale: [0.35, 1.05, 1.18] }
        }
        transition={{ duration: 1.2, ease: EASE_OUT }}
      />

      {/* Soft petal starburst frame — fills mid-field */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 w-[min(96vw,34rem)] -translate-x-1/2 -translate-y-1/2 aspect-square sm:w-[min(90vw,38rem)]"
        initial={
          reduceMotion
            ? { opacity: 0.55, scale: 1 }
            : { opacity: 0, scale: 0.55 }
        }
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.05, ease: EASE_OUT }}
      >
        <div
          className="absolute inset-0 bg-[#F9C4D0]/45"
          style={{
            clipPath:
              "polygon(50% 0%, 63% 12%, 82% 8%, 78% 28%, 100% 35%, 85% 50%, 98% 68%, 75% 70%, 72% 92%, 50% 80%, 28% 92%, 25% 70%, 2% 68%, 15% 50%, 0% 35%, 22% 28%, 18% 8%, 37% 12%)",
          }}
        />
        <div
          className="absolute inset-[7%] bg-[#FFF5F7]/92"
          style={{
            clipPath:
              "polygon(50% 2%, 62% 14%, 80% 10%, 76% 30%, 98% 38%, 84% 52%, 96% 70%, 74% 72%, 70% 94%, 50% 82%, 30% 94%, 26% 72%, 4% 70%, 16% 52%, 2% 38%, 24% 30%, 20% 10%, 38% 14%)",
            boxShadow: "0 28px 60px -22px rgba(160,70,100,0.35)",
          }}
        />
      </motion.div>

      {/* Corner sakura — visual weight so frame isn’t empty */}
      {CORNER_SAKURA.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none ${s.className}`}
          style={{ opacity: s.opacity }}
          initial={
            reduceMotion ? false : { opacity: 0, scale: 0.55, rotate: -10 }
          }
          animate={{ opacity: s.opacity, scale: 1, rotate: 0 }}
          transition={{
            delay: reduceMotion ? 0 : s.delay,
            type: "spring",
            stiffness: 220,
            damping: 16,
          }}
        >
          <SoftSakura className="h-full w-full drop-shadow-md" />
        </motion.div>
      ))}

      {/* Burst petals + hearts from center */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-20"
        >
          {BURST.map((b, i) => (
            <motion.div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                width: b.size,
                height: b.size * (b.kind === "petal" ? 1.35 : 1),
                marginLeft: -b.size / 2,
                marginTop: -(b.size * (b.kind === "petal" ? 1.35 : 1)) / 2,
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              animate={{
                opacity: [0, 1, 0.75],
                x: b.x,
                y: b.y,
                scale: [0.3, 1.15, 1],
                rotate: b.rotate,
              }}
              transition={{
                duration: 0.95,
                delay: b.delay,
                ease: EASE_OUT,
              }}
            >
              {b.kind === "petal" ? (
                <SoftPetal className="h-full w-full" />
              ) : (
                <span className="text-[#E8799A]" style={{ fontSize: b.size }}>
                  ♡
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Hero — dominant, fills the burst frame */}
      <div className="relative z-10 flex min-h-full flex-1 flex-col items-center justify-center px-3 pb-6 sm:px-6">
        <div className="relative flex w-full max-w-xl flex-col items-center sm:max-w-2xl">
          <motion.span
            className="mb-2 font-serif text-5xl text-[#E8799A] sm:mb-3 sm:text-6xl md:text-7xl"
            aria-hidden
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.4 }
            }
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [0.4, 1.22, 1] }
            }
            transition={{
              delay: 0.08,
              duration: 0.65,
              ease: EASE_OUT,
            }}
          >
            ♡
          </motion.span>

          <motion.h1
            className="text-center font-serif text-[3.4rem] leading-[0.92] font-semibold tracking-tight text-[#6B2A38] sm:text-7xl md:text-8xl"
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.72, y: 28 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 0.22,
                    type: "spring",
                    stiffness: 240,
                    damping: 15,
                  }
            }
          >
            Quiz
            <br />
            Time!
          </motion.h1>

          <motion.p
            className="mt-5 text-center font-serif text-base tracking-wide text-[#D07090] sm:mt-6 sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.55,
              duration: 0.45,
              ease: EASE_OUT,
            }}
          >
            Let the fun begin
          </motion.p>

          {/* Soft underline flourish — not a button */}
          <motion.div
            className="mt-4 flex items-center gap-3 text-[#E8799A]/75"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.7,
              duration: 0.4,
              ease: EASE_OUT,
            }}
          >
            <span className="h-px w-12 bg-current sm:w-16" />
            <span className="text-sm">✿</span>
            <span className="h-px w-12 bg-current sm:w-16" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
