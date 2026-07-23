"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

const BG = "#3A080C";
const CREAM = "#FFF9F2";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E8C878";
const ROSE = "#A51C28";
const ROSE_DEEP = "#6B0F16";
const INK_SOFT = "#5C3535";

const EASE = [0.22, 1, 0.36, 1] as const;

function GoldHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 16" className={className} aria-hidden>
      <defs>
        <linearGradient id="miHeart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF4C8" />
          <stop offset="50%" stopColor={GOLD_SOFT} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>
      <path
        d="M9 14.5 C3.2 10.2 1.2 7.4 2.4 4.9 C3.2 3.2 5.6 2.9 9 5.2 C12.4 2.9 14.8 3.2 15.6 4.9 C16.8 7.4 14.8 10.2 9 14.5Z"
        fill="url(#miHeart)"
        stroke="#B8922A"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function OrnamentRule({ className }: { className?: string }) {
  return (
    <div
      className={`flex w-full max-w-[14rem] items-center gap-2.5 ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
        }}
      />
      <GoldHeart className="h-3.5 w-3.5 shrink-0" />
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }}
      />
    </div>
  );
}

/** Ornate padlock — gold + crimson (unlock surprise). */
function PremiumLock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 96" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="miLockGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4C8" />
          <stop offset="40%" stopColor={GOLD_SOFT} />
          <stop offset="100%" stopColor="#A67C1A" />
        </linearGradient>
        <linearGradient id="miLockBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C42838" />
          <stop offset="100%" stopColor={ROSE_DEEP} />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="90" rx="20" ry="3.5" fill="#3A080C" opacity="0.12" />
      {/* Shackle */}
      <path
        d="M24 42 V30 C24 18 30 12 40 12 C50 12 56 18 56 30 V42"
        stroke="url(#miLockGold)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 42 V30 C24 18 30 12 40 12 C50 12 56 18 56 30 V42"
        stroke="#FFF8D8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      {/* Body */}
      <rect
        x="16"
        y="40"
        width="48"
        height="42"
        rx="8"
        fill="url(#miLockBody)"
        stroke={GOLD}
        strokeWidth="1.8"
      />
      <rect
        x="20"
        y="44"
        width="40"
        height="34"
        rx="5"
        fill="none"
        stroke="rgba(255,244,200,0.28)"
        strokeWidth="1"
      />
      {/* Keyhole */}
      <circle cx="40" cy="58" r="6.5" fill="#2A060A" />
      <circle cx="40" cy="58" r="3.2" fill={GOLD_SOFT} opacity="0.85" />
      <path
        d="M40 60 L40 74"
        stroke="#2A060A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M40 62 L40 72"
        stroke={GOLD_SOFT}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

/** Ornate key — champagne gold. */
function PremiumKey({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 96" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="miKeyGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF8D8" />
          <stop offset="35%" stopColor={GOLD_SOFT} />
          <stop offset="100%" stopColor="#8F6A14" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="90" rx="18" ry="3" fill="#3A080C" opacity="0.1" />
      {/* Bow */}
      <circle
        cx="40"
        cy="24"
        r="14"
        fill="url(#miKeyGold)"
        stroke="#B8922A"
        strokeWidth="1.2"
      />
      <circle cx="40" cy="24" r="6.5" fill="#FFF9F2" />
      <circle
        cx="40"
        cy="24"
        r="4"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.2"
        opacity="0.7"
      />
      {/* Shaft */}
      <rect
        x="36.5"
        y="36"
        width="7"
        height="40"
        rx="2"
        fill="url(#miKeyGold)"
      />
      {/* Teeth */}
      <path
        d="M43.5 62 H54 V68 H43.5 Z"
        fill="url(#miKeyGold)"
        stroke="#B8922A"
        strokeWidth="0.6"
      />
      <path
        d="M43.5 72 H50 V78 H43.5 Z"
        fill="url(#miKeyGold)"
        stroke="#B8922A"
        strokeWidth="0.6"
      />
      {/* Highlight */}
      <path
        d="M38 40 L38 72"
        stroke="#FFF8D8"
        strokeWidth="1.2"
        opacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill={ROSE}
        opacity="0.9"
      />
      <path
        d="M12 6C10 12 8 16 10 22"
        stroke="#F5C8C8"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

function MemoryFrame({
  children,
  rotate,
}: {
  children: ReactNode;
  rotate: number;
}) {
  return (
    <div
      className="relative w-[6.25rem] bg-[#FFFEFA] p-1.5 pb-5 shadow-[0_14px_32px_-14px_rgba(40,8,12,0.5)] sm:w-[7.25rem] sm:p-2 sm:pb-6"
      style={{
        transform: `rotate(${rotate}deg)`,
        border: `1px solid rgba(201,162,74,0.45)`,
      }}
    >
      <div
        className="flex aspect-square items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #FFFBF5 0%, #F5EBE0 100%)",
          boxShadow: "inset 0 0 0 1px rgba(165,28,40,0.12)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * warm.memories.match-intro — Scene 5 (redesigned).
 * Luxury stationery card on crimson field — living SVG, no Canva plate.
 * Enter animations only (mobile-safe).
 */
export function WarmMemoriesMatchIntroScene({
  onComplete,
}: WarmMemoriesSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{ backgroundColor: BG }}
      data-scene="warm.memories.match-intro"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 90% 70% at 50% 28%, #8B1A22 0%, transparent 55%)",
            "radial-gradient(ellipse 80% 60% at 15% 80%, rgba(201,162,74,0.12) 0%, transparent 50%)",
            "radial-gradient(ellipse 100% 80% at 85% 95%, #120204 0%, transparent 45%)",
            "linear-gradient(160deg, #5A1018 0%, #3A080C 48%, #1E0508 100%)",
          ].join(", "),
        }}
      />

      {/* Soft vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 40%, rgba(20,4,8,0.45) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
        <motion.article
          className="relative w-full max-w-[22rem] sm:max-w-md"
          initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.55,
            ease: EASE,
            type: reduceMotion ? undefined : "spring",
            stiffness: 200,
            damping: 18,
          }}
        >
          {/* Soft gold glow behind card */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[90%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-[2rem]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(232,200,120,0.28) 0%, transparent 70%)",
              filter: "blur(18px)",
            }}
          />

          {/* Luxury stationery plate — clean rounded card, gold rim */}
          <div
            className="relative overflow-hidden rounded-[1.35rem] px-5 pt-8 pb-7 sm:rounded-[1.5rem] sm:px-8 sm:pt-10 sm:pb-9"
            style={{
              background: `linear-gradient(165deg, #FFFEFA 0%, ${CREAM} 42%, #F3E6D6 100%)`,
              boxShadow: [
                `0 0 0 1.5px ${GOLD}`,
                "0 0 0 4px rgba(255,248,240,0.35)",
                "0 28px 56px -22px rgba(20,4,8,0.65)",
                "inset 0 1px 0 rgba(255,255,255,0.85)",
              ].join(", "),
            }}
          >
            {/* Inner gold hairline */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-[1rem] sm:inset-3.5"
              style={{ border: "1px solid rgba(201,162,74,0.35)" }}
            />

            <div className="relative z-[1] flex flex-col items-center text-center">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.4 }}
              >
                <OrnamentRule className="mb-4" />
              </motion.div>

              <motion.h1
                className="max-w-[17.5rem] font-serif text-[1.65rem] leading-[1.22] font-semibold tracking-tight sm:max-w-[19rem] sm:text-[1.95rem]"
                style={{
                  color: ROSE_DEEP,
                  textShadow: "0 1px 0 rgba(255,255,255,0.5)",
                }}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.18, duration: 0.5 }}
              >
                Some memories are waiting to be found.
              </motion.h1>

              {/* Polaroid pair */}
              <motion.div
                className="relative mt-7 mb-2 flex items-end justify-center gap-1 sm:mt-8 sm:gap-2"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduceMotion ? 0 : 0.28,
                  type: "spring",
                  stiffness: 230,
                  damping: 16,
                }}
              >
                <motion.div
                  initial={reduceMotion ? false : { rotate: -16, x: -24 }}
                  animate={{ rotate: 0, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.32,
                    type: "spring",
                    stiffness: 250,
                    damping: 15,
                  }}
                >
                  <MemoryFrame rotate={-7}>
                    <PremiumLock className="h-[82%] w-[72%]" />
                  </MemoryFrame>
                </motion.div>

                <motion.div
                  className="absolute bottom-[42%] z-20"
                  aria-hidden
                  initial={reduceMotion ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.5,
                    type: "spring",
                    stiffness: 360,
                    damping: 12,
                  }}
                >
                  <svg viewBox="0 0 32 28" className="h-7 w-8 drop-shadow-sm">
                    <path
                      d="M16 25 C5 16 2.5 10 5 5.5 C7 2.5 12 2.2 16 7.5 C20 2.2 25 2.5 27 5.5 C29.5 10 27 16 16 25Z"
                      fill={ROSE}
                      stroke={ROSE_DEEP}
                      strokeWidth="0.9"
                    />
                  </svg>
                </motion.div>

                <motion.div
                  initial={reduceMotion ? false : { rotate: 16, x: 24 }}
                  animate={{ rotate: 0, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.38,
                    type: "spring",
                    stiffness: 250,
                    damping: 15,
                  }}
                >
                  <MemoryFrame rotate={7}>
                    <PremiumKey className="h-[84%] w-[74%]" />
                  </MemoryFrame>
                </motion.div>

                {/* Soft petals near frames — static */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1 left-[8%] h-5 w-4 rotate-[-30deg] opacity-85"
                >
                  <SoftPetal className="h-full w-full" />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-[10%] bottom-0 h-4 w-3 rotate-[24deg] opacity-80"
                >
                  <SoftPetal className="h-full w-full" />
                </div>
              </motion.div>

              <motion.p
                className="mt-5 max-w-[16.5rem] font-serif text-[0.98rem] leading-relaxed sm:mt-6 sm:max-w-xs sm:text-[1.05rem]"
                style={{ color: INK_SOFT }}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.48, duration: 0.4 }}
              >
                Match every memory to{" "}
                <span className="font-semibold" style={{ color: ROSE }}>
                  unlock your surprise
                </span>
                .
              </motion.p>

              <motion.div
                className="mt-3"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.55, duration: 0.35 }}
              >
                <OrnamentRule />
              </motion.div>

              <motion.button
                type="button"
                onClick={onComplete}
                aria-label="Start memory match"
                className="relative mt-6 flex w-full max-w-[15.5rem] items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 font-serif text-lg font-semibold focus-visible:ring-2 focus-visible:ring-[#C9A24A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F2] focus-visible:outline-none sm:mt-7 sm:max-w-[16.5rem] sm:py-4 sm:text-xl"
                style={{
                  background: `linear-gradient(105deg, #5A0E14 0%, ${ROSE} 42%, #B81E2C 78%, #C9A227 145%)`,
                  color: CREAM,
                  boxShadow: [
                    "0 16px 32px -12px rgba(80,12,20,0.6)",
                    "0 0 24px -8px rgba(201,162,74,0.4)",
                    "inset 0 1px 0 rgba(255,248,240,0.28)",
                  ].join(", "),
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.58, duration: 0.4 }}
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              >
                {!reduceMotion ? (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/22 to-transparent"
                    initial={{ left: "-40%" }}
                    animate={{ left: ["-40%", "120%"] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1.2,
                    }}
                  />
                ) : null}
                <span className="relative">Start</span>
                <span className="relative" aria-hidden>
                  →
                </span>
              </motion.button>
            </div>
          </div>

          {/* Tiny corner petals outside card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-2 -left-1 h-7 w-5 rotate-[-40deg] opacity-75 sm:h-8 sm:w-6"
          >
            <SoftPetal className="h-full w-full" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-1 top-8 h-6 w-4 rotate-[28deg] opacity-70 sm:h-7 sm:w-5"
          >
            <SoftPetal className="h-full w-full" />
          </div>
        </motion.article>
      </div>
    </div>
  );
}
