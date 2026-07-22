"use client";

import { useEffect, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import type { BloomConnectionLabQuestion } from "@/features/theme-lab/config/bloom-connection-fixtures";

type ConnectionQuizQuestionSceneProps = ConnectionSceneProps & {
  question: BloomConnectionLabQuestion;
  questionIndex: number;
  totalQuestions: number;
};

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="15"
          rx="10"
          ry="16"
          fill="#F4A0B8"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="6.5" fill="#FFF6E8" />
      <circle cx="32" cy="32" r="2.4" fill="#E8A850" />
    </svg>
  );
}

function MiniSakura({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="5.5"
          rx="3.2"
          ry="5.2"
          fill="#F2A0B8"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.2" fill="#FFF4E0" />
    </svg>
  );
}

function PetalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.88"
      />
    </svg>
  );
}

function SakuraCluster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      <g transform="translate(28 18) scale(0.7)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={`a-${deg}`}
            cx="32"
            cy="15"
            rx="10"
            ry="16"
            fill="#F6A8BC"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
        <circle cx="32" cy="32" r="2.5" fill="#E8A850" />
      </g>
      <g transform="translate(58 42) scale(0.55)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={`b-${deg}`}
            cx="32"
            cy="15"
            rx="10"
            ry="16"
            fill="#E8799A"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
        <circle cx="32" cy="32" r="2.5" fill="#E8A850" />
      </g>
      <g transform="translate(18 58) scale(0.45)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={`c-${deg}`}
            cx="32"
            cy="15"
            rx="10"
            ry="16"
            fill="#F7B4C6"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
        <circle cx="32" cy="32" r="2.5" fill="#E8A850" />
      </g>
    </svg>
  );
}

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

const STATIC_PETALS = [
  { top: "10%", left: "72%", size: 14, rotate: 18 },
  { top: "28%", left: "8%", size: 12, rotate: -22 },
  { top: "52%", left: "88%", size: 15, rotate: 12 },
  { top: "70%", left: "14%", size: 11, rotate: -8 },
  { top: "18%", left: "42%", size: 10, rotate: 28 },
] as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Brief select feedback before advance — still “immediate”, no Next button. */
const SELECT_ADVANCE_MS = 280;

/**
 * connection.quiz.question.{n} — living Founder Scene 6.
 * One question per screen; tap answer → next (or Scene 7 hold).
 */
export function ConnectionQuizQuestionScene({
  question,
  questionIndex,
  totalQuestions,
  onComplete,
}: ConnectionQuizQuestionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
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
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] bg-[#FBF6F2]">
      <style>{`
        @keyframes cq-node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232, 121, 154, 0.45); }
          50% { box-shadow: 0 0 0 10px rgba(232, 121, 154, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cq-node-current { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 90% at 50% 30%, #FFFCFA 0%, #FBF6F2 48%, #F5E4E8 100%)",
        }}
      />

      {/* Torn / scrap paper accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-3 left-2 h-16 w-20 rotate-[-8deg] sm:top-5 sm:left-4 sm:h-20 sm:w-24"
        style={{
          background: "linear-gradient(145deg, #E8D5C4 0%, #DCC4AE 100%)",
          clipPath: "polygon(4% 8%, 92% 0, 100% 88%, 8% 100%, 0 40%)",
          boxShadow: "0 4px 12px rgba(120,80,60,0.12)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-2 left-6 h-3 w-8 rotate-[-12deg] rounded-[1px] bg-[#F5E6A8]/90 sm:left-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-28 w-24 sm:h-36 sm:w-32"
        style={{
          background:
            "repeating-linear-gradient(90deg, #F7EEF0 0px, #F7EEF0 3px, #EFE4E8 3px, #EFE4E8 6px)",
          clipPath: "polygon(35% 0, 100% 0, 100% 100%, 55% 70%, 80% 40%)",
          opacity: 0.85,
        }}
      />

      <SakuraCluster className="pointer-events-none absolute -right-2 -bottom-2 h-32 w-32 opacity-95 sm:right-1 sm:bottom-1 sm:h-40 sm:w-40" />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STATIC_PETALS.map((p, i) => (
          <div
            key={i}
            className="absolute opacity-70"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size * 1.35,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <PetalMark className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Footer scrap quote */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-3 max-w-[11rem] rotate-[-3deg] px-3 py-2 sm:bottom-6 sm:left-5 sm:max-w-[13rem]"
        style={{
          background: "linear-gradient(160deg, #F8D0DC 0%, #F2B8C8 100%)",
          clipPath: "polygon(2% 6%, 96% 0, 100% 92%, 6% 100%)",
          boxShadow: "0 6px 16px rgba(160,70,100,0.12)",
        }}
      >
        <p className="font-serif text-[0.7rem] leading-snug text-[#8B3A4E] italic sm:text-xs">
          Little moments become beautiful memories. ♡
        </p>
      </div>

      <div className="relative z-10 flex min-h-full w-full flex-col px-5 pt-10 pb-28 sm:px-8 sm:pt-12 sm:pb-32">
        {/* Progress */}
        <motion.div
          className="mx-auto w-full max-w-sm"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
        >
          <p className="mb-3 text-center font-sans text-[10px] font-semibold tracking-[0.28em] text-[#E8A0B4] uppercase">
            Progress
          </p>
          <div
            className="relative flex items-center justify-between px-1"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalQuestions}
            aria-valuenow={questionIndex + 1}
            aria-label={`Question ${questionIndex + 1} of ${totalQuestions}`}
          >
            <div
              aria-hidden
              className="absolute top-1/2 right-3 left-3 h-px -translate-y-1/2 bg-[#F0C8D4]"
            />
            {Array.from({ length: totalQuestions }, (_, i) => {
              const done = i < questionIndex;
              const current = i === questionIndex;
              return (
                <div
                  key={i}
                  className="relative z-10 flex h-9 w-9 items-center justify-center"
                >
                  <div
                    className={
                      current
                        ? "cq-node-current flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE4EC] ring-2 ring-[#E8799A]/50"
                        : done
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-[#E8799A]"
                          : "flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F0C8D4] bg-[#FFFCFA]"
                    }
                    style={
                      current && !reduceMotion
                        ? {
                            animation:
                              "cq-node-pulse 2.2s ease-in-out infinite",
                          }
                        : undefined
                    }
                  >
                    {done ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : current ? (
                      <MiniSakura className="h-5 w-5" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          className="mx-auto mt-10 w-full max-w-md text-center sm:mt-12"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: easeOut }}
        >
          <h1 className="font-serif text-[1.45rem] leading-snug font-semibold text-[#5C2A34] sm:text-[1.75rem]">
            {question.prompt}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#E8799A]">
            <span className="h-px w-10 bg-current opacity-60" aria-hidden />
            <SakuraMark className="h-6 w-6" />
            <span className="h-px w-10 bg-current opacity-60" aria-hidden />
          </div>
        </motion.div>

        {/* Answers */}
        <ul className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:gap-3.5">
          {question.options.map((option, index) => {
            const selected = selectedIndex === index;
            return (
              <motion.li
                key={`${question.sortOrder}-${option}`}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.14 + index * 0.06,
                  ease: easeOut,
                }}
              >
                <button
                  type="button"
                  disabled={selectedIndex != null}
                  onClick={() => handleSelect(index)}
                  className={
                    selected
                      ? "flex w-full items-center gap-3 rounded-2xl border-2 border-[#E8799A] bg-white px-4 py-3.5 text-left shadow-[0_0_0_4px_rgba(232,121,154,0.22)] transition-[border-color,box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none sm:gap-3.5 sm:px-5 sm:py-4"
                      : "flex w-full items-center gap-3 rounded-2xl border border-[#F0C8D4] bg-white/95 px-4 py-3.5 text-left shadow-[0_4px_16px_-10px_rgba(180,80,110,0.25)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[#E8A0B4] focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none active:scale-[0.99] disabled:opacity-70 sm:gap-3.5 sm:px-5 sm:py-4"
                  }
                  aria-pressed={selected}
                >
                  <MiniSakura className="h-5 w-5 shrink-0 opacity-90" />
                  <span className="font-serif text-[0.98rem] text-[#5C2A34] sm:text-lg">
                    {option}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
