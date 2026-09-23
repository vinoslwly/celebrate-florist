"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";
import {
  allowAmbientLoop,
  getGentleZoom,
  MOTION_DURATION,
  MOTION_EASE,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";

type Stage = "wrapped" | "opening" | "letter";

/** Soft CSS bokeh — no photographic crops (avoids rectangular color blocks). */
const BOKEH = [
  {
    top: "-8%",
    right: "-6%",
    size: "42%",
    color: "rgba(247,168,190,0.45)",
    blur: "28px",
  },
  {
    top: "4%",
    right: "8%",
    size: "18%",
    color: "rgba(255,220,230,0.55)",
    blur: "18px",
  },
  {
    bottom: "-10%",
    left: "-8%",
    size: "40%",
    color: "rgba(242,160,180,0.4)",
    blur: "32px",
  },
  {
    bottom: "-12%",
    right: "-10%",
    size: "48%",
    color: "rgba(247,168,190,0.5)",
    blur: "30px",
  },
  {
    bottom: "6%",
    right: "12%",
    size: "16%",
    color: "rgba(255,200,220,0.45)",
    blur: "16px",
  },
  {
    top: "18%",
    left: "-4%",
    size: "22%",
    color: "rgba(255,230,235,0.35)",
    blur: "24px",
  },
] as const;

const FALLING_PETALS = [
  { left: "10%", delay: 0.2, duration: 8, size: 16, x: 18 },
  { left: "24%", delay: 1.3, duration: 9, size: 13, x: -12 },
  { left: "42%", delay: 0.5, duration: 7.4, size: 18, x: 10 },
  { left: "58%", delay: 2.1, duration: 8.2, size: 14, x: -16 },
  { left: "72%", delay: 1, duration: 7.8, size: 15, x: 12 },
  { left: "86%", delay: 2.6, duration: 8.6, size: 12, x: -8 },
  { left: "34%", delay: 3.2, duration: 9.1, size: 11, x: 14 },
] as const;

const SPARKLES = [
  { top: "36%", left: "34%", delay: 0.2, size: 4 },
  { top: "40%", left: "66%", delay: 0.8, size: 3 },
  { top: "50%", left: "30%", delay: 1.2, size: 5 },
  { top: "46%", left: "70%", delay: 0.5, size: 3 },
  { top: "56%", left: "42%", delay: 1.5, size: 4 },
  { top: "53%", left: "58%", delay: 0.9, size: 3 },
] as const;

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="18"
          rx="9"
          ry="14"
          fill="#F7A8BE"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5.5" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.2" fill="#F48CA8" />
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
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

/**
 * Open gift + emerging letter card (Founder Scene 3 open reference).
 * To = recipient (greeting_name), From = buyer (closing_name).
 */
function OpenGiftReveal({
  toName,
  fromName,
  stage,
  onTapLetter,
  reduceMotion,
}: {
  toName: string;
  fromName: string;
  stage: "opening" | "letter";
  onTapLetter: () => void;
  reduceMotion: boolean;
}) {
  const revealed = stage === "letter";
  const ambient = allowAmbientLoop(reduceMotion);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Warm glow from open box */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[28%] left-1/2 z-0 h-48 w-56 -translate-x-1/2 rounded-full sm:h-56 sm:w-64"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,236,210,0.95) 0%, rgba(255,200,160,0.55) 40%, transparent 70%)",
        }}
        animate={
          ambient
            ? { opacity: [0.55, 0.95, 0.55], scale: [0.96, 1.06, 0.96] }
            : { opacity: 0.75 }
        }
        transition={
          ambient
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />

      {/* Letter rising from the box */}
      <motion.button
        type="button"
        aria-label={`Letter to ${toName} from ${fromName}. Tap to continue`}
        disabled={!revealed}
        onClick={onTapLetter}
        className="relative z-20 mx-auto block w-[11.5rem] disabled:cursor-default sm:w-[13rem] focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none"
        initial={reduceMotion ? false : { y: 90, opacity: 0, scale: 0.92 }}
        animate={{
          y: revealed ? 0 : 36,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: MOTION_DURATION.ceremony,
          ease: MOTION_EASE.out,
          delay: reduceMotion ? 0 : 0.15,
        }}
        whileHover={revealed ? { scale: 1.02 } : undefined}
        whileTap={revealed ? { scale: 0.98 } : undefined}
      >
        <div className="relative overflow-hidden rounded-md border border-[#E8A0B4]/70 bg-[#FFF8F5] px-4 pt-5 pb-6 shadow-[0_18px_40px_-18px_rgba(160,70,100,0.45)] sm:px-5 sm:pt-6 sm:pb-7">
          {/* Ornate inner frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-sm border border-[#E8A0B4]/55"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-3 right-3 opacity-80"
          >
            <SakuraMark className="h-5 w-5" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-3 left-3 opacity-70"
          >
            <SakuraMark className="h-4 w-4" />
          </div>

          <p className="text-center text-[10px] font-semibold tracking-[0.22em] text-[#C45B7A] uppercase sm:text-[11px]">
            To:
          </p>
          <p className="mt-1 text-center font-serif text-2xl font-semibold text-[#8B2E3E] sm:text-3xl">
            {toName}
          </p>

          <div className="my-4 flex items-center justify-center gap-2 text-[#E8A0B4]">
            <span className="h-px w-8 bg-current" aria-hidden />
            <span className="text-xs" aria-hidden>
              ♥
            </span>
            <span className="h-px w-8 bg-current" aria-hidden />
          </div>

          <p className="text-center text-[10px] font-semibold tracking-[0.22em] text-[#C45B7A] uppercase sm:text-[11px]">
            From:
          </p>
          <p className="mt-1 text-center font-serif text-xl font-semibold text-[#8B2E3E] sm:text-2xl">
            {fromName}
          </p>

          {revealed ? (
            <motion.p
              className="mt-5 text-center font-serif text-[11px] text-[#9A6B78] italic sm:text-xs"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: MOTION_DURATION.base,
                ease: MOTION_EASE.out,
                delay: reduceMotion ? 0 : 0.45,
              }}
            >
              Tap the letter to continue
            </motion.p>
          ) : null}
        </div>
      </motion.button>

      {/* Open box base + lid resting on the left — shared Bloom gift */}
      <div
        className="relative z-10 -mt-8 flex justify-center sm:-mt-10"
        aria-hidden
      >
        <BloomGiftBox
          variant="open"
          animateLid
          reduceMotion={reduceMotion}
          className="h-36 w-[18rem] sm:h-40 sm:w-[20rem]"
        />
      </div>
    </div>
  );
}

/** Failed open attempts before Connection Scene 2 advances to the challenge. */
const LOCKED_FAILS_BEFORE_ADVANCE = 3;

/**
 * moments.gift-opening — living recreation of Founder Scene 3.
 * Wrapped: tap gift. Open: letter rises with To (recipient) + From (buyer).
 *
 * `lockedOnly` — Connection Scene 2 reuse: wrapped gift only (keyframe 1);
 * three failed open attempts (shake, no letter), then advances via onComplete.
 */
export function GiftOpeningScene({
  payload,
  onComplete,
  lockedOnly = false,
}: MomentsSceneProps & { lockedOnly?: boolean }) {
  const toName = payload.experience.greeting_name;
  const fromName = payload.experience.closing_name;
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);
  const giftEnter = getGentleZoom(reduceMotion);
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
    const letterDelayMs = reduceMotion
      ? 160
      : Math.round(MOTION_DURATION.ceremony * 1000) + 100;
    window.setTimeout(() => setStage("letter"), letterDelayMs);
  }

  const wrappedHeadline =
    lockedOnly && lockedFails >= 1
      ? "Hmm… still locked"
      : "Tap the gift to open";

  return (
    <div className={`${SCENE_VIEWPORT_SCROLL} bg-[#F8E4E7]`}>
      {/* Single smooth plane — no stitched photo panels */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 38%, #FFF9F7 0%, #FCF0F2 28%, #F7E0E6 55%, #F1D0D8 78%, #EBC4CE 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,255,255,0.5) 0%, transparent 70%)",
        }}
        animate={ambient ? { opacity: [0.4, 0.7, 0.4] } : { opacity: 0.55 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Micro-noise breaks CSS banding without looking textured */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft floral bokeh (CSS only — no rectangular crop seams) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {BOKEH.map((blob, i) => (
          <motion.div
            key={i}
            className={
              i > 2
                ? "absolute hidden rounded-full sm:block"
                : "absolute rounded-full"
            }
            style={{
              top: "top" in blob ? blob.top : undefined,
              bottom: "bottom" in blob ? blob.bottom : undefined,
              left: "left" in blob ? blob.left : undefined,
              right: "right" in blob ? blob.right : undefined,
              width: blob.size,
              height: blob.size,
              background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              filter: `blur(${blob.blur})`,
            }}
            animate={
              ambient
                ? { opacity: [0.65, 0.95, 0.65], scale: [1, 1.04, 1] }
                : { opacity: 0.8 }
            }
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Tiny sharp sakura accents at corners (transparent SVG, no photo plate) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-3 right-3 opacity-70 sm:top-5 sm:right-6"
      >
        <SakuraMark className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-4 opacity-55 sm:bottom-8 sm:left-8"
      >
        <SakuraMark className="h-7 w-7 sm:h-9 sm:w-9" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 bottom-10 opacity-60 sm:right-10 sm:bottom-12"
      >
        <SakuraMark className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {FALLING_PETALS.map((petal, i) => (
          <motion.div
            key={i}
            className={i > 3 ? "absolute hidden sm:block" : "absolute"}
            style={{
              left: petal.left,
              top: "-6%",
              width: petal.size,
              height: petal.size * 1.35,
            }}
            animate={
              ambient
                ? {
                    opacity: [0, 0.85, 0.85, 0],
                    y: ["0vh", "110vh"],
                    x: [0, petal.x, petal.x * -0.4],
                    rotate: [0, 40, -25, 60],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Petal className="h-full w-full" />
          </motion.div>
        ))}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            className={
              i > 2
                ? "absolute hidden rounded-full bg-white sm:block"
                : "absolute rounded-full bg-white"
            }
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              boxShadow: "0 0 8px rgba(255,255,255,0.9)",
            }}
            animate={
              ambient
                ? { opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.25, 0.8] }
                : { opacity: 0.45 }
            }
            transition={{
              duration: 2.2,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-full w-full flex-col items-center px-4 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-14">
        <AnimatePresence mode="wait">
          {stage === "wrapped" || lockedOnly ? (
            <motion.div
              key="wrapped"
              className="flex w-full flex-1 flex-col items-center"
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                duration: MOTION_DURATION.base,
                ease: MOTION_EASE.out,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={wrappedHeadline}
                  className="mb-6 text-center font-serif text-sm font-semibold tracking-[0.28em] text-[#9E2A50] uppercase sm:mb-10 sm:text-base"
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{
                    duration: MOTION_DURATION.fast,
                    ease: MOTION_EASE.out,
                  }}
                >
                  {wrappedHeadline}
                </motion.p>
              </AnimatePresence>

              <div className="relative mt-auto mb-auto flex flex-col items-center">
                <motion.div
                  aria-hidden
                  className="absolute bottom-6 left-1/2 h-16 w-56 -translate-x-1/2 rounded-full sm:h-20 sm:w-64"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,220,230,0.45) 45%, transparent 72%)",
                  }}
                  animate={
                    ambient
                      ? {
                          opacity: [0.55, 0.95, 0.55],
                          scale: [0.96, 1.04, 0.96],
                        }
                      : { opacity: 0.75 }
                  }
                  transition={
                    ambient
                      ? {
                          duration: 2.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : { duration: 0 }
                  }
                />

                <motion.button
                  type="button"
                  aria-label={
                    lockedOnly ? "Try to open the gift" : "Tap the gift to open"
                  }
                  onClick={handleGiftTap}
                  className="relative z-10 focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none"
                  initial={giftEnter.initial}
                  animate={giftEnter.animate}
                  transition={giftEnter.transition}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
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
                          : { x: [0, -10, 10, -8, 8, -4, 4, 0], y: 0 }
                        : { y: 0, rotate: 0 }
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
                        : undefined
                    }
                  >
                    <BloomGiftBox
                      variant="closed"
                      className="h-[15.5rem] w-[14.5rem] sm:h-[18rem] sm:w-[16.5rem]"
                    />
                  </motion.span>
                </motion.button>
              </div>

              <motion.span
                aria-hidden
                className="mt-4 text-[#C45B7A]/50"
                animate={
                  ambient
                    ? { y: [0, 5, 0], opacity: [0.35, 0.7, 0.35] }
                    : { opacity: 0.5 }
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
              transition={{
                duration: MOTION_DURATION.base,
                ease: MOTION_EASE.out,
              }}
            >
              <OpenGiftReveal
                toName={toName}
                fromName={fromName}
                stage={stage}
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
