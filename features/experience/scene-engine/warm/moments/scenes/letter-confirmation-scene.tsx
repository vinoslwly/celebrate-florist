"use client";

import { useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";

/** Match Warm Scenes 2–3 field so the journey reads as one atmosphere. */
const BG = "#6B0F16";
const GOLD = "#C9A227";
const GOLD_SOFT = "#D4AF37";
const CREAM = "#FFF8F2";
const LABEL = "#C45B6A";
const BODY = "#5C3A3A";
const QUESTION = "#8B1A22";

type StageHint = "idle" | "nudge";

function GoldBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 72" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="warmScene4Ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D78A" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A67C1A" />
        </linearGradient>
      </defs>
      <ellipse
        cx="34"
        cy="34"
        rx="28"
        ry="16"
        fill="url(#warmScene4Ribbon)"
        transform="rotate(-18 34 34)"
      />
      <ellipse
        cx="86"
        cy="34"
        rx="28"
        ry="16"
        fill="url(#warmScene4Ribbon)"
        transform="rotate(18 86 34)"
      />
      <ellipse cx="60" cy="36" rx="12" ry="11" fill="#D4AF37" />
      <path
        d="M52 42 Q44 58 38 66"
        stroke="#D4AF37"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 42 Q76 58 82 66"
        stroke="#A67C1A"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="36" r="4" fill="#FFF4E8" />
    </svg>
  );
}

/** L-shaped gold corner brackets — Founder Scene 4 frame. */
function CornerBracket({
  className,
  flipX,
  flipY,
}: {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      aria-hidden
      fill="none"
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
    >
      <path
        d="M4 24V8C4 5.8 5.8 4 8 4H24"
        stroke={GOLD_SOFT}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#8B1A22"
        opacity="0.55"
      />
    </svg>
  );
}

/**
 * Warm Moments Scene 4 — Letter Confirmation.
 * Cream card on shared Warm crimson field; Yes → Scene 5 hold.
 */
export function WarmLetterConfirmationScene({ onComplete }: MomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hint, setHint] = useState<StageHint>("idle");

  function handleMaybeLater() {
    setHint("nudge");
    window.setTimeout(() => setHint("idle"), 1200);
  }

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ backgroundColor: BG }}>
      {/* Shared Warm atmosphere — same family as Scenes 2–3 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 8% 18%, rgba(30,4,8,0.5) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 55%, rgba(120,24,32,0.4) 0%, transparent 70%), radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(30,4,8,0.45) 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 14% 10%, rgba(255,220,190,0.12) 0%, transparent 55%)",
        }}
        animate={
          reduceMotion ? { opacity: 0.55 } : { opacity: [0.3, 0.7, 0.35] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[18%] left-[12%] opacity-50"
            animate={{ y: [0, -8, 0], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <SoftPetal className="h-7 w-5 rotate-[-20deg]" />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-[14%] bottom-[20%] opacity-55"
            animate={{ y: [0, 6, 0], opacity: [0.3, 0.55, 0.3] }}
            transition={{
              duration: 7,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SoftPetal className="h-8 w-6 rotate-[28deg]" />
          </motion.div>
        </>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
        <motion.div
          className="relative w-full max-w-md pt-8"
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Gold bow perched on card top */}
          <div className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2">
            <GoldBow className="h-14 w-24 sm:h-16 sm:w-28" />
          </div>

          <article
            className="relative rounded-2xl px-6 pt-12 pb-7 sm:px-10 sm:pt-14 sm:pb-8"
            style={{
              backgroundColor: CREAM,
              border: `2px solid ${GOLD}`,
              boxShadow: `0 22px 55px -18px rgba(40,0,0,0.55), 0 0 0 1px rgba(201,162,39,0.3)`,
            }}
          >
            <CornerBracket className="pointer-events-none absolute top-4 left-4 h-7 w-7 opacity-90" />
            <CornerBracket
              flipX
              className="pointer-events-none absolute top-4 right-4 h-7 w-7 opacity-90"
            />
            <CornerBracket
              flipY
              className="pointer-events-none absolute bottom-4 left-4 h-7 w-7 opacity-90"
            />
            <CornerBracket
              flipX
              flipY
              className="pointer-events-none absolute right-4 bottom-4 h-7 w-7 opacity-90"
            />

            <div className="relative text-center">
              <p
                className="text-[10px] font-semibold tracking-[0.28em] uppercase italic sm:text-[11px]"
                style={{ color: LABEL }}
              >
                {"// Special message"}
              </p>

              <h2
                className="mt-5 font-serif text-xl leading-snug sm:text-2xl"
                style={{ color: BODY }}
              >
                Someone has left a message full of warmth for you.
              </h2>

              <p
                className="mt-5 text-base font-semibold italic sm:text-lg"
                style={{ color: QUESTION }}
              >
                Would you like to open it?
              </p>

              <motion.button
                type="button"
                aria-label="Yes, open message"
                onClick={onComplete}
                className="mt-8 w-full rounded-full px-6 py-3.5 text-sm font-bold tracking-[0.12em] text-white uppercase focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:outline-none sm:text-[15px]"
                style={{
                  background: `linear-gradient(90deg, #8B1A22 0%, #A51C28 35%, #C9A227 100%)`,
                  boxShadow: `0 10px 28px -8px rgba(107,15,22,0.65)`,
                }}
                animate={
                  hint === "nudge"
                    ? { scale: [1, 1.04, 1, 1.04, 1] }
                    : { scale: 1 }
                }
                transition={
                  hint === "nudge" ? { duration: 0.7 } : { duration: 0.2 }
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes, open message{" "}
                <span aria-hidden className="ml-1">
                  ♥
                </span>
              </motion.button>

              <button
                type="button"
                onClick={handleMaybeLater}
                className="mt-4 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors focus-visible:underline focus-visible:outline-none"
                style={{ color: LABEL }}
              >
                No, maybe later
              </button>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
