"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const GOLD = "#FFE8A0";
const EASE = [0.22, 1, 0.36, 1] as const;

/** One-shot celebratory burst — stars + hearts, still capped for mobile. */
const BURST = [
  {
    x: -118,
    y: -64,
    rotate: -24,
    delay: 0.08,
    size: 18,
    kind: "star" as const,
    fill: GOLD,
  },
  {
    x: 126,
    y: -72,
    rotate: 28,
    delay: 0.12,
    size: 17,
    kind: "star" as const,
    fill: SKY,
  },
  {
    x: -108,
    y: 58,
    rotate: -16,
    delay: 0.16,
    size: 16,
    kind: "heart" as const,
    fill: "#FF8FAB",
  },
  {
    x: 116,
    y: 64,
    rotate: 20,
    delay: 0.18,
    size: 16,
    kind: "heart" as const,
    fill: "#FF8FAB",
  },
  {
    x: 0,
    y: -128,
    rotate: 6,
    delay: 0.1,
    size: 20,
    kind: "star" as const,
    fill: GOLD,
  },
  {
    x: -148,
    y: -12,
    rotate: -30,
    delay: 0.2,
    size: 14,
    kind: "star" as const,
    fill: "#FFFFFF",
  },
  {
    x: 152,
    y: 2,
    rotate: 32,
    delay: 0.22,
    size: 14,
    kind: "star" as const,
    fill: SKY,
  },
  {
    x: -52,
    y: 110,
    rotate: -10,
    delay: 0.24,
    size: 13,
    kind: "star" as const,
    fill: GOLD,
  },
  {
    x: 58,
    y: 116,
    rotate: 12,
    delay: 0.26,
    size: 13,
    kind: "star" as const,
    fill: SKY_DEEP,
  },
] as const;

const TWINKLE = [
  { top: "11%", left: "18%", size: 10, delay: 0.2, fill: GOLD },
  { top: "15%", right: "16%", size: 12, delay: 0.55, fill: "#FFFFFF" },
  { top: "62%", left: "8%", size: 9, delay: 0.9, fill: SKY },
  { top: "58%", right: "10%", size: 11, delay: 1.1, fill: GOLD },
] as const;

const DOODLES = [
  { top: "34%", left: "4%", rotate: -18, label: "✦" },
  { top: "38%", right: "5%", rotate: 22, label: "✧" },
  { bottom: "34%", left: "12%", rotate: 8, label: "✦" },
  { bottom: "36%", right: "14%", rotate: -12, label: "✧" },
] as const;

function SoftStar({
  className,
  fill = SKY,
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill={fill}>
      <path d="M8 0.5 9.2 6.8 15.5 8 9.2 9.2 8 15.5 6.8 9.2 0.5 8 6.8 6.8Z" />
    </svg>
  );
}

function SoftCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 64" className={className} aria-hidden fill="none">
      <ellipse cx="46" cy="40" rx="36" ry="18" fill="white" opacity="0.92" />
      <ellipse cx="84" cy="32" rx="34" ry="24" fill="white" opacity="0.97" />
      <ellipse cx="122" cy="40" rx="30" ry="17" fill="white" opacity="0.9" />
      <ellipse cx="70" cy="48" rx="24" ry="12" fill="white" opacity="0.85" />
    </svg>
  );
}

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 52" className={className} aria-hidden fill="none">
      <path
        d="M4 26 L68 6 L40 46 L30 30 Z"
        fill="#A8D0E8"
        stroke={INK_SOFT}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M30 30 L68 6 L38 33 Z"
        fill="#E8F4FC"
        stroke={INK_SOFT}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M30 30 L40 46"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8 34 C4 38 1 42 0 46"
        stroke={SKY}
        strokeWidth="1.6"
        strokeDasharray="3 3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="12" cy="32" r="1.6" fill={SKY} opacity="0.75" />
      <circle cx="6" cy="38" r="1.2" fill={SKY} opacity="0.5" />
    </svg>
  );
}

function SpeechBubble({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[1.35rem] px-3.5 py-2.5 ${className ?? ""}`}
      style={{
        background: `linear-gradient(165deg, ${SKY} 0%, ${SKY_DEEP} 100%)`,
        boxShadow:
          "0 10px 22px -8px rgba(30,58,95,0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-2 left-5 h-3.5 w-3.5 rotate-45"
        style={{ background: SKY_DEEP }}
      />
    </div>
  );
}

function LinedNote({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg
        viewBox="0 0 80 72"
        className="h-full w-full drop-shadow-md"
        aria-hidden
      >
        <rect
          x="6"
          y="8"
          width="64"
          height="56"
          rx="4"
          fill="#FFFEFB"
          stroke="#D6E0EA"
          strokeWidth="1.3"
          transform="rotate(-7 38 36)"
        />
        {[20, 30, 40, 50].map((y) => (
          <line
            key={y}
            x1="14"
            y1={y}
            x2="60"
            y2={y}
            stroke="#C5DCEF"
            strokeWidth="1.1"
            transform="rotate(-7 38 36)"
          />
        ))}
        <circle
          cx="38"
          cy="38"
          r="11"
          fill="none"
          stroke={INK_SOFT}
          strokeWidth="1.8"
        />
        <circle cx="33.5" cy="34.5" r="1.5" fill={INK} />
        <circle cx="42.5" cy="34.5" r="1.5" fill={INK} />
        <path
          d="M32 42 Q38 47 44 42"
          stroke={INK}
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        />
        <rect
          x="24"
          y="2"
          width="26"
          height="12"
          rx="1.5"
          fill="#7EB6D9"
          opacity="0.6"
          transform="rotate(5 37 8)"
        />
      </svg>
    </div>
  );
}

function GinghamNote({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg
        viewBox="0 0 80 72"
        className="h-full w-full drop-shadow-md"
        aria-hidden
      >
        <defs>
          <pattern
            id="skyGinghamQuiz"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="10" fill="#EEF6FC" />
            <rect width="5" height="5" fill="#A8D0E8" />
            <rect x="5" y="5" width="5" height="5" fill="#A8D0E8" />
          </pattern>
        </defs>
        <path
          d="M10 12 H60 L68 20 V58 H10 Z"
          fill="url(#skyGinghamQuiz)"
          stroke={INK_SOFT}
          strokeWidth="1.3"
          transform="rotate(8 40 36)"
        />
        <path
          d="M60 12 L68 20 H60 Z"
          fill="#C5DCEF"
          stroke={INK_SOFT}
          strokeWidth="1"
          transform="rotate(8 40 36)"
        />
        <text
          x="38"
          y="44"
          textAnchor="middle"
          fill={INK}
          fontSize="30"
          fontFamily="Georgia, serif"
          fontWeight="700"
          transform="rotate(8 40 36)"
        >
          ?
        </text>
        <rect
          x="26"
          y="4"
          width="26"
          height="12"
          rx="1.5"
          fill="#5A9BC4"
          opacity="0.55"
          transform="rotate(-10 39 10)"
        />
      </svg>
    </div>
  );
}

function FivePointStar({
  className,
  fill,
}: {
  className?: string;
  fill: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={fill}>
      <path d="M12 2.2 14.6 9.1 22 9.5 16.4 14.2 18.2 21.5 12 17.6 5.8 21.5 7.6 14.2 2 9.5 9.4 9.1Z" />
    </svg>
  );
}

/** Oversized torn-paper cloud scrap behind hero type. */
function TornPaperCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden fill="none">
      <path
        d="M36 140 C18 112 30 78 64 68 C74 40 110 24 142 38 C162 16 202 12 230 32 C258 12 304 20 324 50 C358 42 392 68 386 104 C410 124 406 162 376 174 C386 200 356 226 320 220 C298 244 250 246 220 226 C190 246 140 240 116 216 C84 232 44 214 38 182 C14 170 16 152 36 140 Z"
        fill="#FFFEFB"
        stroke="rgba(126,182,217,0.4)"
        strokeWidth="2.5"
      />
      <path
        d="M56 146 C42 122 54 92 84 84 C94 60 126 48 152 58 C168 40 200 38 224 52 C246 38 284 46 300 70 C326 64 354 84 348 112 C368 126 364 156 340 166 C348 188 324 206 296 200 C280 218 246 220 224 204 C200 220 162 214 144 196 C120 208 90 196 82 172 C62 164 58 154 56 146 Z"
        fill="#F7FBFE"
        opacity="0.9"
      />
    </svg>
  );
}

function ReadyRibbon({ className }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="absolute -left-4 top-1/2 h-10 w-7 -translate-y-1/2"
        style={{
          background: "#4A8BB8",
          clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute -right-4 top-1/2 h-10 w-7 -translate-y-1/2"
        style={{
          background: "#4A8BB8",
          clipPath: "polygon(0 0, 100% 50%, 0 100%)",
        }}
      />
      <div
        className="relative rounded-lg px-6 py-3 sm:px-8 sm:py-3.5"
        style={{
          background: `linear-gradient(180deg, ${SKY} 0%, ${SKY_DEEP} 100%)`,
          boxShadow:
            "0 14px 28px -10px rgba(30,58,95,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <p className="font-serif text-base tracking-wide text-white sm:text-lg">
          Are you ready?{" "}
          <motion.span
            aria-hidden
            className="inline-block text-[#FF8FAB]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            ♥
          </motion.span>
        </p>
      </div>
    </div>
  );
}

/**
 * sky.connection.quiz-transition — Founder Scene 4 living recreation.
 * Oversized QUIZ TIME! · heboh scrapbook sky · auto-advance · mobile-light.
 */
export function SkyConnectionQuizTransitionScene(
  _props: SkyConnectionSceneProps,
) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={SCENE_VIEWPORT_LOCK}
      style={{ background: "#8EBFDE" }}
      role="status"
      aria-live="polite"
      aria-label="Quiz time"
    >
      {/* Bright sky + warm sun flare */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 60% at 8% 4%, rgba(255,250,220,0.95) 0%, rgba(255,236,180,0.35) 28%, transparent 58%)",
            "radial-gradient(ellipse 130% 100% at 50% 42%, #FFFFFF 0%, #E8F4FC 30%, #C5DCEF 62%, #9EC9E6 100%)",
          ].join(", "),
        }}
      />

      {/* Soft sun rays — CSS only, no paint thrash */}
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-8 -left-8 h-48 w-48 rounded-full sm:h-56 sm:w-56"
          style={{
            background:
              "conic-gradient(from 200deg at 40% 40%, rgba(255,248,220,0.55), transparent 18%, rgba(255,248,220,0.35) 22%, transparent 40%)",
            filter: "blur(2px)",
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      ) : null}

      {/* Layered clouds — denser bottom band like Founder ref */}
      <SoftCloud className="pointer-events-none absolute top-[2%] left-[-8%] h-16 w-44 opacity-85 sm:h-20 sm:w-52" />
      <SoftCloud className="pointer-events-none absolute top-[6%] right-[-6%] h-14 w-40 opacity-75 -scale-x-100" />
      <SoftCloud className="pointer-events-none absolute bottom-[-2%] left-[-4%] h-20 w-52 opacity-90 sm:h-24 sm:w-60" />
      <SoftCloud className="pointer-events-none absolute right-[-2%] bottom-[-1%] h-[4.5rem] w-48 opacity-85 -scale-x-100 sm:h-[5.5rem] sm:w-56" />
      <SoftCloud className="pointer-events-none absolute bottom-[8%] left-[28%] h-12 w-36 opacity-55" />

      {/* Expanding celebration rings */}
      {!reduceMotion
        ? [0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border-2 border-[#7EB6D9]/45"
              style={{
                width: "16vmin",
                height: "16vmin",
                marginLeft: "-8vmin",
                marginTop: "-8vmin",
              }}
              initial={{ opacity: 0.75, scale: 0.35 }}
              animate={{ opacity: 0, scale: 4.4 + i * 0.55 }}
              transition={{
                duration: 1.45,
                delay: 0.04 + i * 0.14,
                ease: EASE,
              }}
            />
          ))
        : null}

      {/* Soft bloom behind hero */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(184,220,240,0.55) 36%, transparent 68%)",
        }}
        initial={
          reduceMotion
            ? { opacity: 0.75, scale: 1 }
            : { opacity: 0, scale: 0.3 }
        }
        animate={
          reduceMotion
            ? { opacity: 0.75, scale: 1 }
            : { opacity: [0, 1, 0.72], scale: [0.3, 1.08, 1.2] }
        }
        transition={{ duration: 1.2, ease: EASE }}
      />

      {/* Paper plane — larger, flying in */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[8%] left-[3%] z-[5] sm:top-[10%] sm:left-[8%]"
        initial={
          reduceMotion ? false : { opacity: 0, x: -40, y: 28, rotate: -30 }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, x: 0, y: [0, -8, 0], rotate: -18 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                opacity: { delay: 0.12, duration: 0.35 },
                x: { delay: 0.12, duration: 0.55, ease: EASE },
                rotate: { delay: 0.12, duration: 0.55, ease: EASE },
                y: {
                  delay: 0.55,
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      >
        <PaperPlane className="h-14 w-20 drop-shadow-lg sm:h-16 sm:w-24" />
      </motion.div>

      {/* Speech bubbles — bigger, pop in near title */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[22%] left-[5%] z-[8] sm:top-[24%] sm:left-[12%]"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.3, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: 0.32,
          type: "spring",
          stiffness: 280,
          damping: 14,
        }}
      >
        <SpeechBubble>
          <span className="text-2xl leading-none text-white sm:text-3xl">
            ♥
          </span>
        </SpeechBubble>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[20%] right-[4%] z-[8] sm:top-[22%] sm:right-[11%]"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.3, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 280, damping: 14 }}
      >
        <SpeechBubble>
          <span className="text-base font-black tracking-[0.28em] text-white sm:text-lg">
            ···
          </span>
        </SpeechBubble>
      </motion.div>

      {/* Crown star above QUIZ */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[26%] left-1/2 z-[9] -translate-x-1/2 sm:top-[24%]"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.4 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.28,
          type: "spring",
          stiffness: 260,
          damping: 12,
        }}
      >
        <FivePointStar
          className="h-9 w-9 drop-shadow-md sm:h-11 sm:w-11"
          fill={SKY_DEEP}
        />
      </motion.div>

      {/* Twinkle sparkles — 4 only */}
      {!reduceMotion
        ? TWINKLE.map((t, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute z-[4]"
              style={{
                top: t.top,
                left: "left" in t ? t.left : undefined,
                right: "right" in t ? t.right : undefined,
                width: t.size,
                height: t.size,
              }}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.25, 0.8] }}
              transition={{
                duration: 1.8,
                delay: t.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SoftStar className="h-full w-full" fill={t.fill} />
            </motion.span>
          ))
        : null}

      {/* Hand-drawn doodle marks around hero */}
      {DOODLES.map((d, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute z-[7] text-xl text-[#3D7AAD]/70 sm:text-2xl"
          style={{
            top: "top" in d ? d.top : undefined,
            bottom: "bottom" in d ? d.bottom : undefined,
            left: "left" in d ? d.left : undefined,
            right: "right" in d ? d.right : undefined,
            rotate: `${d.rotate}deg`,
          }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.06, duration: 0.35 }}
        >
          {d.label}
        </motion.span>
      ))}

      {/* Corner stars */}
      <FivePointStar
        className="pointer-events-none absolute top-[32%] left-[3%] h-8 w-8 opacity-85 sm:left-[7%] sm:h-10 sm:w-10"
        fill={SKY_DEEP}
      />
      <FivePointStar
        className="pointer-events-none absolute right-[4%] bottom-[30%] h-7 w-7 opacity-80 sm:right-[8%] sm:h-9 sm:w-9"
        fill={SKY}
      />
      <SoftStar
        className="pointer-events-none absolute bottom-[26%] left-[16%] h-5 w-5 opacity-80"
        fill={GOLD}
      />

      {/* Sticky notes — larger */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[8%] left-[2%] z-[8] h-[4.75rem] w-[5.25rem] sm:bottom-[10%] sm:left-[8%] sm:h-24 sm:w-28"
        initial={reduceMotion ? false : { opacity: 0, y: 24, rotate: -18 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{
          delay: 0.42,
          type: "spring",
          stiffness: 230,
          damping: 14,
        }}
      >
        <LinedNote className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[1%] bottom-[7%] z-[8] h-[4.75rem] w-[5.25rem] sm:right-[7%] sm:bottom-[9%] sm:h-24 sm:w-28"
        initial={reduceMotion ? false : { opacity: 0, y: 24, rotate: 18 }}
        animate={{ opacity: 1, y: 0, rotate: 9 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 230, damping: 14 }}
      >
        <GinghamNote className="h-full w-full" />
      </motion.div>

      {/* One-shot star + heart burst */}
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
                height: b.size,
                marginLeft: -b.size / 2,
                marginTop: -b.size / 2,
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.25 }}
              animate={{
                opacity: [0, 1, 0.85],
                x: b.x,
                y: b.y,
                scale: [0.25, 1.25, 1],
                rotate: b.rotate,
              }}
              transition={{
                duration: 0.95,
                delay: b.delay,
                ease: EASE,
              }}
            >
              {b.kind === "heart" ? (
                <span style={{ color: b.fill, fontSize: b.size }}>♥</span>
              ) : (
                <SoftStar className="h-full w-full" fill={b.fill} />
              )}
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Hero — dominant QUIZ TIME! */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-3 pb-10 sm:px-6">
        <div className="relative flex w-full max-w-2xl flex-col items-center">
          {/* Torn paper — oversized */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 w-[min(108vw,36rem)] -translate-x-1/2 -translate-y-[54%]"
            initial={
              reduceMotion
                ? { opacity: 0.98, scale: 1 }
                : { opacity: 0, scale: 0.62, rotate: -2 }
            }
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: 0.04,
              type: "spring",
              stiffness: 240,
              damping: 14,
            }}
          >
            <TornPaperCloud className="h-auto w-full drop-shadow-[0_22px_44px_rgba(30,58,95,0.28)]" />
          </motion.div>

          <motion.h1
            className="relative z-10 text-center leading-[0.88] font-black tracking-tight uppercase"
            style={{
              fontSize: "clamp(4.75rem, 20vw, 8rem)",
            }}
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.55, y: 40 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 0.14,
                    type: "spring",
                    stiffness: 260,
                    damping: 12,
                  }
            }
          >
            {/* Layered paper / sticker letters */}
            <span
              className="block"
              style={{
                color: INK,
                textShadow: [
                  "3px 3px 0 #FFFFFF",
                  "-2px -2px 0 #FFFFFF",
                  "2px -2px 0 #FFFFFF",
                  "-2px 2px 0 #FFFFFF",
                  "0 4px 0 rgba(90,155,196,0.35)",
                  "0 14px 28px rgba(30,58,95,0.2)",
                ].join(", "),
              }}
            >
              Quiz
            </span>
            <span
              className="block"
              style={{
                color: INK_SOFT,
                textShadow: [
                  "3px 3px 0 #FFFFFF",
                  "-2px -2px 0 #FFFFFF",
                  "2px -2px 0 #FFFFFF",
                  "-2px 2px 0 #FFFFFF",
                  "0 4px 0 rgba(126,182,217,0.45)",
                  "0 14px 28px rgba(30,58,95,0.18)",
                ].join(", "),
              }}
            >
              Time!
            </span>
          </motion.h1>

          <motion.div
            className="relative z-10 mt-7 sm:mt-9"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.48,
              type: "spring",
              stiffness: 250,
              damping: 14,
            }}
          >
            <ReadyRibbon />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
