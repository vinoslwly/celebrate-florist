"use client";

import { useEffect, useRef, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";
import type { WarmMemoriesLabMatchPair } from "@/features/theme-lab/config/warm-memories-fixtures";

type WarmMemoriesMatchMemorySceneProps = WarmMemoriesSceneProps & {
  pair: WarmMemoriesLabMatchPair;
  memoryIndex: number;
  totalMemories: number;
  /** Lab deep-link hold — keep timer visible but do not auto-advance. */
  pauseAutoAdvance?: boolean;
  onAnswer: (storySortOrder: number) => void;
};

const BG = "#3A080C";
const CREAM = "#FFF9F2";
const PAPER = "#FFFEFA";
const ROSE = "#A51C28";
const ROSE_DEEP = "#6B0F16";
const INK_SOFT = "#5A2A32";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E8C878";

const EASE = [0.22, 1, 0.36, 1] as const;
const MATCH_TIMER_MS = 20_000;
const TIME_UP_HOLD_MS = 900;
const SELECT_ADVANCE_MS = 320;
const OPTION_LETTERS = ["A", "B", "C"] as const;

/** Progressive reveal — black spotlight aperture. */
const REVEAL_STEPS = [
  { atMs: 0, visible: 0.1 },
  { atMs: 5_000, visible: 0.15 },
  { atMs: 10_000, visible: 0.2 },
  { atMs: 15_000, visible: 0.25 },
  { atMs: 20_000, visible: 0.3 },
] as const;

function visibilityForElapsed(elapsedMs: number, hintBoost: number): number {
  let visible: number = REVEAL_STEPS[0].visible;
  for (const step of REVEAL_STEPS) {
    if (elapsedMs >= step.atMs) visible = step.visible;
  }
  return Math.min(0.3, visible + hintBoost);
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

/** Outline-only — upcoming / not-yet progress nodes. */
function GoldHeartOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden fill="none">
      <path
        d="M10 16.2 C3.8 11.4 1.4 8.2 2.7 5.4 C3.6 3.5 6.2 3.1 10 5.7 C13.8 3.1 16.4 3.5 17.3 5.4 C18.6 8.2 16.2 11.4 10 16.2Z"
        stroke={GOLD}
        strokeWidth="1.35"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

function GoldSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 40" className={className} aria-hidden fill="none">
      <path
        d="M14 36 C14 24 12 16 10 8"
        stroke={GOLD}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <ellipse
        cx="8"
        cy="14"
        rx="5"
        ry="3"
        fill={GOLD_SOFT}
        opacity="0.85"
        transform="rotate(-35 8 14)"
      />
      <ellipse
        cx="18"
        cy="18"
        rx="5"
        ry="3"
        fill={GOLD}
        opacity="0.8"
        transform="rotate(40 18 18)"
      />
      <ellipse
        cx="9"
        cy="24"
        rx="4.5"
        ry="2.6"
        fill={GOLD_SOFT}
        opacity="0.75"
        transform="rotate(-30 9 24)"
      />
    </svg>
  );
}

function GoldSparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 24" className={className} aria-hidden>
      <path
        d="M8 2 L9.2 6.2 L13.5 7.5 L9.2 8.8 L8 13 L6.8 8.8 L2.5 7.5 L6.8 6.2 Z"
        fill={GOLD_SOFT}
      />
      <path
        d="M20 8 L20.9 11 L24 12 L20.9 13 L20 16 L19.1 13 L16 12 L19.1 11 Z"
        fill={GOLD}
      />
      <path
        d="M14 14 L14.7 16.4 L17.2 17.2 L14.7 18 L14 20.4 L13.3 18 L10.8 17.2 L13.3 16.4 Z"
        fill={GOLD_SOFT}
        opacity="0.85"
      />
    </svg>
  );
}

function HintKey({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 28" className={className} aria-hidden fill="none">
      <circle
        cx="12"
        cy="8"
        r="5.5"
        stroke={GOLD}
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="12" cy="8" r="2.2" fill={GOLD_SOFT} />
      <path
        d="M12 13.5 V24"
        stroke={GOLD}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 18 H16 M12 21.5 H15"
        stroke={GOLD}
        strokeWidth="1.8"
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
        fill={GOLD_SOFT}
        opacity="0.95"
      />
    </svg>
  );
}

function OrnamentRule({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-2.5 ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="h-px w-10 sm:w-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
        }}
      />
      <GoldHeart className="h-3.5 w-3.5 shrink-0" />
      <span
        className="h-px w-10 sm:w-12"
        style={{
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }}
      />
    </div>
  );
}

function WashiTape({
  className,
  rotate = -12,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        background:
          "linear-gradient(180deg, rgba(255,248,220,0.72) 0%, rgba(232,200,120,0.55) 100%)",
        border: "1px solid rgba(201,162,74,0.35)",
        boxShadow: "0 2px 6px rgba(40,8,12,0.12)",
      }}
    />
  );
}

function OptionAccent({ index }: { index: number }) {
  if (index === 0) return <GoldSprig className="h-7 w-5 opacity-90" />;
  if (index === 1) return <GoldHeartOutline className="h-5 w-5 opacity-90" />;
  return <GoldSparkles className="h-5 w-6 opacity-90" />;
}

/**
 * warm.memories.match.memory.{n} — photo → choose story.
 * 20s timer · progressive reveal · luxury scrapbook card · no correct/wrong feedback.
 */
export function WarmMemoriesMatchMemoryScene({
  pair,
  memoryIndex,
  totalMemories,
  pauseAutoAdvance = false,
  onAnswer,
}: WarmMemoriesMatchMemorySceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [hintBoost, setHintBoost] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [burst, setBurst] = useState(false);
  const answeredRef = useRef(false);
  const startRef = useRef<number | null>(null);

  const displayElapsed = reduceMotion ? 15_000 : elapsedMs;
  const timeUp = !reduceMotion && displayElapsed >= MATCH_TIMER_MS;
  const visible = visibilityForElapsed(displayElapsed, hintBoost);
  const holePercent = visible * 100;
  const featherStart = Math.max(0, holePercent - 2);
  const featherMid = holePercent + 6;
  const blackStart = holePercent + 16;
  const secondsLeft = Math.max(
    0,
    Math.ceil((MATCH_TIMER_MS - displayElapsed) / 1000),
  );
  const timerProgress = Math.min(1, displayElapsed / MATCH_TIMER_MS);

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
    <div
      className="relative flex min-h-full w-full flex-1 flex-col overflow-x-clip"
      style={{
        backgroundColor: BG,
        backgroundImage: [
          "radial-gradient(ellipse 100% 55% at 50% 0%, rgba(90,16,24,0.55) 0%, transparent 70%)",
          "radial-gradient(ellipse 90% 40% at 50% 100%, rgba(42,5,8,0.5) 0%, transparent 65%)",
        ].join(", "),
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <style>{`
        @keyframes wmm-node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 162, 74, 0.45); }
          50% { box-shadow: 0 0 0 10px rgba(201, 162, 74, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wmm-node-current { animation: none !important; }
        }
      `}</style>

      {/* Select / hint celebration burst — enter-only */}
      {burst && !reduceMotion
        ? [-48, -16, 16, 48].map((x, i) => (
            <motion.div
              key={`burst-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-[36%] left-1/2 z-40"
              initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], scale: 1.15, x, y: -36 - i * 6 }}
              transition={{ duration: 0.75, ease: EASE }}
              onAnimationComplete={() => {
                if (i === 0) setBurst(false);
              }}
            >
              <Sparkle className="h-3.5 w-3.5" />
            </motion.div>
          ))
        : null}

      <div className="relative z-10 flex w-full shrink-0 flex-col items-center px-3.5 pt-7 pb-16 sm:px-6 sm:pt-9 sm:pb-20">
        <motion.article
          className="relative w-full max-w-[22.5rem] shrink-0 rounded-[1.35rem] px-4 pt-5 pb-7 sm:max-w-md sm:rounded-[1.5rem] sm:px-5 sm:pt-6 sm:pb-8"
          style={{
            background: `linear-gradient(165deg, ${PAPER} 0%, ${CREAM} 55%, #F5EDE3 100%)`,
            boxShadow: [
              "0 28px 56px -20px rgba(20,4,8,0.7)",
              "0 0 0 1px rgba(201,162,74,0.28)",
              "inset 0 1px 0 rgba(255,255,255,0.75)",
            ].join(", "),
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
        >
          {/* Gold hairline */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2.5 rounded-[1.1rem] sm:inset-3"
            style={{ border: "1px solid rgba(201,162,74,0.32)" }}
          />

          <div className="relative z-[1] flex flex-col items-center">
            {/* Progress — gold hearts only */}
            <motion.div
              className="w-full max-w-sm"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div
                className="relative flex items-center justify-between px-0.5"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={totalMemories}
                aria-valuenow={memoryIndex + 1}
                aria-label={`Memory ${memoryIndex + 1} of ${totalMemories}`}
              >
                <div
                  aria-hidden
                  className="absolute top-1/2 right-4 left-4 h-[2px] -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: "rgba(201,162,74,0.35)" }}
                />
                {Array.from({ length: totalMemories }, (_, i) => {
                  const done = i < memoryIndex;
                  const current = i === memoryIndex;
                  return (
                    <div
                      key={i}
                      className="relative z-10 flex h-10 w-10 items-center justify-center"
                    >
                      {current ? (
                        <div
                          className="wmm-node-current flex h-9 w-9 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: PAPER,
                            border: `2px solid ${GOLD}`,
                            boxShadow: !reduceMotion
                              ? undefined
                              : `0 0 0 3px rgba(201,162,74,0.2)`,
                            animation: !reduceMotion
                              ? "wmm-node-pulse 2.2s ease-in-out infinite"
                              : undefined,
                          }}
                        >
                          <GoldHeart className="h-4 w-4" />
                        </div>
                      ) : done ? (
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full"
                          style={{
                            background: `linear-gradient(145deg, ${GOLD_SOFT} 0%, ${GOLD} 55%, #A67C1A 100%)`,
                            boxShadow: "0 2px 8px -2px rgba(120,80,20,0.45)",
                          }}
                          aria-label={`Memory ${i + 1} complete`}
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                          style={{
                            borderColor: "rgba(201,162,74,0.35)",
                            backgroundColor: "rgba(255,252,248,0.7)",
                          }}
                          aria-label={`Memory ${i + 1} upcoming`}
                        >
                          <GoldHeartOutline className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.h1
              className="mt-4 text-center font-serif text-[1.55rem] font-semibold tracking-tight sm:mt-5 sm:text-[1.85rem]"
              style={{ color: ROSE_DEEP }}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.4, ease: EASE }}
            >
              Match the Memory
            </motion.h1>

            <motion.div
              className="mt-2.5"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.35 }}
            >
              <OrnamentRule />
            </motion.div>

            {/* Photo frame + soft gold timer ring */}
            <motion.div
              className="relative mx-auto mt-4 w-full max-w-[16.5rem] sm:mt-5 sm:max-w-[18rem]"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.14, duration: 0.45, ease: EASE }}
            >
              <WashiTape className="absolute -top-2 left-[18%] z-20 h-4 w-14 rounded-[1px]" />
              <WashiTape
                className="absolute -top-1.5 right-[14%] z-20 h-3.5 w-12 rounded-[1px]"
                rotate={14}
              />

              {/* Gold timer arc ring */}
              <div
                className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl"
                style={{
                  boxShadow: [
                    "0 16px 36px -16px rgba(40,8,12,0.55)",
                    `0 0 0 2px rgba(201,162,74,0.55)`,
                    "0 0 0 5px rgba(255,252,248,0.9)",
                  ].join(", "),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Theme Lab local fixture */}
                <img
                  src={pair.photoSignedUrl}
                  alt={pair.photoAlt}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 transition-[background] duration-500 ease-out"
                  style={{
                    background: `radial-gradient(circle at 50% 46%, transparent ${featherStart}%, rgba(0,0,0,0.45) ${holePercent}%, rgba(0,0,0,0.92) ${featherMid}%, #000 ${blackStart}%)`,
                  }}
                />

                {/* Soft gold progress bar under frame top */}
                {!timeUp ? (
                  <div
                    className="absolute inset-x-0 top-0 h-[3px] overflow-hidden"
                    aria-hidden
                  >
                    <div
                      className="h-full origin-left"
                      style={{
                        width: `${(1 - timerProgress) * 100}%`,
                        background: `linear-gradient(90deg, ${GOLD_SOFT}, ${GOLD})`,
                        boxShadow: `0 0 8px ${GOLD}`,
                      }}
                    />
                  </div>
                ) : null}

                {!timeUp ? (
                  <div
                    className="absolute top-2.5 right-2.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(40,8,12,0.62)",
                      color: GOLD_SOFT,
                      border: `1px solid rgba(201,162,74,0.45)`,
                    }}
                    aria-live="polite"
                    aria-label={`${secondsLeft} seconds remaining`}
                  >
                    {secondsLeft}s
                  </div>
                ) : null}

                {timeUp ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(40,8,12,0.78)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    role="status"
                  >
                    <p
                      className="font-serif text-lg font-semibold"
                      style={{ color: CREAM }}
                    >
                      Time&apos;s up.
                    </p>
                  </motion.div>
                ) : null}
              </div>
            </motion.div>

            {/* Story options */}
            <ul className="mt-5 flex w-full flex-col gap-2.5 sm:mt-6 sm:gap-3">
              {pair.storyOptions.map((option, index) => {
                const selected = selectedIndex === index;
                const letter = OPTION_LETTERS[index] ?? String(index + 1);
                return (
                  <motion.li
                    key={`${pair.photoSortOrder}-${option.sortOrder}`}
                    className="relative"
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: reduceMotion ? 0 : 0.18 + index * 0.07,
                      ease: EASE,
                    }}
                  >
                    <button
                      type="button"
                      disabled={selectedIndex != null || timeUp}
                      onClick={() => handleSelect(index)}
                      className="relative flex w-full items-start gap-3 rounded-2xl px-3.5 py-3 text-left transition-[border-color,box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-[#C9A24A] focus-visible:outline-none active:scale-[0.99] disabled:opacity-85 sm:gap-3.5 sm:px-4 sm:py-3.5"
                      style={
                        selected
                          ? {
                              backgroundColor: PAPER,
                              border: `2px solid ${ROSE}`,
                              boxShadow: [
                                "0 0 0 4px rgba(165,28,40,0.14)",
                                "0 10px 24px -14px rgba(80,12,20,0.45)",
                              ].join(", "),
                            }
                          : {
                              backgroundColor: "rgba(255,254,250,0.96)",
                              border: "1px solid rgba(165,28,40,0.12)",
                              boxShadow:
                                "0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 20px -14px rgba(60,8,12,0.28)",
                            }
                      }
                      aria-pressed={selected}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-2.5 top-1/2 z-10 -translate-y-1/2"
                      >
                        <OptionAccent index={index} />
                      </span>
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-sm font-semibold text-white"
                        style={{
                          background: selected
                            ? `linear-gradient(145deg, #C42838, ${ROSE_DEEP})`
                            : `linear-gradient(145deg, ${ROSE}, ${ROSE_DEEP})`,
                          boxShadow: "0 3px 8px -3px rgba(80,12,20,0.5)",
                        }}
                      >
                        {letter}
                      </span>
                      <span className="min-w-0 flex-1 pr-8">
                        <span
                          className="block font-serif text-[0.95rem] font-semibold sm:text-base"
                          style={{ color: ROSE_DEEP }}
                        >
                          {option.title}:
                        </span>
                        <span
                          className="mt-0.5 block font-serif text-[0.88rem] leading-snug sm:text-[0.95rem]"
                          style={{ color: INK_SOFT }}
                        >
                          {option.body}
                        </span>
                      </span>
                      {selected ? (
                        <span
                          className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ backgroundColor: ROSE }}
                          aria-hidden
                        >
                          <CheckIcon className="h-3 w-3" />
                        </span>
                      ) : null}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-5 flex w-full items-center justify-between px-1">
              <button
                type="button"
                onClick={handleHint}
                disabled={hintUsed || selectedIndex != null || timeUp}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-[transform,opacity] hover:scale-105 disabled:opacity-40"
                style={{
                  border: `1px solid rgba(201,162,74,0.55)`,
                  backgroundColor: "rgba(255,252,248,0.95)",
                  boxShadow: "0 4px 12px -6px rgba(80,12,20,0.35)",
                }}
                aria-label={
                  hintUsed
                    ? "Hint already used"
                    : "Gentle hint — peek a little more"
                }
              >
                <HintKey className="h-5 w-5" />
              </button>
              <GoldHeart className="h-4 w-4 opacity-80" />
              <span className="w-11" aria-hidden />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
