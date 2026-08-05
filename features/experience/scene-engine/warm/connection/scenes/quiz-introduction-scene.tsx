"use client";

import type { CSSProperties } from "react";

import { motion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import {
  allowAmbientLoop,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";

const BG = "#3A080C";
const CREAM = "#FFF5EC";
const GOLD = "#C9A227";
const GOLD_SOFT = "#F0D878";
const ROSE = "#8B1A22";

const EASE = [0.22, 1, 0.36, 1] as const;

const DRIFT_PETALS = [
  { top: "10%", left: "6%", size: 16, rotate: -18, opacity: 0.7 },
  { top: "16%", left: "82%", size: 14, rotate: 22, opacity: 0.6 },
  { top: "38%", left: "4%", size: 15, rotate: 10, opacity: 0.55 },
  { top: "48%", left: "90%", size: 18, rotate: -14, opacity: 0.65 },
  { top: "72%", left: "12%", size: 13, rotate: 26, opacity: 0.5 },
  { top: "78%", left: "78%", size: 15, rotate: -20, opacity: 0.55 },
  { top: "28%", left: "48%", size: 11, rotate: -8, opacity: 0.4 },
] as const;

const FALL_PETALS = [
  { left: "12%", delay: "0s", duration: "8.5s", size: 14, drift: "12px" },
  { left: "36%", delay: "2s", duration: "9.5s", size: 12, drift: "-10px" },
  { left: "58%", delay: "1s", duration: "8s", size: 16, drift: "14px" },
  { left: "80%", delay: "3.2s", duration: "9s", size: 13, drift: "-12px" },
  { left: "48%", delay: "4s", duration: "10s", size: 11, drift: "8px" },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#C42838"
        opacity="0.92"
      />
      <path
        d="M12 6C10 12 8 16 10 22"
        stroke="#F0D0D0"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

/** Gold heart padlock — Founder Scene 5 motif on the gift. */
function HeartLock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="warmHeartLock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D878" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A67C1A" />
        </linearGradient>
      </defs>
      <path
        d="M28 58 C10 44 4 32 8 22 C11 14 20 12 28 20 C36 12 45 14 48 22 C52 32 46 44 28 58Z"
        fill="url(#warmHeartLock)"
        stroke="#8F6A14"
        strokeWidth="1.2"
      />
      <path
        d="M22 30 h12 v14 H22z"
        fill="none"
        stroke="#4A1820"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M25 30 v-3.5 a3 3 0 0 1 6 0 V30"
        fill="none"
        stroke="#4A1820"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="28" cy="37" r="1.5" fill="#4A1820" opacity="0.8" />
    </svg>
  );
}

/**
 * warm.connection.quiz-introduction — living Founder Scene 5.
 * Bloom Scene 5 structure (title → gift → unlock copy → Start) + Warm crimson
 * densitas emosional: petals, sparkles, gold heart lock.
 */
export function WarmConnectionQuizIntroductionScene({
  onComplete,
}: WarmConnectionSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ backgroundColor: BG }}>
      <style>{`
        @keyframes wqi-petal-fall {
          0% { transform: translate3d(0, -8%, 0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.9; }
          88% { opacity: 0.85; }
          100% { transform: translate3d(var(--wqi-drift), 112vh, 0) rotate(55deg); opacity: 0; }
        }
        @keyframes wqi-glow-breathe {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.94); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes wqi-gift-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
        }
        @keyframes wqi-sparkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes wqi-lock-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wqi-anim-fall, .wqi-anim-glow, .wqi-anim-float, .wqi-anim-sparkle, .wqi-anim-lock {
            animation: none !important;
          }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 95% 70% at 50% 38%, #6B141C 0%, transparent 58%)",
            "radial-gradient(ellipse 120% 90% at 50% 110%, #120204 0%, transparent 50%)",
            "linear-gradient(165deg, #5A121A 0%, #3A080C 42%, #220508 100%)",
          ].join(", "),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Emotional bloom behind gift */}
      <div
        aria-hidden
        className="wqi-anim-glow pointer-events-none absolute top-[44%] left-1/2 h-[58vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(240,216,120,0.28) 0%, rgba(165,28,40,0.45) 38%, transparent 70%)",
          animation: reduceMotion
            ? undefined
            : "wqi-glow-breathe 3.2s ease-in-out infinite",
          willChange: reduceMotion ? undefined : "transform, opacity",
        }}
      />

      {/* Static drift petals */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {DRIFT_PETALS.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size * 1.35,
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <SoftPetal className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* CSS falling petals */}
      {allowAmbientLoop(reduceMotion) ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALL_PETALS.map((petal, i) => (
            <div
              key={i}
              className="wqi-anim-fall absolute"
              style={
                {
                  left: petal.left,
                  top: 0,
                  width: petal.size,
                  height: petal.size * 1.35,
                  ["--wqi-drift"]: petal.drift,
                  animation: `wqi-petal-fall ${petal.duration} linear ${petal.delay} infinite`,
                  willChange: "transform, opacity",
                } as CSSProperties
              }
            >
              <SoftPetal className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Sparkles + hearts near gift */}
      {allowAmbientLoop(reduceMotion) ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            { top: "38%", left: "24%", size: 4, delay: "0s" },
            { top: "34%", left: "72%", size: 5, delay: "0.5s" },
            { top: "52%", left: "28%", size: 4, delay: "1s" },
            { top: "48%", left: "74%", size: 3.5, delay: "0.3s" },
            { top: "42%", left: "50%", size: 3, delay: "0.8s" },
          ].map((s, i) => (
            <span
              key={i}
              className="wqi-anim-sparkle absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                backgroundColor: GOLD_SOFT,
                boxShadow: `0 0 10px ${GOLD}`,
                animation: `wqi-sparkle 2.4s ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
          {[
            { top: "40%", left: "18%" },
            { top: "46%", left: "80%" },
          ].map((h, i) => (
            <span
              key={`h-${i}`}
              className="wqi-anim-sparkle absolute text-base sm:text-lg"
              style={{
                top: h.top,
                left: h.left,
                color: "rgba(240,168,180,0.7)",
                animation: `wqi-sparkle 2.8s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              ♡
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center px-5 pt-12 pb-8 sm:px-10 sm:pt-14 sm:pb-10">
        <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-between gap-4">
          <div className="flex w-full flex-col items-center">
            <motion.div
              className="mb-3 flex items-center gap-3"
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span
                className="h-px w-10 sm:w-14"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GOLD})`,
                }}
              />
              <span style={{ color: GOLD_SOFT }} className="text-sm">
                ♡
              </span>
              <span
                className="h-px w-10 sm:w-14"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                }}
              />
            </motion.div>

            <motion.h1
              className="text-center font-serif text-[2rem] leading-[1.15] font-semibold tracking-tight sm:text-[2.65rem]"
              style={{
                color: CREAM,
                textShadow: "0 8px 28px rgba(20,4,8,0.45)",
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              How well do you know me?
            </motion.h1>
          </div>

          <motion.div
            className="relative my-1 flex shrink-0 items-center justify-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.86, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.18,
              type: "spring",
              stiffness: 210,
              damping: 16,
            }}
          >
            <div
              className="wqi-anim-float relative"
              style={{
                animation: reduceMotion
                  ? undefined
                  : "wqi-gift-float 3.4s ease-in-out 0.7s infinite",
                willChange: reduceMotion ? undefined : "transform",
              }}
            >
              <WarmGiftBox
                variant="closed"
                reduceMotion={reduceMotion}
                className="relative h-[11.5rem] w-[11rem] sm:h-56 sm:w-[13.5rem]"
              />
              <div
                className="wqi-anim-lock pointer-events-none absolute bottom-[18%] left-1/2 -translate-x-1/2"
                style={{
                  animation: reduceMotion
                    ? undefined
                    : "wqi-lock-pulse 2s ease-in-out 1",
                }}
              >
                <HeartLock className="h-12 w-11 drop-shadow-lg sm:h-14 sm:w-12" />
              </div>
            </div>
          </motion.div>

          <div className="flex w-full flex-col items-center">
            <motion.div
              className="mb-3 flex items-center gap-2"
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <span
                className="h-px w-8"
                style={{ background: GOLD, opacity: 0.7 }}
              />
              <span
                className="h-1.5 w-1.5 rotate-45"
                style={{ background: GOLD }}
              />
              <span
                className="h-px w-8"
                style={{ background: GOLD, opacity: 0.7 }}
              />
            </motion.div>

            <motion.p
              className="max-w-[19rem] text-center font-serif text-[1.05rem] leading-relaxed sm:max-w-sm sm:text-xl"
              style={{ color: "rgba(232,212,192,0.88)" }}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
            >
              Answer every question to{" "}
              <span className="font-semibold" style={{ color: GOLD_SOFT }}>
                unlock your gift.
              </span>
            </motion.p>

            <motion.button
              type="button"
              onClick={onComplete}
              aria-label="Start quiz"
              className="relative mt-7 flex w-full max-w-sm items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-[1.05rem] font-serif text-lg font-semibold focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A080C] focus-visible:outline-none sm:mt-9 sm:py-5 sm:text-xl"
              style={{
                background: CREAM,
                color: ROSE,
                boxShadow: [
                  "0 16px 36px -10px rgba(20,4,8,0.55)",
                  "0 0 28px -8px rgba(201,162,39,0.35)",
                  "inset 0 1px 0 rgba(255,255,255,0.65)",
                ].join(", "),
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <span className="relative">Start</span>
              <span aria-hidden className="relative text-xl leading-none">
                →
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
