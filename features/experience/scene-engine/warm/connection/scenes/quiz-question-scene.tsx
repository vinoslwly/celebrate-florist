"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  getProgressNodePulseAnimation,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import type { WarmConnectionLabQuestion } from "@/features/theme-lab/config/warm-connection-fixtures";

type WarmConnectionQuizQuestionSceneProps = WarmConnectionSceneProps & {
  question: WarmConnectionLabQuestion;
  questionIndex: number;
  totalQuestions: number;
};

const ASSETS = {
  /** Founder scrapbook — HD upscaled plate (keep as primary atmosphere). */
  background: "/themes/warm/connection/quiz-question-bg.webp?v=hd3",
} as const;

const PAPER = "#F3E8D8";
const INK = "#3A1218";
const ROSE = "#6B121A";
const ROSE_SOFT = "#8B1A22";
const GOLD = "#C5A059";
const GOLD_SOFT = "#E0C57A";

const EASE = [0.22, 1, 0.36, 1] as const;
const SELECT_ADVANCE_MS = 320;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill="none">
      <path
        d="M3.5 8.2 L6.6 11.2 L12.5 4.8"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden fill="none">
      <path
        d="M10 15.8 C4.2 11.4 2 8.6 3.1 6.1 C3.9 4.4 6.2 4 10 6.4 C13.8 4 16.1 4.4 16.9 6.1 C18 8.6 15.8 11.4 10 15.8Z"
        stroke={ROSE}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoldHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden>
      <path
        d="M10 16.2 C3.8 11.4 1.4 8.2 2.7 5.4 C3.6 3.5 6.2 3.1 10 5.7 C13.8 3.1 16.4 3.5 17.3 5.4 C18.6 8.2 16.2 11.4 10 16.2Z"
        fill={GOLD_SOFT}
        stroke={GOLD}
        strokeWidth="0.75"
      />
    </svg>
  );
}

/**
 * warm.connection.quiz.question.{n} — living Founder Scene 6.
 * Founder scrapbook stays; mobile pins plate under progress+question (no mid seam).
 */
export function WarmConnectionQuizQuestionScene({
  question,
  questionIndex,
  totalQuestions,
  onComplete,
}: WarmConnectionQuizQuestionSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex == null) return;
    const t = window.setTimeout(() => onComplete(), SELECT_ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [selectedIndex, onComplete]);

  function handleSelect(index: number) {
    if (selectedIndex != null) return;
    setSelectedIndex(index);
  }

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
      style={{ backgroundColor: PAPER }}
    >
      <style>{`
        @keyframes wqq-node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(107, 18, 26, 0.35); }
          50% { box-shadow: 0 0 0 10px rgba(107, 18, 26, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wqq-node-current { animation: none !important; }
        }
      `}</style>

      {/*
        Founder plate — top-anchored on mobile so progress + question sit ON
        the scrapbook (fixes cream/photo seam cutting the headline).
        Desktop: centered width-fill. Soft fade only at the very bottom.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 90%, transparent 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.background}
          alt=""
          className="absolute top-0 left-1/2 w-[138%] max-w-none -translate-x-1/2 sm:top-1/2 sm:w-[112%] sm:-translate-y-1/2"
          style={{ imageRendering: "auto" }}
        />
      </div>

      {/* Soft center lift for type — keeps scrapbook visible at corners */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 58% 36% at 50% 28%, rgba(255,252,248,0.42) 0%, rgba(255,252,248,0.08) 52%, transparent 76%)",
        }}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
        {/* Progress — stronger presence */}
        <motion.div
          className="mx-auto w-full max-w-sm"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="mb-3 flex flex-col items-center gap-1">
            <p
              className="text-center font-sans text-[11px] font-bold tracking-[0.32em] uppercase"
              style={{ color: ROSE }}
            >
              Progress
            </p>
            <p
              className="font-serif text-[13px] font-semibold tracking-wide"
              style={{ color: "rgba(58,18,24,0.72)" }}
            >
              Question {questionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div
            className="relative flex items-center justify-between px-0.5"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalQuestions}
            aria-valuenow={questionIndex + 1}
            aria-label={`Question ${questionIndex + 1} of ${totalQuestions}`}
          >
            <div
              aria-hidden
              className="absolute top-1/2 right-4 left-4 h-[2px] -translate-y-1/2 rounded-full"
              style={{ backgroundColor: "rgba(107,18,26,0.22)" }}
            />
            {Array.from({ length: totalQuestions }, (_, i) => {
              const done = i < questionIndex;
              const current = i === questionIndex;
              return (
                <div
                  key={i}
                  className="relative z-10 flex h-11 w-11 items-center justify-center"
                >
                  <div
                    className={
                      current
                        ? "wqq-node-current flex h-10 w-10 items-center justify-center rounded-full"
                        : done
                          ? "flex h-8 w-8 items-center justify-center rounded-full"
                          : "flex h-8 w-8 items-center justify-center rounded-full border-2"
                    }
                    style={
                      current
                        ? {
                            backgroundColor: ROSE,
                            boxShadow:
                              "0 4px 14px -4px rgba(107,18,26,0.55), 0 0 0 3px rgba(255,252,248,0.85)",
                            animation: getProgressNodePulseAnimation(
                              reduceMotion,
                              "wqq-node-pulse",
                            ),
                          }
                        : done
                          ? {
                              backgroundColor: ROSE_SOFT,
                              boxShadow: "0 2px 8px -3px rgba(107,18,26,0.4)",
                            }
                          : {
                              borderColor: "rgba(107,18,26,0.35)",
                              backgroundColor: "rgba(255,252,248,0.92)",
                            }
                    }
                  >
                    {done ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : current ? (
                      <span className="font-serif text-base font-bold text-[#FFF8F2]">
                        {i + 1}
                      </span>
                    ) : (
                      <span
                        className="font-serif text-[11px] font-semibold"
                        style={{ color: "rgba(107,18,26,0.4)" }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Question — eye-catching on scrapbook */}
        <motion.div
          className="mx-auto mt-8 w-full max-w-md text-center sm:mt-10"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
        >
          <div
            className="mx-auto rounded-[1.35rem] px-4 py-4 sm:px-6 sm:py-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,252,248,0.82) 0%, rgba(255,248,242,0.68) 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.7) inset, 0 12px 28px -18px rgba(60,8,12,0.35)",
              border: "1px solid rgba(107,18,26,0.08)",
            }}
          >
            <h1
              className="font-serif text-[1.55rem] leading-[1.25] font-semibold sm:text-[1.9rem]"
              style={{ color: INK }}
            >
              {question.prompt}
            </h1>
            <div
              className="mt-4 flex items-center justify-center gap-3"
              style={{ color: GOLD }}
            >
              <span className="h-px w-11 bg-current opacity-60" aria-hidden />
              <GoldHeart className="h-4 w-4" />
              <span className="h-px w-11 bg-current opacity-60" aria-hidden />
            </div>
          </div>
        </motion.div>

        <ul className="mx-auto mt-7 flex w-full max-w-md flex-col gap-2.5 sm:mt-9 sm:gap-3">
          {question.options.map((option, index) => {
            const selected = selectedIndex === index;
            return (
              <motion.li
                key={`${question.sortOrder}-${option}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.12 + index * 0.05,
                  ease: EASE,
                }}
              >
                <button
                  type="button"
                  disabled={selectedIndex != null}
                  onClick={() => handleSelect(index)}
                  className="flex w-full items-center gap-3 rounded-full px-4 py-3.5 text-left transition-[border-color,box-shadow,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B121A]/45 active:scale-[0.99] disabled:opacity-90 sm:gap-3.5 sm:px-5 sm:py-[15px]"
                  style={
                    selected
                      ? {
                          backgroundColor: "rgba(248,236,228,0.96)",
                          border: `1.5px solid ${ROSE}`,
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,0.5) inset, 0 6px 16px -12px rgba(60,8,12,0.3)",
                        }
                      : {
                          backgroundColor: "rgba(255,252,248,0.9)",
                          border: "1px solid rgba(107,18,26,0.1)",
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,0.55) inset, 0 6px 16px -14px rgba(60,8,12,0.16)",
                        }
                  }
                  aria-pressed={selected}
                >
                  <HeartMark className="h-[17px] w-[17px] shrink-0 opacity-75" />
                  <span
                    className="flex-1 font-serif text-[0.98rem] sm:text-lg"
                    style={{ color: INK }}
                  >
                    {option}
                  </span>
                  {selected ? (
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: ROSE }}
                      aria-hidden
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </button>
              </motion.li>
            );
          })}
        </ul>

        <motion.p
          className="mx-auto mt-7 flex items-center justify-center gap-2 text-center font-serif text-[13px] sm:mt-8 sm:text-sm"
          style={{ color: "rgba(58,18,24,0.7)" }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <GoldHeart className="h-3.5 w-3.5 shrink-0" />
          Choose the answer you think is right
        </motion.p>
      </div>
    </div>
  );
}
