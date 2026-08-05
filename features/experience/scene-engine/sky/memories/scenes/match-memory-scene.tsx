"use client";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import {
  getProgressNodePulseAnimation,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";
import type { SkyMemoriesLabMatchPair } from "@/features/theme-lab/config/sky-memories-fixtures";

type SkyMemoriesMatchMemorySceneProps = SkyMemoriesSceneProps & {
  pair: SkyMemoriesLabMatchPair;
  memoryIndex: number;
  totalMemories: number;
  /** Lab deep-link hold — keep timer visible but do not auto-advance. */
  pauseAutoAdvance?: boolean;
  onAnswer: (storySortOrder: number) => void;
};

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const DENIM = "#3F6F9A";
const DENIM_DEEP = "#2A5278";
const CREAM = "#FFFEFB";
const PAPER = "#F4FAFE";
const GOLD = "#F0D878";
const GOLD_SOFT = "#FFE8A0";

const EASE = [0.22, 1, 0.36, 1] as const;
const MATCH_TIMER_MS = 20_000;
const TIME_UP_HOLD_MS = 900;
const SELECT_ADVANCE_MS = 380;
const OPTION_LETTERS = ["A", "B", "C"] as const;

/** Progressive reveal — soft spotlight aperture (FD-S11-12). */
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

function SoftStar({
  className,
  fill = GOLD,
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

function SoftHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden>
      <path
        d="M10 16.2 C3.8 11.4 1.4 8.2 2.7 5.4 C3.6 3.5 6.2 3.1 10 5.7 C13.8 3.1 16.4 3.5 17.3 5.4 C18.6 8.2 16.2 11.4 10 16.2Z"
        fill={SKY}
        stroke={SKY_DEEP}
        strokeWidth="0.75"
      />
    </svg>
  );
}

function SoftHeartOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden fill="none">
      <path
        d="M10 16.2 C3.8 11.4 1.4 8.2 2.7 5.4 C3.6 3.5 6.2 3.1 10 5.7 C13.8 3.1 16.4 3.5 17.3 5.4 C18.6 8.2 16.2 11.4 10 16.2Z"
        stroke={SKY_DEEP}
        strokeWidth="1.35"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

function SkySprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 40" className={className} aria-hidden fill="none">
      <path
        d="M14 36 C14 24 12 16 10 8"
        stroke="#7A9A6A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <ellipse
        cx="8"
        cy="14"
        rx="5"
        ry="3"
        fill="#E8F2FA"
        stroke="#A8C4B0"
        strokeWidth="0.6"
        transform="rotate(-35 8 14)"
      />
      <ellipse
        cx="18"
        cy="18"
        rx="5"
        ry="3"
        fill="#FFFEFB"
        stroke="#A8C4B0"
        strokeWidth="0.6"
        transform="rotate(40 18 18)"
      />
      <ellipse
        cx="9"
        cy="24"
        rx="4.5"
        ry="2.6"
        fill="#F0F7FC"
        stroke="#A8C4B0"
        strokeWidth="0.6"
        transform="rotate(-30 9 24)"
      />
    </svg>
  );
}

function SkySparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 24" className={className} aria-hidden>
      <path
        d="M8 2 L9.2 6.2 L13.5 7.5 L9.2 8.8 L8 13 L6.8 8.8 L2.5 7.5 L6.8 6.2 Z"
        fill={GOLD_SOFT}
      />
      <path
        d="M20 8 L20.9 11 L24 12 L20.9 13 L20 16 L19.1 13 L16 12 L19.1 11 Z"
        fill={SKY_DEEP}
      />
      <path
        d="M14 14 L14.7 16.4 L17.2 17.2 L14.7 18 L14 20.4 L13.3 18 L10.8 17.2 L13.3 16.4 Z"
        fill={GOLD}
        opacity="0.85"
      />
    </svg>
  );
}

function DenimStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden>
      <path
        d="M36 4 42.5 24.5 64 26 47.5 40 52.5 62 36 50.5 19.5 62 24.5 40 8 26 29.5 24.5Z"
        fill={DENIM}
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.5"
      />
      <path
        d="M36 4 42.5 24.5 64 26 47.5 40 52.5 62 36 50.5 19.5 62 24.5 40 8 26 29.5 24.5Z"
        fill={DENIM_DEEP}
        opacity="0.35"
      />
      <path
        d="M36 11 40.8 25.2 54 26.2 43.2 36.2 46.5 51 36 42.8 25.5 51 28.8 36.2 18 26.2 31.2 25.2Z"
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.1"
        strokeDasharray="3 2.2"
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
        stroke={SKY_DEEP}
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="12" cy="8" r="2.2" fill={GOLD_SOFT} />
      <path
        d="M12 13.5 V24"
        stroke={SKY_DEEP}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 18 H16 M12 21.5 H15"
        stroke={SKY_DEEP}
        strokeWidth="1.8"
        strokeLinecap="round"
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
          background: `linear-gradient(90deg, transparent, ${SKY_DEEP})`,
        }}
      />
      <SoftHeart className="h-3.5 w-3.5 shrink-0" />
      <span
        className="h-px w-10 sm:w-12"
        style={{
          background: `linear-gradient(90deg, ${SKY_DEEP}, transparent)`,
        }}
      />
    </div>
  );
}

function WashiTape({
  className,
  rotate = -12,
  tone = "stripe",
}: {
  className?: string;
  rotate?: number;
  tone?: "stripe" | "check";
}) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        backgroundImage:
          tone === "check"
            ? "repeating-linear-gradient(0deg, #FFFFFF 0 5px, #A8D0E8 5px 10px), repeating-linear-gradient(90deg, #FFFFFF 0 5px, #A8D0E8 5px 10px)"
            : "repeating-linear-gradient(90deg, #FFFFFF 0 6px, #7EB6D9 6px 12px)",
        boxShadow: "0 2px 6px rgba(30,58,95,0.14)",
      }}
    />
  );
}

function OptionAccent({ index }: { index: number }) {
  if (index === 0) return <SkySprig className="h-7 w-5 opacity-90" />;
  if (index === 1) return <SoftHeartOutline className="h-5 w-5 opacity-90" />;
  return <SkySparkles className="h-5 w-6 opacity-90" />;
}

/**
 * Soft sky atmosphere — painterly wash + sun bloom (Quiz parity, mobile-light).
 * Fills the full scene height so scroll edges never show a host seam.
 */
function SkyMatchAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 min-h-full"
      style={{
        background: [
          "radial-gradient(ellipse 95% 70% at 50% 28%, #FFFEFB 0%, #E8F4FC 40%, #C5DCEF 72%, #9EC9E6 100%)",
          "radial-gradient(ellipse 55% 40% at 12% 8%, rgba(255,248,220,0.85) 0%, rgba(240,216,120,0.25) 40%, transparent 70%)",
          "radial-gradient(ellipse 50% 35% at 88% 12%, rgba(126,182,217,0.45) 0%, transparent 65%)",
        ].join(", "),
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.4) 3px 4px)",
        }}
      />
      {/* Soft denim corner washes */}
      <div
        className="absolute -top-4 -right-6 h-40 w-40 opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(42,82,120,0.45) 0%, rgba(63,111,154,0.2) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-6 -left-8 h-44 w-44 opacity-45"
        style={{
          background:
            "radial-gradient(circle, rgba(126,182,217,0.5) 0%, transparent 68%)",
        }}
      />
    </div>
  );
}

/**
 * sky.memories.match.memory.{n} — photo → choose story.
 * 20s timer · progressive reveal · luxury Sky scrapbook · no correct/wrong feedback.
 * Visual: Warm/Bloom match structure + Sky Quiz atmosphere & progress rail.
 */
export function SkyMemoriesMatchMemoryScene({
  pair,
  memoryIndex,
  totalMemories,
  pauseAutoAdvance = false,
  onAnswer,
}: SkyMemoriesMatchMemorySceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
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
        backgroundColor: "#9EC9E6",
        backgroundImage: [
          "radial-gradient(ellipse 95% 70% at 50% 28%, #FFFEFB 0%, #E8F4FC 40%, #C5DCEF 72%, #9EC9E6 100%)",
          "radial-gradient(ellipse 55% 40% at 12% 8%, rgba(255,248,220,0.55) 0%, transparent 70%)",
        ].join(", "),
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
      data-scene={`sky.memories.match.memory.${memoryIndex}`}
    >
      <style>{`
        @keyframes smm-node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(90, 155, 196, 0.45); }
          50% { box-shadow: 0 0 0 10px rgba(90, 155, 196, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .smm-node-current { animation: none !important; }
        }
      `}</style>

      <SkyMatchAtmosphere />

      {/* Corner denim stars — Founder scrapbook anchors */}
      <DenimStar className="pointer-events-none absolute top-5 left-3 z-[2] h-10 w-10 opacity-90 sm:top-7 sm:left-6 sm:h-12 sm:w-12" />
      <DenimStar className="pointer-events-none absolute top-6 right-3 z-[2] h-9 w-9 rotate-12 opacity-85 sm:top-8 sm:right-6 sm:h-11 sm:w-11" />

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
              <SoftStar className="h-3.5 w-3.5" fill={GOLD} />
            </motion.div>
          ))
        : null}

      <div className="relative z-10 flex w-full shrink-0 flex-col items-center px-3.5 pt-7 pb-16 sm:px-6 sm:pt-9 sm:pb-20">
        <motion.article
          className="relative w-full max-w-[22.5rem] shrink-0 rounded-[1.35rem] px-4 pt-5 pb-7 sm:max-w-md sm:rounded-[1.5rem] sm:px-5 sm:pt-6 sm:pb-8"
          style={{
            background: `linear-gradient(168deg, ${CREAM} 0%, ${PAPER} 48%, #E8F2FA 100%)`,
            boxShadow: [
              "0 28px 56px -20px rgba(30,58,95,0.45)",
              "0 0 0 1px rgba(126,182,217,0.35)",
              "inset 0 1px 0 rgba(255,255,255,0.9)",
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
          {/* Soft stitch border */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2.5 rounded-[1.1rem] border border-dashed opacity-40 sm:inset-3"
            style={{ borderColor: SKY }}
          />

          <div className="relative z-[1] flex flex-col items-center">
            {/* Progress — Sky Quiz star nodes */}
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
                  style={{ backgroundColor: "rgba(61,122,173,0.28)" }}
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
                          className="smm-node-current flex h-9 w-9 items-center justify-center rounded-full"
                          style={{
                            background: `linear-gradient(145deg, ${SKY_DEEP} 0%, ${DENIM} 100%)`,
                            boxShadow: !reduceMotion
                              ? undefined
                              : `0 0 0 3px rgba(90,155,196,0.25)`,
                            animation: getProgressNodePulseAnimation(
                              reduceMotion,
                              "smm-node-pulse",
                            ),
                          }}
                        >
                          <FivePointStar className="h-4 w-4" fill="white" />
                        </div>
                      ) : done ? (
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full"
                          style={{
                            background: `linear-gradient(145deg, ${SKY} 0%, ${SKY_DEEP} 100%)`,
                            boxShadow: "0 2px 8px -2px rgba(30,58,95,0.4)",
                          }}
                          aria-label={`Memory ${i + 1} complete`}
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 font-serif text-[11px] font-semibold"
                          style={{
                            borderColor: "rgba(90,155,196,0.45)",
                            backgroundColor: "rgba(255,254,251,0.85)",
                            color: INK_SOFT,
                          }}
                          aria-label={`Memory ${i + 1} upcoming`}
                        >
                          {i + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.h1
              className="mt-4 text-center font-serif text-[1.55rem] font-semibold tracking-tight sm:mt-5 sm:text-[1.85rem]"
              style={{ color: INK }}
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

            {/* Photo frame + soft bloom mat + progressive reveal */}
            <motion.div
              className="relative mx-auto mt-4 w-full max-w-[16.5rem] sm:mt-5 sm:max-w-[18rem]"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.14, duration: 0.45, ease: EASE }}
            >
              <WashiTape className="absolute -top-2 left-[16%] z-20 h-3.5 w-14 rounded-[1px]" />
              <WashiTape
                className="absolute -top-1.5 right-[12%] z-20 h-3 w-12 rounded-[1px]"
                rotate={14}
                tone="check"
              />

              {/* Soft bloom halo behind frame */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 rounded-[1.5rem] opacity-70"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,248,220,0.65) 0%, rgba(168,208,232,0.25) 45%, transparent 72%)",
                }}
              />

              <div
                className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl"
                style={{
                  boxShadow: [
                    "0 16px 36px -16px rgba(30,58,95,0.5)",
                    `0 0 0 2px rgba(126,182,217,0.55)`,
                    "0 0 0 5px rgba(255,254,251,0.95)",
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
                    background: `radial-gradient(circle at 50% 46%, transparent ${featherStart}%, rgba(30,58,95,0.35) ${holePercent}%, rgba(20,40,70,0.88) ${featherMid}%, #0A1628 ${blackStart}%)`,
                  }}
                />

                {!timeUp ? (
                  <div
                    className="absolute inset-x-0 top-0 h-[3px] overflow-hidden"
                    aria-hidden
                  >
                    <div
                      className="h-full origin-left"
                      style={{
                        width: `${(1 - timerProgress) * 100}%`,
                        background: `linear-gradient(90deg, ${GOLD_SOFT}, ${SKY})`,
                        boxShadow: `0 0 8px ${GOLD}`,
                      }}
                    />
                  </div>
                ) : null}

                {!timeUp ? (
                  <div
                    className="absolute top-2.5 right-2.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide shadow-sm"
                    style={{
                      backgroundColor: "rgba(30,58,95,0.72)",
                      color: GOLD_SOFT,
                      border: `1px solid rgba(126,182,217,0.5)`,
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
                    style={{ backgroundColor: "rgba(30,58,95,0.78)" }}
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

            {/* Story options — dashed stitch cards · A/B/C */}
            <ul className="relative mt-5 flex w-full flex-col gap-2.5 sm:mt-6 sm:gap-3">
              <WashiTape
                className="absolute -right-1 top-1/2 z-20 h-16 w-3.5 -translate-y-1/2 rounded-[1px]"
                rotate={8}
                tone="check"
              />
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
                      className="relative flex w-full items-start gap-3 rounded-2xl px-3.5 py-3 text-left transition-[border-color,box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-[#7EB6D9] focus-visible:outline-none active:scale-[0.99] disabled:opacity-85 sm:gap-3.5 sm:px-4 sm:py-3.5"
                      style={
                        selected
                          ? {
                              backgroundColor: CREAM,
                              border: `2px dashed ${SKY_DEEP}`,
                              boxShadow: [
                                "0 0 0 4px rgba(90,155,196,0.16)",
                                "0 10px 24px -14px rgba(30,58,95,0.4)",
                              ].join(", "),
                            }
                          : {
                              backgroundColor: "rgba(255,254,251,0.96)",
                              border: `1.5px dashed rgba(90,155,196,0.45)`,
                              boxShadow:
                                "0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 20px -14px rgba(30,58,95,0.22)",
                            }
                      }
                      aria-pressed={selected}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 right-2.5 z-10 -translate-y-1/2"
                      >
                        <OptionAccent index={index} />
                      </span>
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-sm font-semibold text-white"
                        style={{
                          background: selected
                            ? `linear-gradient(145deg, ${SKY_DEEP}, ${DENIM_DEEP})`
                            : `linear-gradient(145deg, ${SKY}, ${SKY_DEEP})`,
                          boxShadow: "0 3px 8px -3px rgba(30,58,95,0.45)",
                        }}
                      >
                        {letter}
                      </span>
                      <span className="min-w-0 flex-1 pr-8">
                        <span
                          className="block font-serif text-[0.95rem] font-semibold sm:text-base"
                          style={{ color: INK }}
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
                          style={{ backgroundColor: SKY_DEEP }}
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
                  border: `1px solid rgba(90,155,196,0.55)`,
                  backgroundColor: "rgba(255,254,251,0.95)",
                  boxShadow: "0 4px 12px -6px rgba(30,58,95,0.3)",
                }}
                aria-label={
                  hintUsed
                    ? "Hint already used"
                    : "Gentle hint — peek a little more"
                }
              >
                <HintKey className="h-5 w-5" />
              </button>
              <SoftHeart className="h-4 w-4 opacity-80" />
              <span className="w-11" aria-hidden />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
