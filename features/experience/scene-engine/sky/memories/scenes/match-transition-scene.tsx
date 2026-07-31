"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const GOLD = "#FFE8A0";
const ROSE = "#FF8FAB";
const EASE = [0.22, 1, 0.36, 1] as const;

/** One-shot celebratory burst — stars + hearts + tiny cards, capped for mobile. */
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
    fill: ROSE,
  },
  {
    x: 116,
    y: 64,
    rotate: 20,
    delay: 0.18,
    size: 16,
    kind: "heart" as const,
    fill: ROSE,
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
] as const;

const TWINKLE = [
  { top: "11%", left: "18%", size: 10, delay: 0.2, fill: GOLD },
  { top: "15%", right: "16%", size: 12, delay: 0.35, fill: "#FFFFFF" },
  { top: "62%", left: "8%", size: 9, delay: 0.45, fill: SKY },
  { top: "58%", right: "10%", size: 11, delay: 0.5, fill: GOLD },
] as const;

const DOODLES = [
  { top: "34%", left: "4%", rotate: -18, label: "✦" },
  { top: "38%", right: "5%", rotate: 22, label: "✧" },
  { bottom: "34%", left: "12%", rotate: 8, label: "✦" },
  { bottom: "36%", right: "14%", rotate: -12, label: "✧" },
] as const;

/** Floating scrapbook memory cards — richer faces, spring-in. */
const FLOAT_CARDS = [
  {
    className:
      "absolute top-[7%] left-[1%] w-[5.2rem] rotate-[-18deg] sm:left-[5%] sm:top-[8%] sm:w-[6.4rem]",
    delay: 0.12,
    motif: "balloon" as const,
  },
  {
    className:
      "absolute top-[9%] right-[0%] w-[5rem] rotate-[16deg] sm:right-[4%] sm:top-[10%] sm:w-[6.2rem]",
    delay: 0.18,
    motif: "star" as const,
  },
  {
    className:
      "absolute bottom-[9%] left-[2%] w-[5.1rem] rotate-[12deg] sm:bottom-[11%] sm:left-[7%] sm:w-[6.3rem]",
    delay: 0.36,
    motif: "cloud" as const,
  },
  {
    className:
      "absolute right-[1%] bottom-[8%] w-[5.2rem] rotate-[-14deg] sm:right-[6%] sm:bottom-[10%] sm:w-[6.4rem]",
    delay: 0.32,
    motif: "check" as const,
  },
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

/** Soft fabric balloon — sky scrapbook motif. */
function SoftBalloon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 80" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="skyMemBalloon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B8DCF0" />
          <stop offset="45%" stopColor={SKY} />
          <stop offset="100%" stopColor={SKY_DEEP} />
        </linearGradient>
      </defs>
      <ellipse
        cx="28"
        cy="30"
        rx="20"
        ry="26"
        fill="url(#skyMemBalloon)"
        stroke="white"
        strokeWidth="2"
      />
      <ellipse cx="22" cy="22" rx="6" ry="9" fill="white" opacity="0.4" />
      <path
        d="M28 56 L24 74 M28 56 L32 74"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M28 56 L28 58"
        stroke={INK_SOFT}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="18" r="2" fill={GOLD} opacity="0.85" />
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

function MemoriesRibbon({ className }: { className?: string }) {
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
        className="relative rounded-lg px-5 py-3 sm:px-7 sm:py-3.5"
        style={{
          background: `linear-gradient(180deg, ${SKY} 0%, ${SKY_DEEP} 100%)`,
          boxShadow:
            "0 14px 28px -10px rgba(30,58,95,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <p className="font-serif text-[13px] tracking-wide text-white sm:text-base">
          Let the memories begin{" "}
          <span aria-hidden className="inline-block text-[#FF8FAB]">
            ♥
          </span>
        </p>
      </div>
    </div>
  );
}

function MemoryCardFace({
  motif,
}: {
  motif: "balloon" | "star" | "cloud" | "check";
}) {
  if (motif === "check") {
    return (
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.7rem]"
        style={{
          background: `linear-gradient(155deg, ${SKY} 0%, ${SKY_DEEP} 55%, #3D7AAD 100%)`,
          border: "2px solid rgba(255,255,255,0.85)",
          boxShadow:
            "0 16px 36px -12px rgba(30,58,95,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#FFFFFF 0 7px,transparent 7px 14px), repeating-linear-gradient(90deg,#FFFFFF 0 7px,transparent 7px 14px)",
          }}
        />
        <div className="absolute inset-[9%] rounded-[0.4rem] border border-dashed border-white/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FivePointStar
            className="h-10 w-10 drop-shadow-md sm:h-12 sm:w-12"
            fill="white"
          />
        </div>
      </div>
    );
  }

  const motifNode =
    motif === "balloon" ? (
      <SoftBalloon className="h-[62%] w-[62%] drop-shadow-sm" />
    ) : motif === "star" ? (
      <FivePointStar
        className="h-11 w-11 drop-shadow-sm sm:h-14 sm:w-14"
        fill={GOLD}
      />
    ) : (
      <SoftCloud className="h-12 w-24 opacity-95 sm:h-14 sm:w-28" />
    );

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.7rem]"
      style={{
        background:
          "linear-gradient(165deg, #FFFEFB 0%, #F4F9FC 48%, #E8F2FA 100%)",
        border: "2px solid rgba(255,255,255,0.95)",
        boxShadow:
          "0 16px 36px -12px rgba(30,58,95,0.4), inset 0 0 0 1px rgba(126,182,217,0.35)",
      }}
    >
      <div
        className="absolute inset-[9%] rounded-[0.4rem] border border-dashed opacity-55"
        style={{ borderColor: SKY }}
      />
      <span
        className="absolute top-2 left-2 text-[10px]"
        style={{ color: SKY_DEEP }}
        aria-hidden
      >
        ✦
      </span>
      <span
        className="absolute right-2 bottom-2 text-[10px]"
        style={{ color: SKY_DEEP }}
        aria-hidden
      >
        ✦
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        {motifNode}
      </div>
    </div>
  );
}

/**
 * sky.memories.match-transition — scrapbook “MEMORY MATCH!” celebration.
 * Parity with Sky Connection QUIZ TIME! (heboh + mewah + emotional).
 * Auto-advance; no CTA. Mobile-light: CSS/SVG, capped particles.
 */
export function SkyMemoriesMatchTransitionScene(_props: SkyMemoriesSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={SCENE_VIEWPORT_LOCK}
      style={{ background: "#8EBFDE" }}
      role="status"
      aria-live="polite"
      aria-label="Memory Match"
    >
      {/* Bright sky + warm sun flare — same luxury as QUIZ TIME! */}
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

      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-8 -left-8 h-48 w-48 rounded-full sm:h-56 sm:w-56"
          style={{
            background:
              "conic-gradient(from 200deg at 40% 40%, rgba(255,248,220,0.55), transparent 18%, rgba(255,248,220,0.35) 22%, transparent 40%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      ) : null}

      {/* Dense cloud band */}
      <SoftCloud className="pointer-events-none absolute top-[2%] left-[-8%] h-16 w-44 opacity-85 sm:h-20 sm:w-52" />
      <SoftCloud className="pointer-events-none absolute top-[6%] right-[-6%] h-14 w-40 opacity-75 -scale-x-100" />
      <SoftCloud className="pointer-events-none absolute bottom-[-2%] left-[-4%] h-20 w-52 opacity-90 sm:h-24 sm:w-60" />
      <SoftCloud className="pointer-events-none absolute right-[-2%] bottom-[-1%] h-[4.5rem] w-48 opacity-85 -scale-x-100 sm:h-[5.5rem] sm:w-56" />
      <SoftCloud className="pointer-events-none absolute bottom-[8%] left-[28%] h-12 w-36 opacity-55" />

      {/* Expanding celebration rings — 2 only */}
      {!reduceMotion
        ? [0, 1].map((i) => (
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
              initial={{ opacity: 0.7, scale: 0.35 }}
              animate={{ opacity: 0, scale: 3.6 + i * 0.4 }}
              transition={{
                duration: 1.15,
                delay: 0.04 + i * 0.12,
                ease: EASE,
              }}
            />
          ))
        : null}

      {/* Soft bloom behind hero — opacity only (no huge scale thrash) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(184,220,240,0.45) 40%, transparent 70%)",
        }}
        initial={reduceMotion ? { opacity: 0.7 } : { opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 0.7, ease: EASE }}
      />

      {/* Soft balloons — one-shot entrance, no float loops */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[6%] left-[4%] z-[5] sm:top-[8%] sm:left-[9%]"
        initial={
          reduceMotion ? false : { opacity: 0, y: 20, scale: 0.7, rotate: -12 }
        }
        animate={{ opacity: 1, y: 0, scale: 1, rotate: -6 }}
        transition={{ delay: 0.12, duration: 0.45, ease: EASE }}
      >
        <SoftBalloon className="h-16 w-12 drop-shadow-lg sm:h-20 sm:w-14" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[10%] right-[6%] z-[5] sm:top-[12%] sm:right-[10%]"
        initial={
          reduceMotion ? false : { opacity: 0, y: 18, scale: 0.7, rotate: 10 }
        }
        animate={{ opacity: 0.92, y: 0, scale: 1, rotate: 8 }}
        transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
      >
        <SoftBalloon className="h-12 w-9 drop-shadow-md opacity-90 sm:h-14 sm:w-11" />
      </motion.div>

      {/* Speech bubbles */}
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

      {/* Crown star above MEMORY */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[24%] left-1/2 z-[9] -translate-x-1/2 sm:top-[22%]"
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
          fill={GOLD}
        />
      </motion.div>

      {/* Twinkle sparkles — one-shot pop, then static */}
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
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ delay: t.delay, duration: 0.35, ease: EASE }}
            >
              <SoftStar className="h-full w-full" fill={t.fill} />
            </motion.span>
          ))
        : null}

      {/* Hand-drawn doodles */}
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

      {/* Floating memory cards — scrapbook energy */}
      {FLOAT_CARDS.map((card, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none z-[8] ${card.className}`}
          initial={
            reduceMotion ? false : { opacity: 0, y: 40, scale: 0.55, rotate: 0 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: reduceMotion ? 0 : card.delay,
            type: "spring",
            stiffness: 250,
            damping: 14,
          }}
        >
          <MemoryCardFace motif={card.motif} />
        </motion.div>
      ))}

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

      {/* Hero — dominant MEMORY MATCH! (Quiz Time parity) */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-3 pb-10 sm:px-6">
        <div className="relative flex w-full max-w-2xl flex-col items-center">
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
              fontSize: "clamp(3.6rem, 16vw, 7rem)",
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
              Memory
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
              Match!
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
            <MemoriesRibbon />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
