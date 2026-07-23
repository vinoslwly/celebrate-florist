"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.16, 1.25, 0.3, 1] as const;

const GOLD = "#C9A24A";
const GOLD_SOFT = "#E8D090";
const INK = "#3A1A14";

/** Theme Lab Scene 8 — KF1 glow 1.5s, KF2 letter 2s (total 3.5s). */
export const WARM_TREASURES_FINAL_UNLOCK_DURATION_MS = 3500;
const KF2_AT_MS = 1500;

const SPARKLES = [
  { top: "18%", left: "18%", delay: 0, size: 3 },
  { top: "14%", left: "52%", delay: 0.25, size: 4 },
  { top: "22%", left: "78%", delay: 0.5, size: 3 },
  { top: "36%", left: "12%", delay: 0.15, size: 3.5 },
  { top: "32%", left: "88%", delay: 0.4, size: 3 },
  { top: "48%", left: "28%", delay: 0.7, size: 4 },
  { top: "46%", left: "70%", delay: 0.35, size: 3 },
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
        fill="#C42838"
        opacity="0.88"
      />
    </svg>
  );
}

/**
 * warm.treasures.final-gift-unlock — Scene 8.
 * KF1: open gold gift + elegant glow (no fireworks).
 * KF2: To/From letter head emerges from the gold gift.
 * Warm crimson/gold — mirrors Bloom Treasures structure.
 */
export function WarmTreasuresFinalGiftUnlockScene({
  payload,
}: WarmTreasuresSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"glow" | "letter">("glow");
  const toName = payload.experience.greeting_name;
  const fromName = payload.experience.closing_name;
  const displayPhase = reduceMotion ? "letter" : phase;

  useEffect(() => {
    if (reduceMotion) return;
    const toLetter = window.setTimeout(() => setPhase("letter"), KF2_AT_MS);
    return () => window.clearTimeout(toLetter);
  }, [reduceMotion]);

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
      style={{ backgroundColor: "#2A0509" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 85% 70% at 50% 42%, rgba(201,162,74,0.28) 0%, transparent 55%)",
            "radial-gradient(ellipse 90% 75% at 28% 20%, rgba(180,40,55,0.4) 0%, transparent 55%)",
            "radial-gradient(ellipse 130% 90% at 50% 118%, #0A0103 0%, transparent 48%)",
            "linear-gradient(165deg, #5A121A 0%, #3A080C 42%, #1A0406 100%)",
          ].join(", "),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
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
              className="pointer-events-none absolute z-[1] rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                backgroundColor: GOLD_SOFT,
                boxShadow: "0 0 10px rgba(232,208,144,0.7)",
              }}
              animate={{ opacity: [0.2, 1, 0.25], scale: [0.7, 1.3, 0.8] }}
              transition={{
                duration: 2.2,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        : null}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="relative mx-auto w-full max-w-sm">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[38%] left-1/2 z-0 h-56 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-64 sm:w-72"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,248,230,0.95) 0%, rgba(240,216,120,0.55) 35%, rgba(201,162,74,0.25) 55%, transparent 72%)",
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
                  "conic-gradient(from 200deg at 50% 100%, transparent 0deg, rgba(240,216,120,0.5) 25deg, transparent 55deg, rgba(201,162,74,0.35) 90deg, transparent 120deg)",
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
                <div
                  className="relative overflow-hidden rounded-md px-4 pt-5 pb-6 sm:px-5 sm:pt-6 sm:pb-7"
                  style={{
                    background:
                      "linear-gradient(165deg, #FFFCF8 0%, #FFF6EC 55%, #F5E8D8 100%)",
                    boxShadow:
                      "0 20px 44px -18px rgba(40,8,12,0.55), 0 0 0 1px rgba(201,162,74,0.45)",
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-2 rounded-sm border"
                    style={{ borderColor: "rgba(201,162,74,0.5)" }}
                  />

                  <p
                    className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
                    style={{ color: GOLD }}
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
                    style={{ color: GOLD }}
                  >
                    <span className="h-px w-8 bg-current" aria-hidden />
                    <svg width="12" height="10" viewBox="0 0 14 12" fill="none">
                      <path
                        d="M7 11S1.8 7.5.8 4.8C.1 3.2 1.2 1.4 3 1.4c1.1 0 2 .7 2.4 1.5C5.8 2.1 6.7 1.4 7.8 1.4c1.8 0 2.9 1.8 2.2 3.4C9.2 7.5 7 11 7 11Z"
                        fill={GOLD}
                      />
                    </svg>
                    <span className="h-px w-8 bg-current" aria-hidden />
                  </div>

                  <p
                    className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
                    style={{ color: GOLD }}
                  >
                    From:
                  </p>
                  <p
                    className="mt-1 text-center font-serif text-xl font-semibold sm:text-2xl"
                    style={{ color: INK }}
                  >
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
            <WarmGiftBox
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
