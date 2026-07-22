"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";

const BG = "#3A080C";
const CREAM = "#FFF5EC";
const GOLD = "#D4AF37";
const GOLD_SOFT = "#F0D878";
const ROSE = "#A51C28";
const ROSE_DEEP = "#6B0F16";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Bigger one-shot burst — heboh energy (Bloom density, Warm crimson). */
const BURST = [
  {
    x: -120,
    y: -78,
    rotate: -24,
    delay: 0.1,
    size: 24,
    kind: "petal" as const,
  },
  { x: 126, y: -84, rotate: 28, delay: 0.14, size: 22, kind: "petal" as const },
  { x: -145, y: 12, rotate: -16, delay: 0.18, size: 30, kind: "q" as const },
  { x: 148, y: 22, rotate: 20, delay: 0.2, size: 28, kind: "q" as const },
  {
    x: -78,
    y: 105,
    rotate: -20,
    delay: 0.24,
    size: 18,
    kind: "petal" as const,
  },
  { x: 86, y: 110, rotate: 22, delay: 0.26, size: 18, kind: "petal" as const },
  { x: 0, y: -130, rotate: 8, delay: 0.12, size: 32, kind: "heart" as const },
  {
    x: -95,
    y: -40,
    rotate: -18,
    delay: 0.22,
    size: 20,
    kind: "heart" as const,
  },
  { x: 100, y: -36, rotate: 16, delay: 0.23, size: 20, kind: "heart" as const },
  {
    x: -170,
    y: -24,
    rotate: -32,
    delay: 0.22,
    size: 15,
    kind: "shard" as const,
  },
  { x: 175, y: -14, rotate: 34, delay: 0.23, size: 15, kind: "shard" as const },
  { x: -55, y: 55, rotate: 10, delay: 0.28, size: 16, kind: "shard" as const },
  { x: 60, y: 60, rotate: -12, delay: 0.3, size: 16, kind: "shard" as const },
] as const;

const FALLING = [
  { left: "8%", delay: 0.2, duration: 6.8, size: 13, x: 16 },
  { left: "24%", delay: 1.0, duration: 7.5, size: 11, x: -12 },
  { left: "55%", delay: 0.5, duration: 7.0, size: 14, x: 10 },
  { left: "72%", delay: 1.6, duration: 8.0, size: 12, x: -14 },
  { left: "88%", delay: 0.8, duration: 7.2, size: 13, x: 8 },
] as const;

const SPARKLES = [
  { top: "10%", left: "16%", delay: 0.15, size: 3.5 },
  { top: "18%", left: "70%", delay: 0.45, size: 4.5 },
  { top: "28%", left: "8%", delay: 0.7, size: 3 },
  { top: "64%", left: "12%", delay: 0.95, size: 3.5 },
  { top: "72%", left: "80%", delay: 0.55, size: 4 },
  { top: "40%", left: "92%", delay: 0.85, size: 3 },
  { top: "52%", left: "48%", delay: 0.3, size: 3 },
  { top: "82%", left: "42%", delay: 1.1, size: 3 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill={ROSE}
        opacity="0.95"
      />
      <path
        d="M12 6C10 12 8 16 10 22"
        stroke="#F0D0D0"
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

function QuestionChip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden>
      <defs>
        <linearGradient id="warmQCardHot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#E8D4C0" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="40"
        height="48"
        rx="4"
        fill="url(#warmQCardHot)"
        stroke={GOLD}
        strokeWidth="1.6"
      />
      <text
        x="24"
        y="36"
        textAnchor="middle"
        fill={ROSE_DEEP}
        fontSize="26"
        fontFamily="Georgia, serif"
        fontWeight="700"
      >
        ?
      </text>
    </svg>
  );
}

function GoldShard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" className={className} aria-hidden>
      <path d="M8 0 L16 14 L8 20 L0 14 Z" fill={GOLD} opacity="0.9" />
    </svg>
  );
}

function Starburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="warmBurstHot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E03848" />
          <stop offset="40%" stopColor="#B81E2C" />
          <stop offset="75%" stopColor="#8B1A22" />
          <stop offset="100%" stopColor="#5A0E14" />
        </radialGradient>
      </defs>
      <polygon
        fill="url(#warmBurstHot)"
        points="100,2 120,48 174,22 148,68 198,88 152,108 182,162 120,138 100,198 80,138 18,162 48,108 2,88 52,68 26,22 80,48"
      />
      <polygon
        fill="#C42838"
        opacity="0.55"
        points="100,22 114,56 152,38 134,72 176,88 136,102 158,142 114,122 100,168 86,122 42,142 64,102 24,88 66,72 48,38 86,56"
      />
    </svg>
  );
}

function GoldFiligree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 18" className={className} aria-hidden fill="none">
      <path
        d="M4 9 C20 2 36 2 60 9 C84 16 100 16 116 9"
        stroke={GOLD}
        strokeWidth="1.4"
        opacity="0.95"
      />
      <circle cx="60" cy="9" r="2.6" fill={GOLD_SOFT} />
      <circle cx="36" cy="6" r="1.4" fill={GOLD} opacity="0.75" />
      <circle cx="84" cy="12" r="1.4" fill={GOLD} opacity="0.75" />
    </svg>
  );
}

/**
 * warm.connection.quiz-transition — heboh “QUIZ TIME!” celebration.
 * Bloom Scene 4 energy (rings, burst, spring title) + Warm crimson/gold identity.
 * Auto-advance (~2s); no CTA.
 */
export function WarmConnectionQuizTransitionScene(
  _props: WarmConnectionSceneProps,
) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{ backgroundColor: BG }}
      role="status"
      aria-live="polite"
      aria-label="Quiz time"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 95% 75% at 50% 40%, #7A141C 0%, transparent 55%)",
            "radial-gradient(ellipse 120% 90% at 50% 110%, #120204 0%, transparent 50%)",
            "linear-gradient(165deg, #6B141C 0%, #3A080C 42%, #220508 100%)",
          ].join(", "),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Expanding celebration rings */}
      {!reduceMotion
        ? [0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border"
              style={{
                width: "16vmin",
                height: "16vmin",
                marginLeft: "-8vmin",
                marginTop: "-8vmin",
                borderColor:
                  i === 1 ? "rgba(240,216,120,0.45)" : "rgba(196,40,56,0.45)",
              }}
              initial={{ opacity: 0.8, scale: 0.35 }}
              animate={{ opacity: 0, scale: 4.6 + i * 0.65 }}
              transition={{
                duration: 1.45,
                delay: 0.05 + i * 0.14,
                ease: EASE,
              }}
            />
          ))
        : null}

      {/* Soft bloom + pulse */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[85vmin] sm:w-[85vmin]"
        style={{
          background:
            "radial-gradient(circle, rgba(240,216,120,0.35) 0%, rgba(180,30,45,0.4) 32%, rgba(74,10,16,0) 68%)",
        }}
        initial={
          reduceMotion
            ? { opacity: 0.75, scale: 1 }
            : { opacity: 0, scale: 0.3 }
        }
        animate={
          reduceMotion
            ? { opacity: 0.75, scale: 1 }
            : { opacity: [0, 1, 0.75], scale: [0.3, 1.08, 1.22] }
        }
        transition={{ duration: 1.15, ease: EASE }}
      />

      {/* Continuous falling petals */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALLING.map((p, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: p.left,
                top: "-6%",
                width: p.size,
                height: p.size * 1.35,
              }}
              animate={{
                opacity: [0, 0.95, 0.95, 0],
                y: ["0vh", "112vh"],
                x: [0, p.x, p.x * -0.35],
                rotate: [0, 45, -20, 60],
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

      {!reduceMotion ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                backgroundColor: GOLD_SOFT,
                boxShadow: `0 0 14px ${GOLD}`,
              }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.75, 1.4, 0.75] }}
              transition={{
                duration: 1.9,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Floating question chips */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-7 right-4 sm:top-10 sm:right-10"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: 18 }}
        animate={
          reduceMotion
            ? { opacity: 0.95, rotate: 8 }
            : {
                opacity: 0.95,
                scale: 1,
                rotate: [8, 14, 8],
                y: [0, -8, 0],
              }
        }
        transition={
          reduceMotion
            ? { delay: 0.2 }
            : {
                delay: 0.18,
                type: "spring",
                stiffness: 240,
                damping: 14,
                y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <QuestionChip className="h-16 w-14 drop-shadow-lg sm:h-[4.75rem] sm:w-16" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-14 left-3 sm:bottom-18 sm:left-8"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -18 }}
        animate={
          reduceMotion
            ? { opacity: 0.92, rotate: -10 }
            : {
                opacity: 0.92,
                scale: 1,
                rotate: [-10, -16, -10],
                y: [0, 8, 0],
              }
        }
        transition={
          reduceMotion
            ? { delay: 0.28 }
            : {
                delay: 0.26,
                type: "spring",
                stiffness: 240,
                damping: 14,
                y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <QuestionChip className="h-14 w-12 drop-shadow-lg sm:h-16 sm:w-14" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-24 left-5 sm:top-28 sm:left-12"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
        animate={
          reduceMotion
            ? { opacity: 0.8 }
            : { opacity: 0.85, scale: 1, y: [0, -6, 0] }
        }
        transition={{
          delay: 0.35,
          y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <QuestionChip className="h-11 w-9 opacity-90 sm:h-12 sm:w-10" />
      </motion.div>

      {/* Burst from center */}
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
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.25 }}
              animate={{
                opacity: [0, 1, 0.85],
                x: b.x,
                y: b.y,
                scale: [0.25, 1.2, 1],
                rotate: b.rotate,
              }}
              transition={{ duration: 0.9, delay: b.delay, ease: EASE }}
            >
              {b.kind === "petal" ? (
                <SoftPetal className="h-full w-full" />
              ) : b.kind === "shard" ? (
                <GoldShard className="h-full w-full" />
              ) : b.kind === "heart" ? (
                <span
                  style={{
                    fontSize: b.size,
                    color: "#F0A8B4",
                    textShadow: "0 0 12px rgba(240,168,180,0.6)",
                  }}
                >
                  ♡
                </span>
              ) : (
                <span
                  className="font-serif font-bold"
                  style={{
                    fontSize: b.size,
                    color: GOLD_SOFT,
                    textShadow: `0 0 14px ${GOLD}`,
                  }}
                >
                  ?
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Hero */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-3 pb-8 sm:px-6">
        <div className="relative flex w-full max-w-xl flex-col items-center sm:max-w-2xl">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 w-[min(96vw,30rem)] -translate-x-1/2 -translate-y-[52%] aspect-square sm:w-[min(90vw,34rem)]"
            initial={
              reduceMotion
                ? { opacity: 0.95, scale: 1 }
                : { opacity: 0, scale: 0.4, rotate: -12 }
            }
            animate={
              reduceMotion
                ? { opacity: 0.95, scale: 1 }
                : { opacity: 1, scale: 1, rotate: 0 }
            }
            transition={{
              duration: 0.75,
              delay: 0.04,
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
          >
            <motion.div
              className="h-full w-full"
              animate={reduceMotion ? undefined : { rotate: [0, 4, -3, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Starburst className="h-full w-full drop-shadow-[0_24px_48px_rgba(20,4,8,0.6)]" />
            </motion.div>
          </motion.div>

          <motion.span
            className="relative mb-1 font-serif text-5xl sm:mb-2 sm:text-6xl md:text-7xl"
            style={{
              color: "#F0A8B4",
              textShadow: "0 0 24px rgba(240,168,180,0.55)",
            }}
            aria-hidden
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.3 }
            }
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [0.3, 1.3, 1] }
            }
            transition={{ delay: 0.06, duration: 0.65, ease: EASE }}
          >
            ♡
          </motion.span>

          <motion.h1
            className="relative text-center font-serif text-[3.4rem] leading-[0.9] font-semibold tracking-tight uppercase sm:text-7xl md:text-8xl"
            style={{
              color: CREAM,
              textShadow: [
                `0 1px 0 ${GOLD}`,
                `0 2px 0 #B8922A`,
                `0 3px 0 #A67C1A`,
                `0 5px 0 #8F6A14`,
                `0 10px 22px rgba(20,4,8,0.6)`,
                `0 0 48px rgba(240,216,120,0.4)`,
              ].join(", "),
            }}
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.55, y: 36 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 0.16,
                    type: "spring",
                    stiffness: 260,
                    damping: 12,
                  }
            }
          >
            Quiz
            <br />
            Time!
          </motion.h1>

          <motion.p
            className="relative mt-5 text-center font-serif text-lg tracking-wide sm:mt-6 sm:text-xl"
            style={{ color: "rgba(255,245,236,0.92)" }}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.5,
              duration: 0.45,
              ease: EASE,
            }}
          >
            Let the fun begin
          </motion.p>

          <motion.div
            className="relative mt-5"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.65,
              duration: 0.4,
              ease: EASE,
            }}
          >
            <GoldFiligree className="h-5 w-32 sm:h-6 sm:w-40" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
