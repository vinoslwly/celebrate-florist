"use client";

import { useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";

const BG = "#6B0F16";
const GOLD = "#C9A227";
const GOLD_SOFT = "rgba(232, 200, 120, 0.92)";
const INK_LIGHT = "#F5E6D8";

type Stage = "wrapped" | "opening" | "letter";

/** Failed open attempts before Warm Connection Scene 2 advances. */
const LOCKED_FAILS_BEFORE_ADVANCE = 3;

const SPARKLES = [
  { top: "48%", left: "28%", delay: 0.2, size: 4 },
  { top: "52%", left: "72%", delay: 0.7, size: 3 },
  { top: "58%", left: "24%", delay: 1.1, size: 5 },
  { top: "54%", left: "76%", delay: 0.4, size: 3 },
  { top: "62%", left: "38%", delay: 1.4, size: 4 },
  { top: "60%", left: "62%", delay: 0.9, size: 3 },
  { top: "44%", left: "48%", delay: 0.55, size: 3 },
] as const;

function GoldOrnamentLine() {
  return (
    <div className="flex w-full max-w-xs items-center gap-3" aria-hidden>
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
        }}
      />
      <span
        className="inline-block h-1.5 w-1.5 rotate-45"
        style={{ backgroundColor: GOLD }}
      />
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }}
      />
    </div>
  );
}

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#8B1A22"
        opacity="0.85"
      />
    </svg>
  );
}

function WarmLetterReveal({
  toName,
  fromName,
  revealed,
  onTapLetter,
  reduceMotion,
}: {
  toName: string;
  fromName: string;
  revealed: boolean;
  onTapLetter: () => void;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[18%] left-1/2 z-0 h-52 w-60 -translate-x-1/2 rounded-full sm:h-60 sm:w-72"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,220,150,0.55) 0%, rgba(180,40,50,0.25) 45%, transparent 70%)",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.7 }
            : { opacity: [0.45, 0.9, 0.45], scale: [0.96, 1.05, 0.96] }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        type="button"
        aria-label={`Letter to ${toName} from ${fromName}. Tap to continue`}
        disabled={!revealed}
        onClick={onTapLetter}
        className="relative z-20 mx-auto block w-[12rem] disabled:cursor-default sm:w-[13.5rem] focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:outline-none"
        initial={reduceMotion ? false : { y: 90, opacity: 0, scale: 0.92 }}
        animate={{
          y: revealed ? 0 : 36,
          opacity: 1,
          scale: 1,
        }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        whileHover={revealed ? { scale: 1.02 } : undefined}
        whileTap={revealed ? { scale: 0.98 } : undefined}
      >
        <div
          className="relative overflow-hidden rounded-md bg-[#FFF8F2] px-4 pt-5 pb-6 shadow-[0_18px_40px_-16px_rgba(40,0,0,0.55)] sm:px-5 sm:pt-6 sm:pb-7"
          style={{ border: `1.5px solid ${GOLD}` }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-sm"
            style={{ border: `1px solid rgba(201,162,39,0.45)` }}
          />

          <p
            className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
            style={{ color: "#A51C28" }}
          >
            To:
          </p>
          <p
            className="mt-1 text-center font-serif text-2xl font-semibold sm:text-3xl"
            style={{ color: "#6B0F16" }}
          >
            {toName}
          </p>

          <div
            className="my-4 flex items-center justify-center gap-2"
            style={{ color: GOLD }}
          >
            <span className="h-px w-8 bg-current" aria-hidden />
            <span className="text-xs" aria-hidden>
              ◆
            </span>
            <span className="h-px w-8 bg-current" aria-hidden />
          </div>

          <p
            className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
            style={{ color: "#A51C28" }}
          >
            From:
          </p>
          <p
            className="mt-1 text-center font-serif text-xl font-semibold sm:text-2xl"
            style={{ color: "#6B0F16" }}
          >
            {fromName}
          </p>

          {revealed ? (
            <motion.p
              className="mt-5 text-center font-serif text-[11px] italic sm:text-xs"
              style={{ color: "#8B5A4A" }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Tap the letter to continue
            </motion.p>
          ) : null}
        </div>
      </motion.button>

      {/* Open Warm gift under letter — lid animates */}
      <div
        className="relative z-10 -mt-8 flex justify-center sm:-mt-10"
        aria-hidden
      >
        <WarmGiftBox
          variant="open"
          animateLid
          reduceMotion={reduceMotion}
          className="h-36 w-[18rem] sm:h-40 sm:w-[20rem]"
        />
      </div>
    </div>
  );
}

/**
 * Warm Moments Scene 3 — Gift Opening.
 * Animated SVG gift (crimson + gold); tap opens → letter rises → tap letter.
 */
/**
 * Warm Moments gift opening — crimson luxury.
 * `lockedOnly` — Warm Connection Scene 2: wrapped gift only; three failed
 * open taps (shake, no letter), then advances via onComplete.
 */
export function WarmGiftOpeningScene({
  payload,
  onComplete,
  lockedOnly = false,
}: MomentsSceneProps & { lockedOnly?: boolean }) {
  const toName = payload.experience.greeting_name;
  const fromName = payload.experience.closing_name;
  const reduceMotion = useReducedMotion() ?? false;
  const [stage, setStage] = useState<Stage>("wrapped");
  const [shaking, setShaking] = useState(false);
  const [lockedFails, setLockedFails] = useState(0);

  function handleGiftTap() {
    if (stage !== "wrapped") return;
    if (lockedOnly) {
      if (shaking) return;
      const nextFails = lockedFails + 1;
      setLockedFails(nextFails);
      setShaking(true);
      const shakeMs = nextFails >= LOCKED_FAILS_BEFORE_ADVANCE ? 620 : 520;
      window.setTimeout(() => {
        setShaking(false);
        if (nextFails >= LOCKED_FAILS_BEFORE_ADVANCE) onComplete();
      }, shakeMs);
      return;
    }
    setStage("opening");
    window.setTimeout(() => setStage("letter"), reduceMotion ? 200 : 950);
  }

  const wrappedHeadline =
    lockedOnly && lockedFails >= 1
      ? "Hmm… still locked"
      : "Tap the gift to open";

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ backgroundColor: BG }}>
      {/* Soft leaf shadow — left atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 8% 18%, rgba(30,4,8,0.55) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 70%, rgba(90,18,24,0.35) 0%, transparent 65%)",
        }}
      />

      {/* Paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Floor petal */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[18%] bottom-[14%] opacity-80 sm:right-[22%] sm:bottom-[12%]"
      >
        <SoftPetal className="h-8 w-6 rotate-[28deg] sm:h-10 sm:w-7" />
      </div>

      {/* Gold sparkles around gift */}
      {!reduceMotion ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                backgroundColor: GOLD,
                boxShadow: `0 0 10px ${GOLD}`,
              }}
              animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.3, 0.8] }}
              transition={{
                duration: 2.4,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center px-4 pt-10 pb-8 sm:pt-14">
        <AnimatePresence mode="wait">
          {stage === "wrapped" ? (
            <motion.div
              key="wrapped"
              className="flex w-full flex-1 flex-col items-center"
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className="mb-8 flex flex-col items-center gap-3 sm:mb-12"
                initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GoldOrnamentLine />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={wrappedHeadline}
                    className="text-center font-serif text-base font-semibold tracking-[0.28em] uppercase sm:text-lg sm:tracking-[0.32em]"
                    style={{ color: GOLD_SOFT }}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.25 }}
                  >
                    {wrappedHeadline}
                  </motion.p>
                </AnimatePresence>
                <GoldOrnamentLine />
              </motion.div>

              <div className="relative mt-auto mb-auto flex flex-col items-center">
                <motion.div
                  aria-hidden
                  className="absolute bottom-4 left-1/2 h-14 w-52 -translate-x-1/2 rounded-full sm:h-16 sm:w-64"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(201,162,39,0.45) 0%, transparent 70%)",
                  }}
                  animate={
                    reduceMotion
                      ? { opacity: 0.6 }
                      : {
                          opacity: [0.4, 0.85, 0.4],
                          scale: [0.96, 1.05, 0.96],
                        }
                  }
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.button
                  type="button"
                  aria-label={
                    lockedOnly
                      ? "Try to open the locked gift"
                      : "Tap the gift to open"
                  }
                  onClick={handleGiftTap}
                  className="relative z-10 focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:outline-none"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={shaking ? undefined : { scale: 1.03 }}
                  whileTap={shaking ? undefined : { scale: 0.97 }}
                >
                  <motion.span
                    className="block"
                    animate={
                      shaking
                        ? lockedFails >= LOCKED_FAILS_BEFORE_ADVANCE
                          ? {
                              x: [0, -14, 14, -12, 12, -6, 6, 0],
                              rotate: [0, -3, 3, -2, 2, 0],
                              y: 0,
                            }
                          : {
                              x: [0, -10, 10, -8, 8, -4, 4, 0],
                              rotate: [0, -2, 2, -1, 1, 0],
                              y: 0,
                            }
                        : reduceMotion
                          ? undefined
                          : { y: [0, -8, 0], rotate: [0, -0.8, 0.8, 0] }
                    }
                    transition={
                      shaking
                        ? {
                            duration:
                              lockedFails >= LOCKED_FAILS_BEFORE_ADVANCE
                                ? 0.58
                                : 0.48,
                            ease: "easeInOut",
                          }
                        : {
                            duration: 3.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.35,
                          }
                    }
                  >
                    <WarmGiftBox
                      variant="closed"
                      reduceMotion={reduceMotion}
                      className="h-[15.5rem] w-[14.5rem] sm:h-[18rem] sm:w-[16.5rem]"
                    />
                  </motion.span>
                </motion.button>
              </div>

              <motion.span
                aria-hidden
                className="mt-3"
                style={{ color: GOLD_SOFT }}
                animate={
                  reduceMotion
                    ? { opacity: 0.5 }
                    : { y: [0, 5, 0], opacity: [0.35, 0.75, 0.35] }
                }
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path
                    d="M1 1.5L9 10L17 1.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              className="flex w-full flex-1 flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {stage === "opening" ? (
                <motion.p
                  className="mb-8 font-serif text-sm tracking-[0.28em] uppercase sm:text-base"
                  style={{ color: INK_LIGHT }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  Opening…
                </motion.p>
              ) : null}
              <WarmLetterReveal
                toName={toName}
                fromName={fromName}
                revealed={stage === "letter"}
                onTapLetter={onComplete}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
