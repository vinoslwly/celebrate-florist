"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";

const ASSETS = {
  /**
   * Scrapbook atmosphere only — do NOT use the Canva mockup plate
   * (it bakes gift + “Calculating…” and doubles the living UI).
   * Reuse Scene 6 Founder scrapbook for Warm continuity.
   */
  background: "/themes/warm/connection/quiz-question-bg.webp?v=hd3",
} as const;

const PAPER = "#F3E8D8";
const INK = "#3A1218";
const ROSE = "#6B121A";
const GOLD = "#C5A059";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * warm.connection.score-calculation — living Founder Scene 7.
 * Bloom anticipation beat (ajar gift + soft wait) + Warm scrapbook + Canva copy.
 * Theme Lab auto-advances ~2s; production may hold while submit settles.
 */
export function WarmConnectionScoreCalculationScene(
  _props: WarmConnectionSceneProps,
) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
      style={{ backgroundColor: PAPER }}
      role="status"
      aria-live="polite"
      aria-label="Calculating your score"
    >
      <style>{`
        @keyframes wsc-dot {
          0%, 80%, 100% { opacity: 0.35; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wsc-dot { animation: none !important; opacity: 0.7 !important; }
        }
      `}</style>

      {/* Founder scrapbook — top-anchored like Scene 6 (props stay in frame) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.background}
          alt=""
          className="absolute top-0 left-1/2 w-[140%] max-w-none -translate-x-1/2 sm:top-1/2 sm:w-[115%] sm:-translate-y-1/2"
        />
      </div>

      {/* Soft center lift for gift + type — corners keep scrapbook props */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 58% 44% at 50% 40%, rgba(255,252,248,0.55) 0%, rgba(255,248,242,0.18) 48%, transparent 74%)",
        }}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-6 py-14">
        <div className="relative flex flex-col items-center">
          <div className="relative mb-2 flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60">
            {/* Extra crack glow behind ajar gift */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-[46%] left-1/2 h-44 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-52 sm:w-60"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,250,220,0.95) 0%, rgba(240,215,120,0.45) 38%, transparent 70%)",
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
                      ease: EASE,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }
              }
            />

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
                  : { opacity: 1, scale: 1, y: [18, 0, -4, 0] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.4, ease: EASE },
                      scale: {
                        delay: 0.08,
                        type: "spring",
                        stiffness: 220,
                        damping: 16,
                      },
                      y: { duration: 1.8, ease: EASE },
                    }
              }
            >
              <WarmGiftBox
                variant="ajar"
                className="h-44 w-44 drop-shadow-[0_18px_32px_rgba(60,8,12,0.35)] sm:h-52 sm:w-52"
              />
            </motion.div>
          </div>

          <motion.h1
            className="mt-3 text-center font-serif text-[1.85rem] font-semibold tracking-tight sm:text-[2.35rem]"
            style={{ color: INK }}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.4,
              duration: 0.5,
              ease: EASE,
            }}
          >
            Calculating…
          </motion.h1>

          <motion.div
            className="mt-4 mb-3 flex items-center justify-center gap-3"
            style={{ color: GOLD }}
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.55,
              duration: 0.4,
              ease: EASE,
            }}
          >
            <span className="h-px w-12 bg-current opacity-70 sm:w-16" />
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: ROSE }}
            />
            <span className="h-px w-12 bg-current opacity-70 sm:w-16" />
          </motion.div>

          <motion.p
            className="max-w-[17rem] text-center font-serif text-base leading-relaxed sm:max-w-xs sm:text-lg"
            style={{ color: "rgba(58,18,24,0.72)" }}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.65,
              duration: 0.45,
              ease: EASE,
            }}
          >
            Your score is being prepared…
          </motion.p>

          <motion.div
            className="mt-9 flex items-center gap-2.5"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.85, duration: 0.35 }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="wsc-dot inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: i === 1 ? ROSE : "rgba(165,28,40,0.35)",
                  animation: reduceMotion
                    ? undefined
                    : `wsc-dot 1.15s ease-in-out ${i * 0.18}s infinite`,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
