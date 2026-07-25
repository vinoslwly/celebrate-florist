"use client";

import { useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

const INK = "#1E3A5F";
const ACCENT = "#6BA3C9";
const INK_SOFT = "#4A6A8A";

type Stage = "wrapped" | "opening" | "letter";

const SPARKLES = [
  { top: "36%", left: "34%", delay: 0.2, size: 4 },
  { top: "40%", left: "66%", delay: 0.8, size: 3 },
  { top: "50%", left: "30%", delay: 1.2, size: 5 },
  { top: "46%", left: "70%", delay: 0.5, size: 3 },
  { top: "56%", left: "42%", delay: 1.5, size: 4 },
  { top: "53%", left: "58%", delay: 0.9, size: 3 },
] as const;

const DRIFT = [
  { left: "10%", delay: 0.2, duration: 8, size: 8, x: 18 },
  { left: "24%", delay: 1.3, duration: 9, size: 6, x: -12 },
  { left: "42%", delay: 0.5, duration: 7.4, size: 9, x: 10 },
  { left: "58%", delay: 2.1, duration: 8.2, size: 7, x: -16 },
  { left: "72%", delay: 1, duration: 7.8, size: 8, x: 12 },
  { left: "86%", delay: 2.6, duration: 8.6, size: 6, x: -8 },
] as const;

function SkyPlantMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <path
        d="M32 54c0-10 1.5-18 4.5-24.5C40 22 44 18 48 16c-6 2-11 7-13.5 14.5C32 24 28 18 22 16c4 2 8 6 11.5 13.5C30.5 36 32 44 32 54Z"
        fill="#1E3A5F"
      />
      <circle cx="32" cy="18" r="5.5" fill="#1E3A5F" />
      <circle cx="22" cy="24" r="4.2" fill="#2A4A6E" />
      <circle cx="42" cy="24" r="4.2" fill="#2A4A6E" />
      <circle cx="26" cy="14" r="3.4" fill="#2A4A6E" />
      <circle cx="38" cy="14" r="3.4" fill="#2A4A6E" />
      <circle cx="32" cy="10" r="3" fill="#3A5F88" />
    </svg>
  );
}

function SoftStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill="#7EB6D9">
      <path d="M8 0.5 9.2 6.8 15.5 8 9.2 9.2 8 15.5 6.8 9.2 0.5 8 6.8 6.8Z" />
    </svg>
  );
}

function SoftConfetti({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden>
      <rect
        x="2"
        y="2"
        width="8"
        height="8"
        rx="1.5"
        fill="#7EB6D9"
        opacity="0.7"
        transform="rotate(18 6 6)"
      />
    </svg>
  );
}

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

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[28%] left-1/2 z-0 h-48 w-56 -translate-x-1/2 rounded-full sm:h-56 sm:w-64"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(184,212,234,0.55) 40%, transparent 70%)",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.7 }
            : { opacity: [0.5, 0.95, 0.5], scale: [0.96, 1.06, 0.96] }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        type="button"
        aria-label={`Letter to ${toName} from ${fromName}. Tap to continue`}
        disabled={!revealed}
        onClick={onTapLetter}
        className="relative z-20 mx-auto block w-[10.5rem] disabled:cursor-default sm:w-[12.5rem] focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none"
        initial={reduceMotion ? false : { y: 90, opacity: 0, scale: 0.92 }}
        animate={{
          y: revealed ? 0 : 36,
          opacity: 1,
          scale: 1,
        }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        whileHover={revealed ? { scale: 1.02 } : undefined}
        whileTap={revealed ? { scale: 0.98 } : undefined}
      >
        <div
          className="relative overflow-hidden rounded-md bg-[#FFFEFB] px-4 pt-4 pb-5 shadow-[0_18px_40px_-18px_rgba(30,58,95,0.35)] sm:px-5 sm:pt-5 sm:pb-6"
          style={{ border: `1.5px solid ${ACCENT}` }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-sm"
            style={{ border: `1px dashed rgba(107,163,201,0.55)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-3 right-3 opacity-80"
          >
            <SkyPlantMark className="h-5 w-5" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-3 left-3 opacity-70"
          >
            <SoftStar className="h-4 w-4" />
          </div>

          <p
            className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
            style={{ color: ACCENT }}
          >
            To:
          </p>
          <p
            className="mt-1 text-center font-serif text-2xl font-semibold sm:text-3xl"
            style={{ color: INK }}
          >
            {toName}
          </p>

          <div
            className="my-4 flex items-center justify-center gap-2"
            style={{ color: ACCENT }}
          >
            <span className="h-px w-8 bg-current" aria-hidden />
            <span className="text-xs" aria-hidden>
              ♥
            </span>
            <span className="h-px w-8 bg-current" aria-hidden />
          </div>

          <p
            className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
            style={{ color: ACCENT }}
          >
            From:
          </p>
          <p
            className="mt-1 text-center font-serif text-xl font-semibold sm:text-2xl"
            style={{ color: INK }}
          >
            {fromName}
          </p>

          {revealed ? (
            <motion.p
              className="mt-5 text-center font-serif text-[11px] italic sm:text-xs"
              style={{ color: INK_SOFT }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Tap the letter to continue
            </motion.p>
          ) : null}
        </div>
      </motion.button>

      <div
        className="relative z-10 -mt-8 flex justify-center sm:-mt-10"
        aria-hidden
      >
        <SkyGiftBox
          variant="open"
          animateLid
          reduceMotion={reduceMotion}
          className="h-28 w-[15rem] sm:h-36 sm:w-[18rem]"
        />
      </div>
    </div>
  );
}

/**
 * sky.moments.gift-opening — living recreation of Founder Scene 3.
 * Tap gift → open + letter rises (To/From) → tap letter advances.
 */
export function SkyGiftOpeningScene({
  payload,
  onComplete,
}: SkyMomentsSceneProps) {
  const toName = payload.experience.greeting_name;
  const fromName = payload.experience.closing_name;
  const reduceMotion = useReducedMotion() ?? false;
  const [stage, setStage] = useState<Stage>("wrapped");

  function handleGiftTap() {
    if (stage !== "wrapped") return;
    setStage("opening");
    window.setTimeout(() => setStage("letter"), reduceMotion ? 200 : 950);
  }

  return (
    <div className={`${SCENE_VIEWPORT_SCROLL} bg-[#E8F2FA]`}>
      {/* Soft sky plane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 38%, #F7FBFE 0%, #E8F2FA 35%, #D6E8F5 68%, #C5DCEF 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,255,255,0.55) 0%, transparent 70%)",
        }}
        animate={
          reduceMotion ? { opacity: 0.55 } : { opacity: [0.35, 0.7, 0.4] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft cloud blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {[
          { top: "8%", left: "-6%", size: "36%" },
          { top: "14%", right: "-8%", size: "32%" },
          { bottom: "10%", left: "8%", size: "28%" },
          { bottom: "6%", right: "2%", size: "30%" },
        ].map((cloud, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: "top" in cloud ? cloud.top : undefined,
              bottom: "bottom" in cloud ? cloud.bottom : undefined,
              left: "left" in cloud ? cloud.left : undefined,
              right: "right" in cloud ? cloud.right : undefined,
              width: cloud.size,
              height: cloud.size,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
              filter: "blur(16px)",
            }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-3 left-3 opacity-75 sm:top-5 sm:left-6"
      >
        <SoftStar className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-4 right-4 opacity-65 sm:top-6 sm:right-8"
      >
        <SkyPlantMark className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-5 opacity-50 sm:bottom-10 sm:left-10"
      >
        <SoftStar className="h-6 w-6" />
      </div>

      {/* Drift confetti */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {DRIFT.map((bit, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: bit.left,
                top: "-6%",
                width: bit.size,
                height: bit.size,
              }}
              animate={{
                opacity: [0, 0.75, 0.75, 0],
                y: ["0vh", "110vh"],
                x: [0, bit.x, bit.x * -0.4],
                rotate: [0, 40, -25, 60],
              }}
              transition={{
                duration: bit.duration,
                delay: bit.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftConfetti className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              boxShadow: "0 0 8px rgba(255,255,255,0.9)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.5 }
                : { opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.25, 0.8] }
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

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {stage === "wrapped" ? (
            <motion.div
              key="wrapped"
              className="flex w-full flex-1 flex-col items-center"
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className="mb-6 flex flex-col items-center sm:mb-10"
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="mb-2 flex items-center gap-2"
                  style={{ color: ACCENT }}
                  aria-hidden
                >
                  <span className="h-px w-10 border-t border-dashed border-current sm:w-14" />
                  <span className="text-sm">♥</span>
                  <span className="h-px w-10 border-t border-dashed border-current sm:w-14" />
                </div>
                <p
                  className="text-center font-serif text-sm font-semibold tracking-[0.28em] uppercase sm:text-base"
                  style={{ color: INK }}
                >
                  Tap the gift to open
                </p>
                <div
                  className="mt-2 flex items-center gap-2"
                  style={{ color: ACCENT }}
                  aria-hidden
                >
                  <span className="h-px w-10 border-t border-dashed border-current sm:w-14" />
                  <span className="text-sm">♥</span>
                  <span className="h-px w-10 border-t border-dashed border-current sm:w-14" />
                </div>
              </motion.div>

              <div className="relative mt-auto mb-auto flex flex-col items-center">
                <motion.div
                  aria-hidden
                  className="absolute bottom-6 left-1/2 h-16 w-56 -translate-x-1/2 rounded-full sm:h-20 sm:w-64"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(184,212,234,0.45) 45%, transparent 72%)",
                  }}
                  animate={
                    reduceMotion
                      ? { opacity: 0.7 }
                      : {
                          opacity: [0.55, 0.95, 0.55],
                          scale: [0.96, 1.04, 0.96],
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
                  aria-label="Tap the gift to open"
                  onClick={handleGiftTap}
                  className="relative z-10 focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="block"
                    animate={
                      reduceMotion ? undefined : { y: [0, -8, 0], rotate: 0 }
                    }
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                  >
                    <SkyGiftBox
                      variant="closed"
                      className="h-[15.5rem] w-[14.5rem] sm:h-[18rem] sm:w-[16.5rem]"
                    />
                  </motion.span>
                </motion.button>
              </div>

              <motion.span
                aria-hidden
                className="mt-4"
                style={{ color: "rgba(107,163,201,0.55)" }}
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, 5, 0], opacity: [0.35, 0.7, 0.35] }
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
