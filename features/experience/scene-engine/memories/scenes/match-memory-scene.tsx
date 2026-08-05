"use client";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import {
  allowAmbientLoop,
  getProgressNodePulseAnimation,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { BloomMemoriesLabMatchPair } from "@/features/theme-lab/config/bloom-memories-fixtures";

type MemoriesMatchMemorySceneProps = MemoriesSceneProps & {
  pair: BloomMemoriesLabMatchPair;
  memoryIndex: number;
  totalMemories: number;
  /** Lab deep-link hold — keep timer visible but do not auto-advance. */
  pauseAutoAdvance?: boolean;
  onAnswer: (storySortOrder: number) => void;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const MATCH_TIMER_MS = 20_000;
const TIME_UP_HOLD_MS = 900;
const SELECT_ADVANCE_MS = 320;
const OPTION_LETTERS = ["A", "B", "C"] as const;

/** Progressive reveal — black spotlight aperture (Founder Theme Lab). */
const REVEAL_STEPS = [
  { atMs: 0, visible: 0.1 },
  { atMs: 5_000, visible: 0.15 },
  { atMs: 10_000, visible: 0.2 },
  { atMs: 15_000, visible: 0.25 },
  { atMs: 20_000, visible: 0.3 },
] as const;

const FALLING_PETALS = [
  { left: "6%", delay: 0.4, duration: 8.5, size: 12, x: 14 },
  { left: "78%", delay: 1.2, duration: 9.2, size: 14, x: -12 },
  { left: "92%", delay: 0.8, duration: 8.8, size: 11, x: -8 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.9"
      />
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

function HintBulb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.8c.6.5 1 1.2 1.1 2h4.8c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z"
        stroke="#E8799A"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 10.5h2"
        stroke="#E8799A"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M12 1.5 13.8 9.2 21.5 12 13.8 14.8 12 22.5 10.2 14.8 2.5 12l7.7-2.8L12 1.5Z"
        fill="#E8C070"
        opacity="0.9"
      />
    </svg>
  );
}

function visibilityForElapsed(elapsedMs: number, hintBoost: number): number {
  let visible: number = REVEAL_STEPS[0].visible;
  for (const step of REVEAL_STEPS) {
    if (elapsedMs >= step.atMs) visible = step.visible;
  }
  return Math.min(0.3, visible + hintBoost);
}

/**
 * memories.match.memory.{n} — photo → choose story (FD-S11-09).
 * 20s timer · progressive reveal · no correct/wrong feedback.
 */
export function MemoriesMatchMemoryScene({
  pair,
  memoryIndex,
  totalMemories,
  pauseAutoAdvance = false,
  onAnswer,
}: MemoriesMatchMemorySceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [hintBoost, setHintBoost] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [burst, setBurst] = useState(false);
  const answeredRef = useRef(false);
  const startRef = useRef<number | null>(null);

  /** Reduced motion: readable peek without countdown / Time's up. */
  const displayElapsed = reduceMotion ? 15_000 : elapsedMs;
  const timeUp = !reduceMotion && displayElapsed >= MATCH_TIMER_MS;
  const visible = visibilityForElapsed(displayElapsed, hintBoost);
  /** Spotlight hole radius (% of frame) — sharp photo under black mask. */
  const holePercent = visible * 100;
  const featherStart = Math.max(0, holePercent - 2);
  const featherMid = holePercent + 6;
  const blackStart = holePercent + 16;
  const secondsLeft = Math.max(
    0,
    Math.ceil((MATCH_TIMER_MS - displayElapsed) / 1000),
  );

  function finish(storySortOrder: number) {
    if (answeredRef.current) return;
    answeredRef.current = true;
    onAnswer(storySortOrder);
  }

  useEffect(() => {
    if (pauseAutoAdvance || reduceMotion) return;
    startRef.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const start = startRef.current ?? now;
      const elapsed = Math.min(MATCH_TIMER_MS, now - start);
      setElapsedMs(elapsed);
      if (elapsed < MATCH_TIMER_MS && !answeredRef.current) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pauseAutoAdvance, reduceMotion, memoryIndex]);

  /** Timer expiry → Time's up beat → implicit first story (GER-05). */
  useEffect(() => {
    if (pauseAutoAdvance || reduceMotion || answeredRef.current) return;
    if (elapsedMs < MATCH_TIMER_MS) return;
    const t = window.setTimeout(() => {
      finish(pair.storyOptions[0].sortOrder);
    }, TIME_UP_HOLD_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finish closes over pair
  }, [elapsedMs, pauseAutoAdvance, reduceMotion, pair.storyOptions]);

  useEffect(() => {
    if (selectedIndex == null) return;
    const option = pair.storyOptions[selectedIndex];
    if (!option) return;
    const t = window.setTimeout(
      () => finish(option.sortOrder),
      SELECT_ADVANCE_MS,
    );
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, pair.storyOptions]);

  function handleSelect(index: number) {
    if (selectedIndex != null || timeUp || answeredRef.current) return;
    setSelectedIndex(index);
    setBurst(true);
  }

  function handleHint() {
    if (hintUsed || selectedIndex != null || timeUp) return;
    setHintUsed(true);
    setHintBoost(0.05);
    setBurst(true);
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain bg-[#FBF0F3]">
      <style>{`
        @keyframes mm-node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232, 121, 154, 0.45); }
          50% { box-shadow: 0 0 0 10px rgba(232, 121, 154, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-node-current { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 115% 90% at 50% 28%, #FFFCFB 0%, #FFF2F5 42%, #F7E0E7 100%)",
        }}
      />

      {allowAmbientLoop(reduceMotion)
        ? FALLING_PETALS.map((p, i) => (
            <motion.div
              key={i}
              aria-hidden
              className="pointer-events-none absolute top-[-4%]"
              style={{ left: p.left, width: p.size, height: p.size * 1.35 }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                y: ["0vh", "105vh"],
                x: [0, p.x],
                rotate: [0, 40],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))
        : null}

      {/* Select / hint celebration burst */}
      {burst && !reduceMotion
        ? [-40, -10, 20, 50].map((x, i) => (
            <motion.div
              key={`burst-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-[38%] left-1/2 z-30"
              initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], scale: 1, x, y: -30 - i * 8 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              onAnimationComplete={() => {
                if (i === 0) setBurst(false);
              }}
            >
              <Sparkle className="h-3 w-3" />
            </motion.div>
          ))
        : null}

      <div className="relative z-10 flex w-full flex-col px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
        {/* Progress */}
        <motion.div
          className="mx-auto w-full max-w-sm"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <p className="mb-3 text-center font-sans text-[10px] font-semibold tracking-[0.28em] text-[#E8A0B4] uppercase">
            Progress
          </p>
          <div
            className="relative flex items-center justify-between px-1"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalMemories}
            aria-valuenow={memoryIndex + 1}
            aria-label={`Memory ${memoryIndex + 1} of ${totalMemories}`}
          >
            <div
              aria-hidden
              className="absolute top-1/2 right-3 left-3 h-px -translate-y-1/2 bg-[#F0C8D4]"
            />
            {Array.from({ length: totalMemories }, (_, i) => {
              const done = i < memoryIndex;
              const current = i === memoryIndex;
              return (
                <div
                  key={i}
                  className="relative z-10 flex h-9 w-9 items-center justify-center"
                >
                  <div
                    className={
                      current
                        ? "mm-node-current flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE4EC] ring-2 ring-[#E8799A]/50"
                        : done
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-[#E8799A]"
                          : "flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F0C8D4] bg-[#FFFCFA]"
                    }
                    style={
                      current
                        ? {
                            animation: getProgressNodePulseAnimation(
                              reduceMotion,
                              "mm-node-pulse",
                            ),
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

        <motion.h1
          className="mt-5 text-center font-serif text-[1.55rem] font-semibold tracking-tight text-[#6B2A38] sm:mt-6 sm:text-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.4, ease: EASE_OUT }}
        >
          Match the Memory
        </motion.h1>

        {/* Photo + soft timer ring */}
        <motion.div
          className="relative mx-auto mt-3 w-full max-w-[15.5rem] sm:mt-4 sm:max-w-[17.5rem]"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.45, ease: EASE_OUT }}
        >
          <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black shadow-[0_18px_40px_-18px_rgba(40,20,30,0.55)] ring-1 ring-[#2A181C]/40">
            {/* eslint-disable-next-line @next/next/no-img-element -- Theme Lab local fixture */}
            <img
              src={pair.photoSignedUrl}
              alt={pair.photoAlt}
              className="h-full w-full object-cover"
            />
            {/* Black spotlight mask — aperture grows with timer (no blur). */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-[background] duration-500 ease-out"
              style={{
                background: `radial-gradient(circle at 50% 46%, transparent ${featherStart}%, rgba(0,0,0,0.45) ${holePercent}%, rgba(0,0,0,0.92) ${featherMid}%, #000 ${blackStart}%)`,
              }}
            />

            {/* Countdown chip */}
            {!timeUp ? (
              <div
                className="absolute top-2.5 right-2.5 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-[#F7D0DC] shadow-sm backdrop-blur-sm"
                aria-live="polite"
                aria-label={`${secondsLeft} seconds remaining`}
              >
                {secondsLeft}s
              </div>
            ) : null}

            {timeUp ? (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="status"
              >
                <p className="font-serif text-lg font-semibold text-[#FFF5F7]">
                  ♡ Time&apos;s up.
                </p>
              </motion.div>
            ) : null}
          </div>
        </motion.div>

        {/* Story options */}
        <ul className="mx-auto mt-5 flex w-full max-w-md flex-col gap-2.5 sm:mt-6 sm:gap-3">
          {pair.storyOptions.map((option, index) => {
            const selected = selectedIndex === index;
            const letter = OPTION_LETTERS[index] ?? String(index + 1);
            return (
              <motion.li
                key={`${pair.photoSortOrder}-${option.sortOrder}`}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.16 + index * 0.07,
                  ease: EASE_OUT,
                }}
              >
                <button
                  type="button"
                  disabled={selectedIndex != null || timeUp}
                  onClick={() => handleSelect(index)}
                  className={
                    selected
                      ? "flex w-full items-start gap-3 rounded-2xl border-2 border-[#E8799A] bg-white px-3.5 py-3 text-left shadow-[0_0_0_4px_rgba(232,121,154,0.2)] transition-[border-color,box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none sm:gap-3.5 sm:px-4 sm:py-3.5"
                      : "flex w-full items-start gap-3 rounded-2xl border border-[#F0C8D4] bg-white/95 px-3.5 py-3 text-left shadow-[0_6px_18px_-12px_rgba(180,80,110,0.35)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[#E8A0B4] focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none active:scale-[0.99] disabled:opacity-70 sm:gap-3.5 sm:px-4 sm:py-3.5"
                  }
                  aria-pressed={selected}
                >
                  <span
                    className={
                      selected
                        ? "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8799A] font-serif text-sm font-semibold text-white"
                        : "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F0C8D4] bg-[#FFF7F9] font-serif text-sm font-semibold text-[#E8799A]"
                    }
                  >
                    {letter}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[0.95rem] font-semibold text-[#6B2A38] sm:text-base">
                      {option.title}:
                    </span>
                    <span className="mt-0.5 block font-serif text-[0.88rem] leading-snug text-[#8A5A68] sm:text-[0.95rem]">
                      {option.body}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleHint}
            disabled={hintUsed || selectedIndex != null || timeUp}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F0C8D4] bg-white/90 text-[#E8799A] shadow-sm transition-[transform,opacity] hover:scale-105 disabled:opacity-40"
            aria-label={
              hintUsed
                ? "Hint already used"
                : "Gentle hint — peek a little more"
            }
          >
            <HintBulb className="h-5 w-5" />
          </button>
          <span className="text-[#E8799A]" aria-hidden>
            ♡
          </span>
          <span className="w-11" aria-hidden />
        </div>
      </div>
    </div>
  );
}
