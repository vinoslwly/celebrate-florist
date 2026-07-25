"use client";

import { useId, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

const INK = "#1E3A5F";
const ACCENT = "#6BA3C9";
const INK_SOFT = "#5A7A9A";
const CTA_FROM = "#8EBFDE";
const CTA_TO = "#5B9BC8";
/** Matches sky gradient end — no hard seam at bottom. */
const SKY_BASE = "#C5DCEF";

type StageHint = "idle" | "nudge";

function SoftHeart({
  className,
  fill = "#7EB6D9",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={fill}>
      <path d="M12 21C12 21 3 14.5 3 8.8 3 5.9 5.2 4 7.6 4c1.5 0 2.9.8 3.7 2C12.1 4.8 13.5 4 15 4 17.4 4 19.6 5.9 19.6 8.8 19.6 14.5 12 21 12 21Z" />
    </svg>
  );
}

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <path
        d="M6 24 L42 8 L28 40 L22 28 Z"
        fill="#F7FBFE"
        stroke="#B8D4EA"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M22 28 L42 8" stroke="#6BA3C9" strokeWidth="1.2" />
      <path d="M22 28 L28 40" stroke="#6BA3C9" strokeWidth="1.2" />
    </svg>
  );
}

function SealedLetter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden fill="none">
      <rect
        x="4"
        y="8"
        width="56"
        height="36"
        rx="4"
        fill="#FFFEFB"
        stroke="#B8D4EA"
        strokeWidth="1.4"
      />
      <path
        d="M4 12 L32 30 L60 12"
        stroke="#6BA3C9"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M32 28c-3.2-2.5-5.2-4.1-5.2-6.2 0-1.6 1.2-2.7 2.6-2.7.9 0 1.8.5 2.6 1.6.8-1.1 1.7-1.6 2.6-1.6 1.4 0 2.6 1.1 2.6 2.7 0 2.1-2 3.7-5.2 6.2Z"
        fill="#7EB6D9"
      />
    </svg>
  );
}

function SatinSkyBow({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 140 80" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={`sky4bow-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C5E2F5" />
          <stop offset="40%" stopColor="#7EB6D9" />
          <stop offset="100%" stopColor="#4A8FBF" />
        </linearGradient>
        <filter
          id={`sky4bow-sh-${id}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#1E3A5F"
            floodOpacity="0.22"
          />
        </filter>
      </defs>
      <g filter={`url(#sky4bow-sh-${id})`}>
        <ellipse
          cx="36"
          cy="36"
          rx="32"
          ry="18"
          fill={`url(#sky4bow-${id})`}
          transform="rotate(-20 36 36)"
        />
        <ellipse
          cx="104"
          cy="36"
          rx="32"
          ry="18"
          fill={`url(#sky4bow-${id})`}
          transform="rotate(20 104 36)"
        />
        <ellipse
          cx="48"
          cy="28"
          rx="18"
          ry="12"
          fill={`url(#sky4bow-${id})`}
          transform="rotate(-8 48 28)"
          opacity="0.9"
        />
        <ellipse
          cx="92"
          cy="28"
          rx="18"
          ry="12"
          fill={`url(#sky4bow-${id})`}
          transform="rotate(8 92 28)"
          opacity="0.9"
        />
        <ellipse cx="70" cy="38" rx="14" ry="12" fill={`url(#sky4bow-${id})`} />
        <path
          d="M60 46 Q48 64 40 74"
          stroke={`url(#sky4bow-${id})`}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M80 46 Q92 64 100 74"
          stroke="#4A8FBF"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M70 48c-4.5-3.6-7.2-5.8-7.2-8.8 0-2.2 1.7-3.7 3.6-3.7 1.3 0 2.5.7 3.6 2.2 1.1-1.5 2.3-2.2 3.6-2.2 1.9 0 3.6 1.5 3.6 3.7 0 3-2.7 5.2-7.2 8.8Z"
          fill="#EEF4FA"
          stroke="#5B8FBA"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

function SkyBunnyWithLetter({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={`bunny-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C5E2F5" />
          <stop offset="55%" stopColor="#8EBFDE" />
          <stop offset="100%" stopColor="#6BA3C9" />
        </linearGradient>
        <filter
          id={`bunny-sh-${id}`}
          x="-15%"
          y="-10%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#1E3A5F"
            floodOpacity="0.25"
          />
        </filter>
      </defs>
      <g filter={`url(#bunny-sh-${id})`}>
        <ellipse cx="38" cy="28" rx="13" ry="24" fill={`url(#bunny-${id})`} />
        <ellipse cx="82" cy="28" rx="13" ry="24" fill={`url(#bunny-${id})`} />
        <ellipse cx="38" cy="30" rx="7" ry="14" fill="#EEF4FA" opacity="0.85" />
        <ellipse cx="82" cy="30" rx="7" ry="14" fill="#EEF4FA" opacity="0.85" />
        <ellipse cx="60" cy="52" rx="26" ry="24" fill={`url(#bunny-${id})`} />
        <ellipse cx="60" cy="92" rx="30" ry="32" fill={`url(#bunny-${id})`} />
        <ellipse
          cx="32"
          cy="90"
          rx="11"
          ry="16"
          fill={`url(#bunny-${id})`}
          transform="rotate(-16 32 90)"
        />
        <ellipse
          cx="88"
          cy="90"
          rx="11"
          ry="16"
          fill={`url(#bunny-${id})`}
          transform="rotate(16 88 90)"
        />
        <ellipse cx="46" cy="122" rx="13" ry="9" fill={`url(#bunny-${id})`} />
        <ellipse cx="74" cy="122" rx="13" ry="9" fill={`url(#bunny-${id})`} />
        <circle cx="50" cy="48" r="3" fill="#1E3A5F" />
        <circle cx="70" cy="48" r="3" fill="#1E3A5F" />
        <circle cx="51" cy="47" r="0.9" fill="#EEF4FA" />
        <circle cx="71" cy="47" r="0.9" fill="#EEF4FA" />
        <ellipse cx="60" cy="55" rx="2.8" ry="2" fill="#6BA3C9" />
        <ellipse cx="42" cy="56" rx="5" ry="3" fill="#FFC4D6" opacity="0.55" />
        <ellipse cx="78" cy="56" rx="5" ry="3" fill="#FFC4D6" opacity="0.55" />
        <path
          d="M48 68c-5-3-11-1-13 3 5 2 10 2 13-1 3 3 8 3 13 1-2-4-8-6-13-3Z"
          fill="#1E3A5F"
        />
        <circle cx="60" cy="70" r="3.2" fill="#4A6A8A" />
        <g transform="translate(28 78)">
          <rect
            x="8"
            y="8"
            width="48"
            height="34"
            rx="3"
            fill="#FFFEFB"
            stroke="#B8D4EA"
            strokeWidth="1.2"
          />
          <path
            d="M8 12 L32 28 L56 12"
            stroke="#6BA3C9"
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M32 36c-2.8-2.2-4.5-3.6-4.5-5.5 0-1.4 1.1-2.4 2.3-2.4.8 0 1.5.4 2.2 1.4.7-1 1.4-1.4 2.2-1.4 1.2 0 2.3 1 2.3 2.4 0 1.9-1.7 3.3-4.5 5.5Z"
            fill="#6BA3C9"
          />
        </g>
      </g>
    </svg>
  );
}

/**
 * sky.moments.letter-confirmation — Founder Scene 4 living recreation.
 * Slim mobile atmosphere: few static accents + light motion on hero pieces only.
 */
export function SkyLetterConfirmationScene({
  payload,
  onComplete,
}: SkyMomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hint, setHint] = useState<StageHint>("idle");
  const name = payload.experience.greeting_name?.trim() || "friend";

  function handleMaybeLater() {
    setHint("nudge");
    window.setTimeout(() => setHint("idle"), 1600);
  }

  return (
    <div
      className={cn(SCENE_VIEWPORT_SCROLL)}
      style={{
        backgroundColor: SKY_BASE,
        backgroundImage:
          "linear-gradient(180deg, #F7FBFE 0%, #E8F2FA 45%, #C5DCEF 100%)",
      }}
    >
      {/* Soft center light + warm blush — static, one paint layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255,255,255,0.55) 0%, transparent 70%),
            radial-gradient(ellipse 55% 40% at 50% 42%, rgba(255,232,214,0.4) 0%, transparent 68%)
          `,
        }}
      />

      {/* Sparse static accents — no rising/orbit loops */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[4]">
        <SoftHeart
          className="absolute top-[12%] left-[8%] h-6 w-6 opacity-55"
          fill="#E8A0B8"
        />
        <SoftHeart
          className="absolute top-[18%] right-[10%] h-5 w-5 opacity-50"
          fill="#7EB6D9"
        />
        <SoftHeart
          className="absolute bottom-[22%] left-[10%] h-5 w-5 opacity-45"
          fill="#E8A0B8"
        />
        <SealedLetter className="absolute top-[14%] left-[4%] h-9 w-12 opacity-80 drop-shadow-sm sm:left-[7%]" />
        <SealedLetter className="absolute top-[26%] right-[3%] h-8 w-11 opacity-75 drop-shadow-sm sm:right-[6%]" />
        {!reduceMotion ? (
          <motion.div
            className="absolute top-[10%] right-[6%] sm:right-[9%]"
            animate={{ y: [0, 8, 0], rotate: [8, -4, 8] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <PaperPlane className="h-11 w-11 opacity-85 sm:h-12 sm:w-12" />
          </motion.div>
        ) : (
          <PaperPlane className="absolute top-[10%] right-[6%] h-11 w-11 opacity-80 sm:right-[9%]" />
        )}
      </div>

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-3 py-5 sm:px-6 sm:py-6">
        <motion.p
          className="mb-1 max-w-sm text-center font-serif text-sm italic sm:mb-2 sm:text-base"
          style={{ color: INK }}
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {name}, a quiet moment was wrapped just for you…
        </motion.p>

        <div className="relative w-full max-w-md">
          <motion.div
            className="relative pt-11 pb-[4.5rem] sm:pb-20"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute top-6 right-[-10%] bottom-0 left-[-10%] rounded-[2rem]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(255,252,248,0.85) 0%, rgba(214,234,248,0.35) 55%, transparent 78%)",
                filter: "blur(10px)",
              }}
            />

            <motion.div
              className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2"
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SatinSkyBow className="h-16 w-[7.5rem] sm:h-[4.5rem] sm:w-32" />
            </motion.div>

            <article
              className="relative rounded-2xl bg-white/96 px-6 pt-12 pb-10 sm:px-10 sm:pt-14 sm:pb-12"
              style={{
                border: `1.5px dashed ${ACCENT}`,
                boxShadow:
                  "0 24px 56px -18px rgba(30,58,95,0.36), 0 0 0 1px rgba(184,212,234,0.45)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3 rounded-xl"
                style={{ border: `1px dashed rgba(107,163,201,0.5)` }}
              />

              <div className="relative text-center">
                <p
                  className="text-[10px] font-semibold tracking-[0.28em] uppercase sm:text-[11px]"
                  style={{ color: ACCENT }}
                >
                  {"// Special message"}
                </p>

                <h2
                  className="mt-4 font-serif text-[1.35rem] leading-snug sm:text-[1.6rem]"
                  style={{ color: INK }}
                >
                  Someone has left a message full of warmth for you.
                </h2>

                <div
                  className="my-5 flex items-center justify-center gap-3"
                  style={{ color: ACCENT }}
                >
                  <span className="h-px w-12 bg-current" aria-hidden />
                  <SoftHeart className="h-5 w-5" fill="#E8A0B8" />
                  <span className="h-px w-12 bg-current" aria-hidden />
                </div>

                <p
                  className="font-serif text-base italic sm:text-lg"
                  style={{ color: INK_SOFT }}
                >
                  Would you like to open it?
                </p>

                <motion.button
                  type="button"
                  aria-label="Yes, open message"
                  onClick={onComplete}
                  className="mt-7 w-full rounded-full px-6 py-4 text-sm font-bold tracking-[0.12em] text-white uppercase focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none sm:text-[15px]"
                  style={{
                    background: `linear-gradient(180deg, ${CTA_FROM} 0%, ${CTA_TO} 100%)`,
                    boxShadow: "0 12px 28px -10px rgba(30,58,95,0.48)",
                  }}
                  animate={
                    hint === "nudge"
                      ? { scale: [1, 1.04, 1, 1.04, 1] }
                      : reduceMotion
                        ? { scale: 1 }
                        : { scale: [1, 1.015, 1] }
                  }
                  transition={
                    hint === "nudge"
                      ? { duration: 0.75 }
                      : {
                          duration: 2.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
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
                  style={{ color: ACCENT }}
                >
                  No, maybe later
                </button>

                {hint === "nudge" ? (
                  <motion.p
                    className="mt-3 font-serif text-xs italic"
                    style={{ color: INK_SOFT }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    It&apos;s alright — the message is waiting softly for you…
                  </motion.p>
                ) : null}
              </div>
            </article>

            <motion.div
              className="pointer-events-none absolute -bottom-3 -left-4 z-30 sm:-bottom-4 sm:-left-6"
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SkyBunnyWithLetter className="h-[8.5rem] w-auto drop-shadow-lg sm:h-[10rem]" />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute -right-3 -bottom-2 z-30 sm:-right-5 sm:-bottom-3"
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{
                duration: 4.6,
                delay: 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SkyGiftBox
                variant="closed"
                className="h-[7.25rem] w-[6.75rem] sm:h-[8.5rem] sm:w-[8rem]"
              />
            </motion.div>
          </motion.div>
        </div>

        <p
          className="mt-1 max-w-xs text-center font-serif text-xs italic sm:mt-2 sm:text-sm"
          style={{ color: INK_SOFT }}
        >
          Made with love · Open when your heart is ready
        </p>
      </div>
    </div>
  );
}
