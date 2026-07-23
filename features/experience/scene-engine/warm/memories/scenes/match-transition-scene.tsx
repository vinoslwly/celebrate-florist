"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

const BG = "#2A060A";
const GOLD = "#D4AF37";
const GOLD_SOFT = "#F0D878";
const ROSE = "#C42838";
const ROSE_MID = "#A51C28";
const ROSE_DEEP = "#6B0F16";
const INK = "#3A0A10";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Bigger cards — fill the frame like the Founder scrapbook. */
const FLOAT_CARDS = [
  {
    className:
      "absolute top-[6%] left-[1%] w-[5.4rem] rotate-[-22deg] sm:left-[5%] sm:top-[8%] sm:w-[6.8rem]",
    delay: 0.1,
    kind: "back" as const,
  },
  {
    className:
      "absolute top-[8%] right-[0%] w-[5.2rem] rotate-[20deg] sm:right-[4%] sm:top-[10%] sm:w-[6.5rem]",
    delay: 0.16,
    kind: "front" as const,
  },
  {
    className:
      "absolute top-[38%] left-[-1%] w-[4.6rem] rotate-[8deg] sm:left-[2%] sm:w-[5.6rem]",
    delay: 0.22,
    kind: "front" as const,
  },
  {
    className:
      "absolute top-[36%] right-[-2%] w-[4.8rem] rotate-[-10deg] sm:right-[1%] sm:w-[5.8rem]",
    delay: 0.2,
    kind: "back" as const,
  },
  {
    className:
      "absolute bottom-[10%] left-[4%] w-[5rem] rotate-[14deg] sm:bottom-[12%] sm:left-[8%] sm:w-[6.2rem]",
    delay: 0.28,
    kind: "back" as const,
  },
  {
    className:
      "absolute right-[3%] bottom-[9%] w-[5.1rem] rotate-[-16deg] sm:right-[7%] sm:bottom-[11%] sm:w-[6.4rem]",
    delay: 0.26,
    kind: "front" as const,
  },
] as const;

/** One-shot fall only — no infinite loops (perf). */
const FALLING = [
  { left: "12%", delay: 0.1, duration: 1.8, size: 15, x: 18 },
  { left: "38%", delay: 0.25, duration: 2.0, size: 17, x: -12 },
  { left: "62%", delay: 0.18, duration: 1.9, size: 14, x: 10 },
  { left: "84%", delay: 0.32, duration: 2.1, size: 16, x: -14 },
] as const;

const HEART_CONFETTI = [
  { top: "18%", left: "24%", delay: 0.35, size: 12 },
  { top: "22%", left: "76%", delay: 0.45, size: 13 },
  { top: "58%", left: "12%", delay: 0.55, size: 11 },
  { top: "62%", left: "86%", delay: 0.4, size: 12 },
] as const;

/** Dense but lean one-shot explosion from center. */
const BURST = [
  {
    x: -120,
    y: -80,
    rotate: -26,
    delay: 0.06,
    size: 26,
    kind: "petal" as const,
  },
  { x: 128, y: -84, rotate: 28, delay: 0.09, size: 24, kind: "petal" as const },
  { x: -150, y: 0, rotate: -16, delay: 0.12, size: 20, kind: "heart" as const },
  { x: 155, y: 8, rotate: 18, delay: 0.13, size: 20, kind: "heart" as const },
  {
    x: -85,
    y: 110,
    rotate: -20,
    delay: 0.15,
    size: 22,
    kind: "petal" as const,
  },
  { x: 92, y: 116, rotate: 22, delay: 0.16, size: 22, kind: "petal" as const },
  { x: 0, y: -135, rotate: 4, delay: 0.08, size: 24, kind: "heart" as const },
  {
    x: -175,
    y: -30,
    rotate: -32,
    delay: 0.14,
    size: 16,
    kind: "shard" as const,
  },
  { x: 180, y: -22, rotate: 34, delay: 0.15, size: 16, kind: "shard" as const },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill={ROSE_MID}
        opacity="0.96"
      />
      <path
        d="M12 6C10 12 8 16 10 22"
        stroke="#F5C8C8"
        strokeWidth="1.1"
        opacity="0.5"
      />
    </svg>
  );
}

function GoldHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 16" className={className} aria-hidden>
      <defs>
        <linearGradient id="wmGoldHeart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF4C8" />
          <stop offset="45%" stopColor={GOLD_SOFT} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>
      <path
        d="M9 14.5 C3.2 10.2 1.2 7.4 2.4 4.9 C3.2 3.2 5.6 2.9 9 5.2 C12.4 2.9 14.8 3.2 15.6 4.9 C16.8 7.4 14.8 10.2 9 14.5Z"
        fill="url(#wmGoldHeart)"
        stroke="#B8922A"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function GoldShard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" className={className} aria-hidden>
      <path d="M8 0 L16 14 L8 20 L0 14 Z" fill={GOLD} opacity="0.95" />
      <path d="M8 2 L13 13 L8 17 L3 13 Z" fill={GOLD_SOFT} opacity="0.55" />
    </svg>
  );
}

function GoldFiligree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 22" className={className} aria-hidden fill="none">
      <path
        d="M4 11 C18 3 32 3 48 9 C56 12 64 12 70 11 C76 12 84 12 92 9 C108 3 122 3 136 11"
        stroke={GOLD}
        strokeWidth="1.6"
        opacity="0.95"
      />
      <path
        d="M28 7 C34 2 42 2 48 7"
        stroke={GOLD_SOFT}
        strokeWidth="1.1"
        opacity="0.8"
      />
      <path
        d="M92 7 C98 2 106 2 112 7"
        stroke={GOLD_SOFT}
        strokeWidth="1.1"
        opacity="0.8"
      />
      <circle cx="70" cy="11" r="3" fill={GOLD_SOFT} />
      <circle cx="48" cy="9" r="1.6" fill={GOLD} opacity="0.85" />
      <circle cx="92" cy="9" r="1.6" fill={GOLD} opacity="0.85" />
    </svg>
  );
}

function RoseLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden fill="none">
      <path
        d="M24 50 C24 36 16 30 16 20 C16 13 21 9 24 7 C27 9 32 13 32 20 C32 30 24 36 24 50Z"
        stroke={GOLD}
        strokeWidth="1.5"
      />
      <circle cx="24" cy="17" r="8" stroke={GOLD} strokeWidth="1.4" />
      <path
        d="M19 14 C22 11 26 11 29 14 M19 20 C22 23 26 23 29 20"
        stroke={GOLD}
        strokeWidth="1.1"
        opacity="0.9"
      />
      <path d="M24 25 L24 48" stroke={GOLD} strokeWidth="1.2" opacity="0.75" />
    </svg>
  );
}

function Starburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="wmMatchBurst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E84858" />
          <stop offset="35%" stopColor="#C42838" />
          <stop offset="70%" stopColor="#8B1A22" />
          <stop offset="100%" stopColor="#4A0A10" />
        </radialGradient>
      </defs>
      <polygon
        fill="url(#wmMatchBurst)"
        points="100,0 118,44 168,18 146,64 200,82 150,104 178,156 118,134 100,200 82,134 22,156 50,104 0,82 54,64 32,18 82,44"
      />
      <polygon
        fill="#E03848"
        opacity="0.5"
        points="100,18 114,52 154,34 136,70 180,86 138,102 160,144 114,124 100,172 86,124 40,144 62,102 20,86 64,70 46,34 86,52"
      />
    </svg>
  );
}

function MemoryCardFace({ kind }: { kind: "back" | "front" }) {
  if (kind === "back") {
    return (
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.6rem]"
        style={{
          background: `linear-gradient(155deg, #9B1E28 0%, ${ROSE_DEEP} 48%, #3A080C 100%)`,
          border: `2px solid ${GOLD}`,
          boxShadow:
            "0 16px 36px -12px rgba(20,4,8,0.7), inset 0 1px 0 rgba(240,216,120,0.25)",
        }}
      >
        <div
          className="absolute inset-[8%] rounded-[0.32rem]"
          style={{ border: "1px solid rgba(212,175,55,0.5)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-2 left-2 h-3 w-3 opacity-70"
          style={{
            borderTop: `1.5px solid ${GOLD}`,
            borderLeft: `1.5px solid ${GOLD}`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-2 right-2 h-3 w-3 opacity-70"
          style={{
            borderTop: `1.5px solid ${GOLD}`,
            borderRight: `1.5px solid ${GOLD}`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 opacity-70"
          style={{
            borderBottom: `1.5px solid ${GOLD}`,
            borderLeft: `1.5px solid ${GOLD}`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 opacity-70"
          style={{
            borderBottom: `1.5px solid ${GOLD}`,
            borderRight: `1.5px solid ${GOLD}`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <RoseLine className="h-12 w-10 drop-shadow-sm sm:h-14 sm:w-12" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.6rem]"
      style={{
        background:
          "linear-gradient(165deg, #FFFEFA 0%, #FFF6EA 55%, #F0E2D0 100%)",
        border: `2px solid rgba(212,175,55,0.75)`,
        boxShadow: "0 16px 36px -12px rgba(20,4,8,0.55)",
      }}
    >
      <div
        className="absolute inset-[7%] rounded-[0.3rem]"
        style={{ border: "1px solid rgba(165,28,40,0.3)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-85">
        <svg
          viewBox="0 0 48 56"
          className="h-11 w-9 sm:h-12 sm:w-10"
          aria-hidden
          fill="none"
        >
          <path
            d="M24 48 C24 34 16 28 16 19 C16 12 21 9 24 7 C27 9 32 12 32 19 C32 28 24 34 24 48Z"
            stroke={INK}
            strokeWidth="1.4"
          />
          <circle cx="24" cy="16" r="7" stroke={INK} strokeWidth="1.3" />
          <path
            d="M19 13 C22 10 26 10 29 13 M19 19 C22 22 26 22 29 19"
            stroke={INK}
            strokeWidth="1.1"
          />
        </svg>
      </div>
    </div>
  );
}

function FanCards({ className }: { className?: string }) {
  return (
    <div className={`relative h-14 w-36 ${className ?? ""}`} aria-hidden>
      {[-22, -8, 8, 22].map((rot, i) => (
        <div
          key={rot}
          className="absolute bottom-0 left-1/2 h-12 w-8 origin-bottom rounded-sm"
          style={{
            transform: `translateX(-50%) rotate(${rot}deg) translateX(${(i - 1.5) * 7}px)`,
            background: `linear-gradient(155deg, #9B1E28 0%, ${ROSE_DEEP} 100%)`,
            border: `1.5px solid ${GOLD}`,
            boxShadow: "0 8px 16px -8px rgba(20,4,8,0.65)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-80">
            <RoseLine className="h-5 w-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * warm.memories.match-transition — Scene 4 (polished).
 * Heboh scrapbook “MEMORY MATCH!” — Quiz Time energy + Founder cards/paper.
 * Auto-advance; no CTA.
 */
export function WarmMemoriesMatchTransitionScene(
  _props: WarmMemoriesSceneProps,
) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{ backgroundColor: BG }}
      role="status"
      aria-live="polite"
      aria-label="Memory Match"
    >
      {/* Dual-tone field — cream wash → deep crimson (Founder ref) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 90% 70% at 18% 12%, rgba(255,244,228,0.28) 0%, transparent 55%)",
            "radial-gradient(ellipse 100% 80% at 50% 42%, #8B1A22 0%, transparent 58%)",
            "radial-gradient(ellipse 120% 90% at 78% 92%, #120204 0%, transparent 48%)",
            "linear-gradient(155deg, #5A1018 0%, #3A080C 40%, #1A0406 100%)",
          ].join(", "),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Impact flash */}
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,244,220,0.55) 0%, transparent 55%)",
          }}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        />
      ) : null}

      {/* Expanding celebration rings */}
      {!reduceMotion
        ? [0, 1].map((i) => (
            <motion.div
              key={`ring-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-[45%] left-1/2 rounded-full border-2"
              style={{
                width: "14vmin",
                height: "14vmin",
                marginLeft: "-7vmin",
                marginTop: "-7vmin",
                borderColor:
                  i % 2 === 0
                    ? "rgba(240,216,120,0.55)"
                    : "rgba(228,56,72,0.5)",
              }}
              initial={{ opacity: 0.95, scale: 0.25 }}
              animate={{ opacity: 0, scale: 5.2 + i * 0.7 }}
              transition={{
                duration: 1.2,
                delay: 0.02 + i * 0.12,
                ease: EASE,
              }}
            />
          ))
        : null}

      {/* Soft bloom pulse */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[45%] left-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(240,216,120,0.45) 0%, rgba(196,40,56,0.45) 28%, rgba(74,10,16,0) 65%)",
        }}
        initial={
          reduceMotion ? { opacity: 0.8, scale: 1 } : { opacity: 0, scale: 0.2 }
        }
        animate={
          reduceMotion
            ? { opacity: 0.8, scale: 1 }
            : { opacity: [0, 1, 0.7], scale: [0.2, 1.15, 1.35] }
        }
        transition={{ duration: 1.05, ease: EASE }}
      />

      {/* One-shot falling petals — no infinite loops */}
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
              initial={{ opacity: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0.9, 0],
                y: "95vh",
                x: p.x,
                rotate: 50,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Gold heart confetti */}
      {!reduceMotion
        ? HEART_CONFETTI.map((h, i) => (
            <motion.div
              key={`heart-${i}`}
              aria-hidden
              className="pointer-events-none absolute z-20"
              style={{
                top: h.top,
                left: h.left,
                width: h.size,
                height: h.size,
              }}
              initial={{ opacity: 0, scale: 0, y: -12 }}
              animate={{
                opacity: [0, 1, 0.85],
                scale: [0, 1.35, 1],
                y: [-12, 0, 6],
                rotate: [-20, 10, -8],
              }}
              transition={{ delay: h.delay, duration: 0.7, ease: EASE }}
            >
              <GoldHeart className="h-full w-full drop-shadow-[0_0_8px_rgba(240,216,120,0.7)]" />
            </motion.div>
          ))
        : null}

      {!reduceMotion ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          {[
            { top: "12%", left: "20%" },
            { top: "28%", left: "78%" },
            { top: "70%", left: "16%" },
            { top: "74%", left: "82%" },
          ].map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: 3.5,
                height: 3.5,
                backgroundColor: GOLD_SOFT,
                boxShadow: `0 0 10px ${GOLD}`,
                opacity: 0.75,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Floating memory cards — enter once, no float loop */}
      {FLOAT_CARDS.map((card, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none z-20 ${card.className}`}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 56,
                  scale: 0.5,
                  rotate: card.className.includes("-") ? 28 : -28,
                }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: reduceMotion ? 0 : card.delay,
            type: "spring",
            stiffness: 280,
            damping: 16,
          }}
        >
          <MemoryCardFace kind={card.kind} />
        </motion.div>
      ))}

      {/* Center burst particles */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-[45%] left-1/2 z-25"
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
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.15 }}
              animate={{
                opacity: [0, 1, 0.9],
                x: b.x,
                y: b.y,
                scale: [0.15, 1.35, 1],
                rotate: b.rotate,
              }}
              transition={{ duration: 0.75, delay: b.delay, ease: EASE }}
            >
              {b.kind === "petal" ? (
                <SoftPetal className="h-full w-full" />
              ) : b.kind === "shard" ? (
                <GoldShard className="h-full w-full" />
              ) : (
                <GoldHeart className="h-full w-full drop-shadow-[0_0_10px_rgba(240,216,120,0.8)]" />
              )}
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Hero */}
      <div className="relative z-30 flex min-h-full w-full flex-col items-center justify-center px-3 pb-10 sm:px-6">
        <div className="relative flex w-full max-w-xl flex-col items-center sm:max-w-2xl">
          {/* Starburst behind parchment */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 w-[min(98vw,32rem)] -translate-x-1/2 -translate-y-[52%] aspect-square sm:w-[min(92vw,36rem)]"
            initial={
              reduceMotion
                ? { opacity: 0.95, scale: 1 }
                : { opacity: 0, scale: 0.25, rotate: -18 }
            }
            animate={
              reduceMotion
                ? { opacity: 0.95, scale: 1 }
                : { opacity: 1, scale: 1, rotate: 0 }
            }
            transition={{
              delay: 0.02,
              type: "spring",
              stiffness: 200,
              damping: 12,
            }}
          >
            <Starburst className="h-full w-full drop-shadow-[0_28px_56px_rgba(20,4,8,0.7)]" />
          </motion.div>

          {/* Stacked torn parchment plates */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 z-[1] w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-[55%] aspect-[5/3.4] sm:w-[min(86vw,30rem)]"
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.5, y: 24 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.08,
              type: "spring",
              stiffness: 240,
              damping: 14,
            }}
          >
            <div
              className="absolute inset-0 translate-x-2 translate-y-3"
              style={{
                background: `linear-gradient(155deg, ${ROSE} 0%, ${ROSE_DEEP} 100%)`,
                clipPath:
                  "polygon(3% 10%, 16% 1%, 38% 7%, 58% 0%, 80% 6%, 100% 12%, 97% 42%, 100% 72%, 90% 98%, 68% 100%, 46% 93%, 22% 100%, 2% 88%, 0% 52%, 4% 26%)",
                opacity: 0.95,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(165deg, #FFFEFA 0%, #FFF4E6 45%, #EFE0CC 100%)",
                clipPath:
                  "polygon(1% 12%, 14% 2%, 32% 8%, 50% 1%, 70% 7%, 88% 2%, 99% 11%, 100% 36%, 96% 58%, 100% 78%, 92% 98%, 70% 100%, 50% 94%, 30% 100%, 10% 94%, 0% 76%, 3% 48%, 0% 28%)",
                boxShadow:
                  "0 28px 60px -20px rgba(20,4,8,0.65), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            />
            {/* Fake cursive scrap lines */}
            <svg
              className="absolute inset-[12%] opacity-25"
              viewBox="0 0 200 120"
              aria-hidden
              fill="none"
            >
              <path
                d="M8 22 C40 10 70 30 100 18 C130 8 160 28 192 16"
                stroke={INK}
                strokeWidth="1.2"
              />
              <path
                d="M12 48 C50 36 80 58 120 44 C150 34 170 52 190 42"
                stroke={INK}
                strokeWidth="1.1"
              />
              <path
                d="M10 78 C45 66 85 88 125 72 C155 62 175 80 192 70"
                stroke={INK}
                strokeWidth="1.1"
              />
              <path
                d="M16 102 C55 92 95 110 140 98 C165 90 180 104 194 96"
                stroke={INK}
                strokeWidth="1"
              />
            </svg>
          </motion.div>

          <motion.div
            className="relative z-10 mb-1 flex items-center gap-2 sm:mb-2"
            aria-hidden
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.2 }
            }
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [0.2, 1.4, 1] }
            }
            transition={{ delay: 0.12, duration: 0.55, ease: EASE }}
          >
            <GoldFiligree className="h-4 w-[4.5rem] opacity-95 sm:h-5 sm:w-28" />
            <GoldHeart className="h-5 w-5 drop-shadow-[0_0_12px_rgba(240,216,120,0.9)] sm:h-6 sm:w-6" />
            <GoldFiligree className="h-4 w-[4.5rem] scale-x-[-1] opacity-95 sm:h-5 sm:w-28" />
          </motion.div>

          <motion.h1
            className="relative z-10 text-center font-serif text-[3.35rem] leading-[0.88] font-bold tracking-tight uppercase sm:text-7xl md:text-8xl"
            style={{
              color: ROSE_DEEP,
              textShadow: [
                `0 1px 0 ${GOLD_SOFT}`,
                `0 2px 0 ${GOLD}`,
                `0 3px 0 #B8922A`,
                `0 4px 0 #A67C1A`,
                `0 6px 0 #8F6A14`,
                `0 12px 28px rgba(20,4,8,0.55)`,
                `0 0 52px rgba(240,216,120,0.35)`,
              ].join(", "),
            }}
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.35, y: 48, rotate: -6 }
            }
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 0.14,
                    type: "spring",
                    stiffness: 320,
                    damping: 11,
                  }
            }
          >
            Memory
            <br />
            Match!
          </motion.h1>

          <motion.div
            className="relative z-10 mt-3 flex items-center gap-2 sm:mt-4"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.4, duration: 0.4 }}
          >
            <GoldFiligree className="h-4 w-[4.5rem] opacity-95 sm:h-5 sm:w-28" />
            <GoldHeart className="h-4 w-4 sm:h-5 sm:w-5" />
            <GoldFiligree className="h-4 w-[4.5rem] scale-x-[-1] opacity-95 sm:h-5 sm:w-28" />
          </motion.div>

          <motion.p
            className="relative z-10 mt-5 text-center font-serif text-xl tracking-wide sm:mt-6 sm:text-2xl"
            style={{
              color: ROSE_DEEP,
              textShadow: "0 1px 0 rgba(255,248,240,0.7)",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.5,
              duration: 0.45,
              ease: EASE,
            }}
          >
            Let the memories begin
          </motion.p>

          <motion.div
            className="relative z-10 mt-5"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.6,
              type: "spring",
              stiffness: 260,
              damping: 14,
            }}
          >
            <FanCards />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
