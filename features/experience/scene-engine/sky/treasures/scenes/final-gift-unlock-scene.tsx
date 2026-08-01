"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.16, 1.25, 0.3, 1] as const;

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY_SOFT = "#C5DCEF";
const CREAM = "#FFFEFB";

/** Theme Lab Scene 8 — KF1 glow 1.5s, KF2 letter 2s (total 3.5s). */
export const SKY_TREASURES_FINAL_UNLOCK_DURATION_MS = 3500;
const KF2_AT_MS = 1500;

const SPARKLES = [
  { top: "16%", left: "16%", delay: 0, size: 10 },
  { top: "12%", left: "50%", delay: 0.2, size: 12 },
  { top: "18%", left: "78%", delay: 0.4, size: 10 },
  { top: "34%", left: "14%", delay: 0.15, size: 9 },
  { top: "30%", left: "86%", delay: 0.35, size: 9 },
] as const;

function SoftStar({
  className,
  fill = "#F0D878",
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

function SoftCloudMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden fill="none">
      <path
        d="M8 16 C4 16 2 12 6 10 C6 6 12 4 16 8 C20 4 28 6 28 11 C32 10 34 14 30 16 Z"
        fill="#A8D0EA"
        opacity="0.85"
      />
    </svg>
  );
}

/**
 * sky.treasures.final-gift-unlock — Scene 8.
 * KF1: open pearl gift + elegant white glow (no fireworks · no gold).
 * KF2: To/From letter head emerges from the pearl gift.
 * Bloom structure · Sky Final Pearl.
 */
export function SkyTreasuresFinalGiftUnlockScene({
  payload,
}: SkyTreasuresSceneProps) {
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
    <div className={SCENE_VIEWPORT_LOCK} style={{ backgroundColor: SKY_SOFT }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,255,255,0.85) 0%, transparent 58%)",
            `linear-gradient(180deg, #E8F2FA 0%, ${SKY_SOFT} 52%, ${SKY_SOFT} 100%)`,
          ].join(", "),
        }}
      />

      {/* Soft pearl ambient — one-shot stars around unlock */}
      {!reduceMotion
        ? SPARKLES.map((s, i) => (
            <motion.span
              key={`spark-${i}`}
              className="pointer-events-none absolute z-[1]"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 0.7, 0],
                scale: [0.5, 1.2, 1, 0.8],
              }}
              transition={{
                delay: 0.3 + s.delay,
                duration: 2.4,
                ease: EASE_OUT,
              }}
            >
              <SoftStar
                className="h-full w-full"
                fill={i % 2 === 0 ? "#FFFFFF" : "#F0D878"}
              />
            </motion.span>
          ))
        : null}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="relative mx-auto w-full max-w-sm">
          {/* Soft white / pearl glow from the open gift */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[38%] left-1/2 z-0 h-56 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-64 sm:w-72"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(232,244,252,0.75) 32%, rgba(168,208,234,0.28) 55%, transparent 72%)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.9 }
                : { opacity: [0.55, 1, 0.72], scale: [0.92, 1.06, 0.98] }
            }
            transition={{
              duration: 2.6,
              repeat: reduceMotion ? 0 : 2,
              ease: "easeInOut",
            }}
          />

          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-[20%] left-1/2 z-0 h-40 w-48 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: displayPhase === "glow" ? [0.3, 0.65, 0.35] : 0.2,
              }}
              transition={{
                duration: 1.8,
                repeat: displayPhase === "glow" ? 2 : 0,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "conic-gradient(from 200deg at 50% 100%, transparent 0deg, rgba(255,255,255,0.65) 25deg, transparent 55deg, rgba(200,220,236,0.4) 90deg, transparent 120deg)",
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
                    background: `linear-gradient(165deg, ${CREAM} 0%, #F4F8FC 50%, #E8F0F8 100%)`,
                    boxShadow:
                      "0 20px 44px -18px rgba(30,58,95,0.35), 0 0 0 1px rgba(200,216,232,0.75)",
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-2 rounded-sm border"
                    style={{ borderColor: "rgba(168,200,224,0.55)" }}
                  />
                  <SoftCloudMark className="pointer-events-none absolute top-3 right-3 h-4 w-6 opacity-80" />
                  <SoftCloudMark className="pointer-events-none absolute bottom-3 left-3 h-3.5 w-5 opacity-70" />

                  <p
                    className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
                    style={{ color: INK_SOFT }}
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
                    style={{ color: INK_SOFT }}
                  >
                    <span className="h-px w-8 bg-current" aria-hidden />
                    <SoftStar className="h-3 w-3" fill="#7EB6D9" />
                    <span className="h-px w-8 bg-current" aria-hidden />
                  </div>

                  <p
                    className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
                    style={{ color: INK_SOFT }}
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
            <div className="drop-shadow-[0_0_36px_rgba(255,255,255,0.85)]">
              <SkyGiftBox
                variant="open"
                tone="pearl"
                animateLid={!reduceMotion}
                reduceMotion={reduceMotion}
                className="h-40 w-[20rem] sm:h-44 sm:w-[22rem]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
