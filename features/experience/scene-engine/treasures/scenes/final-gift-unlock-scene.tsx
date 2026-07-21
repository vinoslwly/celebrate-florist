"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.16, 1.25, 0.3, 1] as const;

/** Theme Lab Scene 8 — KF1 glow 1.5s, KF2 letter 2s (total 3.5s). */
export const TREASURES_FINAL_UNLOCK_DURATION_MS = 3500;
const KF2_AT_MS = 1500;

const SPARKLES = [
  { top: "18%", left: "18%", delay: 0 },
  { top: "14%", left: "52%", delay: 0.25 },
  { top: "22%", left: "78%", delay: 0.5 },
  { top: "36%", left: "12%", delay: 0.15 },
  { top: "32%", left: "88%", delay: 0.4 },
  { top: "48%", left: "28%", delay: 0.7 },
  { top: "46%", left: "70%", delay: 0.35 },
] as const;

const PETALS = [
  { left: "8%", delay: 0.2, duration: 8, size: 14, x: 12 },
  { left: "28%", delay: 1.1, duration: 9, size: 12, x: -10 },
  { left: "62%", delay: 0.5, duration: 7.5, size: 16, x: 8 },
  { left: "84%", delay: 1.4, duration: 8.5, size: 13, x: -12 },
] as const;

function SoftPetal({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={size}
      height={size * 1.33}
      aria-hidden
      fill="none"
    >
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.88"
      />
    </svg>
  );
}

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

/**
 * Scene 8 — Final Gift Unlock (Theme Lab living, two keyframes).
 * KF1: open gold gift + elegant glow (no fireworks).
 * KF2: To/From letter head emerges from the gold gift
 *       (like Memories/Connection letter-emergence, gold gift motif).
 */
export function TreasuresFinalGiftUnlockScene({
  payload,
}: TreasuresSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"glow" | "letter">("glow");
  const toName = payload.experience.greeting_name;
  const fromName = payload.experience.closing_name;

  // Reduced motion skips KF1; derive letter phase instead of syncing via setState.
  const displayPhase = reduceMotion ? "letter" : phase;

  useEffect(() => {
    if (reduceMotion) return;
    const toLetter = window.setTimeout(() => setPhase("letter"), KF2_AT_MS);
    return () => window.clearTimeout(toLetter);
  }, [reduceMotion]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 80% at 50% 42%, #FFF4EC 0%, #FFE0EB 35%, #F5B8C8 68%, #E890A8 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 55%, rgba(255,236,180,0.45) 0%, transparent 70%)",
        }}
      />

      {!reduceMotion
        ? PETALS.map((p, i) => (
            <motion.div
              key={`petal-${i}`}
              className="pointer-events-none absolute top-[-8%] z-[1]"
              style={{ left: p.left }}
              animate={{
                y: ["0vh", "110vh"],
                opacity: [0, 0.75, 0.5, 0],
                rotate: [0, 35, -15],
                x: [0, p.x],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal size={p.size} />
            </motion.div>
          ))
        : null}

      {!reduceMotion
        ? SPARKLES.map((s, i) => (
            <motion.span
              key={`spark-${i}`}
              className="pointer-events-none absolute z-[1] text-sm text-[#FFF6D0]"
              style={{ top: s.top, left: s.left }}
              animate={{ opacity: [0.2, 1, 0.25], scale: [0.7, 1.25, 0.8] }}
              transition={{
                duration: 2.2,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.span>
          ))
        : null}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="relative mx-auto w-full max-w-sm">
          {/* Warm gold glow from the open gift */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[38%] left-1/2 z-0 h-56 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-64 sm:w-72"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,248,210,0.98) 0%, rgba(240,200,100,0.55) 38%, transparent 70%)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.9 }
                : { opacity: [0.55, 1, 0.7], scale: [0.92, 1.08, 0.98] }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Light rays — KF1 emphasis */}
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-[20%] left-1/2 z-0 h-40 w-48 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: displayPhase === "glow" ? [0.35, 0.7, 0.4] : 0.25,
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "conic-gradient(from 200deg at 50% 100%, transparent 0deg, rgba(255,240,200,0.55) 25deg, transparent 55deg, rgba(255,230,160,0.4) 90deg, transparent 120deg)",
                maskImage:
                  "radial-gradient(ellipse at 50% 100%, black 0%, transparent 75%)",
              }}
            />
          ) : null}

          <AnimatePresence mode="sync">
            {displayPhase === "letter" ? (
              <motion.div
                key="letter"
                className="relative z-20 mx-auto w-[11.5rem] sm:w-[13rem]"
                initial={
                  reduceMotion ? false : { y: 72, opacity: 0, scale: 0.88 }
                }
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.15, ease: EASE_POP }}
                role="img"
                aria-label={`Letter to ${toName} from ${fromName}`}
              >
                <div className="relative overflow-hidden rounded-md border border-[#E8C878]/8 bg-[#FFFCF5] px-4 pt-5 pb-6 shadow-[0_20px_44px_-18px_rgba(140,100,40,0.45)] sm:px-5 sm:pt-6 sm:pb-7">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-2 rounded-sm border border-[#E8C878]/55"
                  />
                  <SakuraMark className="pointer-events-none absolute top-3 right-3 h-5 w-5 opacity-85" />
                  <SakuraMark className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 opacity-75" />

                  <p className="text-center text-[10px] font-semibold tracking-[0.22em] text-[#B8860B] uppercase sm:text-[11px]">
                    To:
                  </p>
                  <p className="mt-1 text-center font-serif text-2xl font-semibold text-[#6B3048] sm:text-3xl">
                    {toName}
                  </p>

                  <div className="my-4 flex items-center justify-center gap-2 text-[#D4AF37]">
                    <span className="h-px w-8 bg-current" aria-hidden />
                    <span className="text-xs" aria-hidden>
                      ♥
                    </span>
                    <span className="h-px w-8 bg-current" aria-hidden />
                  </div>

                  <p className="text-center text-[10px] font-semibold tracking-[0.22em] text-[#B8860B] uppercase sm:text-[11px]">
                    From:
                  </p>
                  <p className="mt-1 text-center font-serif text-xl font-semibold text-[#6B3048] sm:text-2xl">
                    {fromName}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="spacer"
                className="relative z-20 mx-auto h-[7.5rem] w-[11.5rem] sm:h-[8.5rem] sm:w-[13rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                aria-hidden
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative z-10 -mt-6 flex justify-center sm:-mt-8"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            aria-hidden
          >
            <BloomGiftBox
              variant="open"
              tone="gold"
              animateLid={!reduceMotion}
              reduceMotion={reduceMotion}
              className="h-40 w-[20rem] sm:h-44 sm:w-[22rem]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
