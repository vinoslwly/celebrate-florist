"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

/** Sky navy / paper palette — aligned with Scene 1. */
const INK = "#1E3A5F";
const INK_SOFT = "#4A6A8A";
const ACCENT = "#6BA3C9";
const CARD_BORDER = "#B8D4EA";
const CTA = "#1E3A5F";

type Bubble = {
  side: "left" | "right";
  text: string;
  icon: string;
  top: string;
  delay: number;
  hideOnMobile?: boolean;
};

const BUBBLES: Bubble[] = [
  {
    side: "left",
    icon: "❄️",
    text: "I have a surprise!",
    top: "14%",
    delay: 0.5,
  },
  {
    side: "left",
    icon: "💙",
    text: "Made with love...",
    top: "40%",
    delay: 0.7,
  },
  {
    side: "left",
    icon: "🎁",
    text: "A special gift is waiting...",
    top: "66%",
    delay: 0.9,
    hideOnMobile: true,
  },
  {
    side: "right",
    icon: "☁️",
    text: "A sweet surprise for you!",
    top: "18%",
    delay: 0.6,
  },
  {
    side: "right",
    icon: "⭐",
    text: "Just for you!",
    top: "44%",
    delay: 0.8,
    hideOnMobile: true,
  },
  {
    side: "right",
    icon: "✨",
    text: "Tap the blue doll…",
    top: "70%",
    delay: 1.0,
  },
];

const DRIFT = [
  { left: "8%", top: "16%", size: 10, delay: 0, duration: 7 },
  { left: "78%", top: "12%", size: 8, delay: 1.2, duration: 8 },
  { left: "14%", top: "72%", size: 9, delay: 0.6, duration: 6.5 },
  { left: "88%", top: "58%", size: 7, delay: 1.8, duration: 7.5 },
  { left: "42%", top: "8%", size: 6, delay: 2.2, duration: 9 },
  { left: "62%", top: "78%", size: 8, delay: 1.4, duration: 8.2 },
] as const;

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

function DenimStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <path
        d="M32 6 38.5 24.5 58 26 43 38.5 48 58 32 47.5 16 58 21 38.5 6 26 25.5 24.5Z"
        fill="#5B8FBA"
        stroke="#3A6A94"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="34"
        r="6"
        fill="#EEF4FA"
        stroke="#3A6A94"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Living blue doll tap target — clean SVG (no screenshot crop boxes). */
function BlueDoll({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="skyDollBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B8D8F0" />
          <stop offset="55%" stopColor="#8EBFDE" />
          <stop offset="100%" stopColor="#6BA3C9" />
        </linearGradient>
        <linearGradient id="skyDollBow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5B8FBA" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
        <pattern
          id="skyDollCheck"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="#EEF4FA" />
          <rect width="4" height="4" fill="#6BA3C9" />
          <rect x="4" y="4" width="4" height="4" fill="#6BA3C9" />
        </pattern>
        <filter id="skyDollShadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="5"
            floodColor="#1E3A5F"
            floodOpacity="0.28"
          />
        </filter>
      </defs>
      <g filter="url(#skyDollShadow)">
        {/* Ears */}
        <ellipse cx="38" cy="28" rx="14" ry="26" fill="url(#skyDollBody)" />
        <ellipse cx="82" cy="28" rx="14" ry="26" fill="url(#skyDollBody)" />
        <ellipse cx="38" cy="30" rx="8" ry="16" fill="url(#skyDollCheck)" />
        <ellipse cx="82" cy="30" rx="8" ry="16" fill="url(#skyDollCheck)" />
        {/* Head + body */}
        <ellipse cx="60" cy="52" rx="28" ry="26" fill="url(#skyDollBody)" />
        <ellipse cx="60" cy="92" rx="32" ry="34" fill="url(#skyDollBody)" />
        {/* Arms */}
        <ellipse
          cx="30"
          cy="92"
          rx="12"
          ry="18"
          fill="url(#skyDollBody)"
          transform="rotate(-18 30 92)"
        />
        <ellipse
          cx="90"
          cy="92"
          rx="12"
          ry="18"
          fill="url(#skyDollBody)"
          transform="rotate(18 90 92)"
        />
        {/* Feet */}
        <ellipse cx="46" cy="124" rx="14" ry="10" fill="url(#skyDollBody)" />
        <ellipse cx="74" cy="124" rx="14" ry="10" fill="url(#skyDollBody)" />
        {/* Face */}
        <ellipse cx="60" cy="56" rx="12" ry="9" fill="#F7FBFE" />
        <circle cx="49" cy="48" r="3.2" fill="#1E3A5F" />
        <circle cx="71" cy="48" r="3.2" fill="#1E3A5F" />
        <circle cx="50.2" cy="47" r="1" fill="#EEF4FA" />
        <circle cx="72.2" cy="47" r="1" fill="#EEF4FA" />
        <ellipse cx="60" cy="55" rx="3" ry="2.2" fill="#6BA3C9" />
        {/* Bow */}
        <path
          d="M48 68c-6-4-14-2-16 4 6 2 12 2 16-1 4 3 10 3 16 1-2-6-10-8-16-4Z"
          fill="url(#skyDollBow)"
        />
        <circle cx="60" cy="70" r="4" fill="#1E3A5F" />
        {/* Heart belly */}
        <circle cx="60" cy="94" r="14" fill="#F7FBFE" opacity="0.92" />
        <path
          d="M60 102c-6-5-10-8-10-12 0-3 2.5-5 5-5 1.8 0 3.4 1 5 3 1.6-2 3.2-3 5-3 2.5 0 5 2 5 5 0 4-4 7-10 12Z"
          fill="#5B8FBA"
        />
      </g>
    </svg>
  );
}

function SoftConfetti({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden>
      <rect
        x="2"
        y="2"
        width="8"
        height="8"
        rx="1.5"
        fill="#7EB6D9"
        opacity="0.75"
        transform="rotate(18 6 6)"
      />
    </svg>
  );
}

/**
 * sky.moments.gift-box — living recreation of Founder Scene 2.
 * Mirrors Bloom Moments gift-box hierarchy; tap blue doll advances.
 */
export function SkyGiftBoxScene({ payload, onComplete }: SkyMomentsSceneProps) {
  const name = payload.experience.greeting_name;
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className={cn(SCENE_VIEWPORT_SCROLL, "bg-[#E8F2FA]")}>
      {/* Soft sky plane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 28%, #F7FBFE 0%, #E8F2FA 42%, #D6E8F5 72%, #C5DCEF 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255,255,255,0.55) 0%, transparent 70%)",
        }}
        animate={
          reduceMotion ? { opacity: 0.55 } : { opacity: [0.35, 0.7, 0.4] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Soft cloud blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {[
          { top: "6%", left: "-4%", size: "38%" },
          { top: "12%", right: "-6%", size: "34%" },
          { bottom: "8%", left: "10%", size: "28%" },
          { bottom: "4%", right: "4%", size: "32%" },
        ].map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: "top" in cloud ? cloud.top : undefined,
              bottom: "bottom" in cloud ? cloud.bottom : undefined,
              left: "left" in cloud ? cloud.left : undefined,
              right: "right" in cloud ? cloud.right : undefined,
              width: cloud.size,
              height: cloud.size,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)",
              filter: "blur(18px)",
            }}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.04, 1] }
            }
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.25,
            }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-3 left-3 opacity-80 sm:top-5 sm:left-6"
      >
        <DenimStar className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-4 right-4 opacity-70 sm:top-6 sm:right-8"
      >
        <SkyPlantMark className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-5 opacity-55 sm:bottom-10 sm:left-10"
      >
        <SkyPlantMark className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>

      {/* Drift confetti */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {DRIFT.map((bit, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: bit.left,
                top: bit.top,
                width: bit.size,
                height: bit.size,
              }}
              animate={{
                opacity: [0.2, 0.75, 0.2],
                y: [0, -12, 0],
                x: [0, i % 2 === 0 ? 8 : -8, 0],
                rotate: [0, 20, -12, 0],
              }}
              transition={{
                duration: bit.duration,
                delay: bit.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SoftConfetti className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <motion.header
          className="mb-5 text-center sm:mb-6"
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1
            className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: INK }}
          >
            For {name}
          </h1>
          <div
            className="mt-3 flex items-center justify-center gap-3"
            style={{ color: ACCENT }}
          >
            <span className="h-px w-12 bg-current sm:w-16" aria-hidden />
            <SkyPlantMark className="h-4 w-4" />
            <span className="h-px w-12 bg-current sm:w-16" aria-hidden />
          </div>
          <p
            className="mt-3 font-serif text-sm sm:text-base"
            style={{ color: INK_SOFT }}
          >
            — a sweet surprise is waiting for you —
          </p>
        </motion.header>

        <div className="relative mx-auto w-full max-w-md">
          {/* Desktop side bubbles */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            aria-hidden
          >
            {BUBBLES.map((bubble) => (
              <motion.div
                key={`${bubble.side}-${bubble.text}`}
                className={cn(
                  "absolute rounded-full border border-[#B8D4EA]/70 bg-white/95 px-3 py-2 text-xs shadow-[0_8px_20px_-10px_rgba(30,58,95,0.28)]",
                  bubble.side === "left"
                    ? "right-[calc(100%+0.75rem)]"
                    : "left-[calc(100%+0.75rem)]",
                )}
                style={{ top: bubble.top }}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: bubble.side === "left" ? -16 : 16 }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                  y: reduceMotion ? 0 : [0, -5, 0],
                }}
                transition={{
                  opacity: { delay: bubble.delay, duration: 0.4 },
                  x: { delay: bubble.delay, duration: 0.45 },
                  y: {
                    delay: bubble.delay + 0.5,
                    duration: 4 + bubble.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <span
                  className="whitespace-nowrap font-serif"
                  style={{ color: INK_SOFT }}
                >
                  {bubble.text} <span aria-hidden>{bubble.icon}</span>
                </span>
              </motion.div>
            ))}
          </div>

          <motion.article
            className="relative flex flex-col overflow-visible rounded-2xl bg-white/95 px-5 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-5"
            style={{
              border: `1.5px dashed ${CARD_BORDER}`,
              boxShadow:
                "0 22px 55px -18px rgba(30,58,95,0.28), inset 0 0 0 1px rgba(184,212,234,0.35)",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex flex-col items-center px-1 text-center">
              <SkyPlantMark className="mb-2 h-6 w-6" />
              <p
                className="text-[10px] font-semibold tracking-[0.22em] uppercase"
                style={{ color: ACCENT }}
              >
                {"A special gift for you"}
              </p>
              <h2
                className="mt-2 font-serif text-2xl font-semibold sm:text-3xl"
                style={{ color: INK }}
              >
                A Special Surprise!
              </h2>
              <span
                className="mt-2 text-sm"
                style={{ color: ACCENT }}
                aria-hidden
              >
                ♥
              </span>
              <p
                className="mt-3 max-w-xs font-serif text-sm leading-relaxed italic sm:text-[15px]"
                style={{ color: INK_SOFT }}
              >
                A joyful little surprise has been prepared just for you. Open
                this to reveal a sweet message full of warmth and happiness…
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 pl-[10%] sm:mt-6 sm:gap-3 sm:pl-[12%]">
              <p
                className="max-w-[13rem] text-left text-[10px] leading-snug font-bold tracking-[0.1em] uppercase sm:max-w-[15rem] sm:text-xs sm:tracking-[0.12em]"
                style={{ color: CTA }}
              >
                Tap the blue doll to unwrap{" "}
                <motion.span
                  aria-hidden
                  className="inline-block text-base leading-none sm:text-lg"
                  animate={reduceMotion ? undefined : { x: [0, 5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  👉
                </motion.span>{" "}
                <span aria-hidden>★</span>
              </p>

              <motion.button
                type="button"
                aria-label="Tap the blue doll to unwrap"
                onClick={onComplete}
                className="-mr-1 shrink-0 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none sm:-mr-2"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ opacity: { duration: 0.45, delay: 0.3 } }}
              >
                <motion.span
                  className="block"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, -5, 0],
                          rotate: [0, -2, 2, 0],
                        }
                  }
                  transition={{
                    duration: 3.2,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <BlueDoll className="h-[6.25rem] w-auto sm:h-[7.25rem]" />
                </motion.span>
              </motion.button>
            </div>
          </motion.article>
        </div>

        {/* Mobile bubbles */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 px-1 lg:hidden">
          {BUBBLES.filter((b) => !b.hideOnMobile).map((bubble, i) => (
            <motion.span
              key={bubble.text}
              className="rounded-full border border-[#B8D4EA]/70 bg-white/95 px-3 py-1.5 text-[11px] font-serif shadow-sm"
              style={{ color: INK_SOFT }}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
            >
              {bubble.text} <span aria-hidden>{bubble.icon}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
