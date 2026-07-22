"use client";

import { useEffect, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import {
  WARM_CONNECTION_LAB_SCORE_RESULT,
  type WarmConnectionLabScoreResult,
} from "@/features/theme-lab/config/warm-connection-fixtures";

type WarmConnectionScoreRevealSceneProps = WarmConnectionSceneProps & {
  scoreResult?: WarmConnectionLabScoreResult;
};

const ASSETS = {
  /** Founder clean flat-lay — blank cream stage already in the photo. */
  background: "/themes/warm/connection/score-reveal-bg.webp?v=23",
} as const;

const PAPER = "#F4E9DA";
const INK = "#4A1218";
const ROSE = "#6B121A";
const ROSE_DEEP = "#5A0F16";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#D4B56A";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Clean crest heart — gold rim, no emoji eyes. */
function HeartCrest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 34" className={className} aria-hidden fill="none">
      <path
        d="M20 30.5 C8.5 22.8 4.2 17.2 6.2 11.8 C7.6 8.2 12.2 7.4 20 12.2 C27.8 7.4 32.4 8.2 33.8 11.8 C35.8 17.2 31.5 22.8 20 30.5Z"
        fill={ROSE}
      />
      <path
        d="M20 30.5 C8.5 22.8 4.2 17.2 6.2 11.8 C7.6 8.2 12.2 7.4 20 12.2 C27.8 7.4 32.4 8.2 33.8 11.8 C35.8 17.2 31.5 22.8 20 30.5Z"
        stroke={GOLD}
        strokeWidth="1.15"
        opacity="0.85"
      />
    </svg>
  );
}

function GoldHeartMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 16" className={className} aria-hidden>
      <path
        d="M9 14.5 C3.2 10.2 1.2 7.4 2.4 4.9 C3.2 3.2 5.6 2.9 9 5.2 C12.4 2.9 14.8 3.2 15.6 4.9 C16.8 7.4 14.8 10.2 9 14.5Z"
        fill={GOLD_SOFT}
        stroke={GOLD}
        strokeWidth="0.7"
      />
    </svg>
  );
}

function GiftLineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="1.5"
        stroke={GOLD_SOFT}
        strokeWidth="1.4"
      />
      <path d="M4 14.5 h16" stroke={GOLD_SOFT} strokeWidth="1.4" />
      <path d="M12 10 v11" stroke={GOLD_SOFT} strokeWidth="1.4" />
      <path
        d="M12 10 C12 10 9 5.5 7 6.5 C5.5 7.2 5.5 9 7.5 9.5 C9.5 10 12 10 12 10Z"
        stroke={GOLD_SOFT}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M12 10 C12 10 15 5.5 17 6.5 C18.5 7.2 18.5 9 16.5 9.5 C14.5 10 12 10 12 10Z"
        stroke={GOLD_SOFT}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <rect
        x="3.5"
        y="8"
        width="17"
        height="2.5"
        rx="0.8"
        stroke={GOLD_SOFT}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ArrowLineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={className} aria-hidden fill="none">
      <path
        d="M1 6 h15 M12 2 L17 6 L12 10"
        stroke={GOLD_SOFT}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useCountUp(target: number, enabled: boolean, durationMs = 900) {
  const [value, setValue] = useState(() => (enabled ? 0 : target));

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, durationMs]);

  return enabled ? value : target;
}

/**
 * warm.connection.score-reveal — living Founder Scene 8.
 * Score sits ON the Founder blank cream stage (no second floating card).
 */
export function WarmConnectionScoreRevealScene({
  scoreResult,
  onComplete,
}: WarmConnectionScoreRevealSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const result = scoreResult ?? WARM_CONNECTION_LAB_SCORE_RESULT;
  const displayPercent = useCountUp(result.percent, !reduceMotion);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
      style={{ backgroundColor: PAPER }}
    >
      {/* Full-bleed Founder flat-lay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.background}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.65] object-cover object-center sm:scale-[1.12]"
        />
      </div>

      <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center justify-center px-6 py-8 sm:px-10 sm:py-12">
        <motion.div
          className="flex w-full max-w-[17.5rem] flex-col items-center text-center sm:max-w-sm"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <HeartCrest className="mb-2 h-7 w-9 sm:mb-3 sm:h-8 sm:w-10" />

          <p
            className="font-serif text-[3.1rem] leading-none font-semibold tracking-tight sm:text-[4.2rem]"
            style={{ color: ROSE }}
            aria-live="polite"
          >
            {displayPercent}%
          </p>

          <div
            className="mt-3 mb-3 flex items-center justify-center gap-2.5 sm:mt-4 sm:mb-4 sm:gap-3"
            style={{ color: GOLD }}
          >
            <span
              className="h-px w-10 bg-current opacity-65 sm:w-14"
              aria-hidden
            />
            <GoldHeartMark className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span
              className="h-px w-10 bg-current opacity-65 sm:w-14"
              aria-hidden
            />
          </div>

          <h1
            className="max-w-[15rem] font-serif text-[1.3rem] leading-snug font-semibold sm:max-w-xs sm:text-[1.6rem]"
            style={{ color: INK }}
          >
            {result.headline}
          </h1>

          <GoldHeartMark className="mt-3.5 h-3 w-3 opacity-90 sm:mt-4 sm:h-3.5 sm:w-3.5" />

          <p
            className="mt-2.5 max-w-[16rem] font-serif text-[0.92rem] leading-relaxed sm:mt-3 sm:max-w-xs sm:text-base"
            style={{ color: "rgba(74,18,24,0.72)" }}
          >
            {result.message}
          </p>

          <motion.button
            type="button"
            onClick={onComplete}
            className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-3.5 font-serif text-[1.02rem] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24A]/70 focus-visible:ring-offset-2 sm:mt-9 sm:py-4 sm:text-lg"
            style={{
              background: `linear-gradient(180deg, #8B1A22 0%, ${ROSE_DEEP} 55%, #4A0A10 100%)`,
              color: "#F8EFE4",
              boxShadow:
                "0 1px 0 rgba(240,215,120,0.35) inset, 0 0 0 1.5px rgba(201,162,74,0.65), 0 14px 28px -12px rgba(40,8,12,0.55)",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            aria-label="Reveal my gift"
          >
            <GiftLineIcon className="h-5 w-5 shrink-0" />
            Reveal My Gift
            <ArrowLineIcon className="h-3 w-5 shrink-0 opacity-95" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
