"use client";

import { useCallback, useState, type ReactNode } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { LetterTypewriterBody } from "@/features/experience/scene-engine/shared/letter-typewriter";
import {
  allowAmbientLoop,
  MOTION_DURATION,
  MOTION_EASE,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

const INK = "#1E3A5F";
const HAND = "#3D7AAD";
const CTA_FROM = "#8EBFDE";
const CTA_TO = "#4A8FBF";
const PAPER = "#FFFEFB";

function splitLetterBody(body: string): string[] {
  const trimmed = body.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/(?<=[.!?…])\s+/).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}

function Reveal({
  children,
  delay,
  duration = MOTION_DURATION.base,
  className,
  reduceMotion,
}: {
  children: ReactNode;
  delay: number;
  duration?: number;
  className?: string;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: MOTION_EASE.out,
      }}
    >
      {children}
    </motion.div>
  );
}

function SoftStar({
  className,
  fill = "#7EB6D9",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill={fill}>
      <path d="M24 5 L28.5 18.5 L43 20 L32 29.5 L35.5 44 L24 36 L12.5 44 L16 29.5 L5 20 L19.5 18.5 Z" />
    </svg>
  );
}

function FeltStar({
  className,
  fill = "#5B9BC8",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M32 5 L38 23 L57 24.5 L42 36 L46.5 54 L32 44.5 L17.5 54 L22 36 L7 24.5 L26 23 Z"
        fill={fill}
        stroke="#3D6F9C"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M32 12 L36.5 24 L48 25 L39 33 L41.5 45 L32 38.5 L22.5 45 L25 33 L16 25 L27.5 24 Z"
        fill="none"
        stroke="#EEF4FA"
        strokeWidth="0.9"
        strokeDasharray="2 2"
        opacity="0.7"
      />
    </svg>
  );
}

function SoftStarOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      fill="none"
      stroke="#8EBFDE"
      strokeWidth="2"
    >
      <path d="M24 6 L28 18 L41 19.5 L31.5 28.5 L34.5 41 L24 34 L13.5 41 L16.5 28.5 L7 19.5 L20 18 Z" />
    </svg>
  );
}

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden fill="none">
      <path
        d="M6 26 L46 8 L32 44 L24 30 Z"
        fill="#FFFEFB"
        stroke="#6BA3C9"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M24 30 L46 8" stroke="#4A8FBF" strokeWidth="1.3" />
      <path d="M24 30 L32 44" stroke="#4A8FBF" strokeWidth="1.3" />
    </svg>
  );
}

function PaperClip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 44" className={className} aria-hidden fill="none">
      <path
        d="M8 12 V31 C8 36 11.5 39 15.5 39 C19.5 39 23 36 23 31 V11 C23 7.8 20.7 5.5 17.5 5.5 C14.3 5.5 12 7.8 12 11 V29"
        stroke="#A8B8C4"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SoftCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 70" className={className} aria-hidden fill="none">
      <ellipse cx="42" cy="42" rx="34" ry="22" fill="#D6EAF8" />
      <ellipse cx="78" cy="36" rx="40" ry="26" fill="#F7FBFE" />
      <ellipse cx="110" cy="44" rx="28" ry="18" fill="#C5E2F5" />
    </svg>
  );
}

function HeartMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden>
      <path
        d="M10 16.5S2.8 11.6 1.2 7.8C.2 5.4 1.6 2.8 4.2 2.8c1.5 0 2.7.9 3.3 2 .6-1.1 1.8-2 3.3-2 2.6 0 4 2.6 3 5C17.2 11.6 10 16.5 10 16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MiniFlower({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="18"
          cy="10"
          rx="4.5"
          ry="8"
          fill="#8EBFDE"
          transform={`rotate(${deg} 18 18)`}
        />
      ))}
      <circle cx="18" cy="18" r="3.8" fill="#EEF4FA" />
    </svg>
  );
}

function ScrapLayer({
  className,
  fill,
  rotate = 0,
  clip,
}: {
  className?: string;
  fill: string;
  rotate?: number;
  clip: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute shadow-md", className)}
      style={{
        background: fill,
        clipPath: clip,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

/**
 * sky.moments.letter — Founder Scene 6.
 * Emotional scrapbook letter: soft sky + layered papers around the note.
 * No "Celebrate the sky" ticket.
 */
export function SkyLetterScene({ payload, onComplete }: SkyMomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);
  const { experience } = payload;
  const toName = experience.greeting_name?.trim() || "friend";
  const fromName = experience.closing_name?.trim() || "Someone who loves you";
  const closing = experience.letter_closing?.trim() || "With love,";
  const bodyChunks = splitLetterBody(experience.letter_content ?? "");
  const [signOff, setSignOff] = useState(reduceMotion);
  const finishBody = useCallback(() => setSignOff(true), []);

  const pace = (n: number) => (reduceMotion ? 0 : n);

  return (
    <div
      className={cn(SCENE_VIEWPORT_SCROLL)}
      style={{
        backgroundColor: "#C5DCEF",
        backgroundImage:
          "linear-gradient(175deg, #F4FAFE 0%, #D6EAF8 40%, #B8D4EA 78%, #A8D0EA 100%)",
      }}
    >
      {/* Soft peach-sky warmth behind the letter */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,255,255,0.55) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 50% 45%, rgba(255,232,214,0.3) 0%, transparent 65%)
          `,
        }}
      />

      {/* Soft ambient stars in the sky field */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        <SoftStar className="absolute top-[5%] left-[8%] h-5 w-5 opacity-45" />
        <SoftStar
          className="absolute top-[10%] right-[10%] h-4 w-4 opacity-40"
          fill="#8EBFDE"
        />
        <SoftStarOutline className="absolute top-[28%] left-[5%] h-6 w-6 opacity-50" />
        <SoftStar
          className="absolute bottom-[20%] left-[6%] h-5 w-5 opacity-40"
          fill="#6BA3C9"
        />
      </div>

      {/* Clouds — keep inside viewport on mobile */}
      <SoftCloud className="pointer-events-none absolute right-0 bottom-[1%] z-[3] h-20 w-40 opacity-90 sm:right-[-2%] sm:h-24 sm:w-48" />
      <SoftCloud className="pointer-events-none absolute right-[18%] bottom-[-2%] z-[2] h-14 w-32 opacity-75 sm:h-16 sm:w-36" />
      <SoftCloud className="pointer-events-none absolute left-0 bottom-[3%] z-[2] h-16 w-36 opacity-70 scale-x-[-1] sm:left-[-2%] sm:h-20 sm:w-40" />

      {/* Paper plane — keep fully inside viewport on mobile */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[10%] bottom-[14%] z-[6] sm:right-[11%] sm:bottom-[14%]"
        animate={ambient ? { y: [0, -9, 0], rotate: [10, 3, 10] } : undefined}
        transition={
          ambient
            ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <svg
          className="absolute -top-9 -left-12 h-10 w-16 opacity-70 sm:-top-11 sm:-left-20 sm:h-14 sm:w-24 sm:opacity-75"
          viewBox="0 0 96 56"
          aria-hidden
          fill="none"
        >
          <path
            d="M4 48 Q36 10 88 18"
            stroke="#7EB6D9"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        </svg>
        <PaperPlane className="h-9 w-9 drop-shadow-md sm:h-14 sm:w-14" />
      </motion.div>

      {/* Side gutters on the flex shell — absolute children live in the inner box only */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-3 py-10 sm:px-10 sm:py-12">
        <div className="relative w-full max-w-[min(100%,24rem)] sm:max-w-xl">
          {/* Scrap layers — hug letter; never flush to composition edge on mobile */}
          <ScrapLayer
            className="-top-2 left-2 h-[96%] w-[48%] sm:-left-4 sm:w-[52%]"
            fill="repeating-linear-gradient(90deg, #C5DCEF 0 1px, #F7FBFE 1px 13px), #EEF4FA"
            rotate={-6}
            clip="polygon(1% 4%, 96% 0%, 100% 94%, 88% 100%, 2% 96%, 0% 20%)"
          />
          <ScrapLayer
            className="-top-1 right-2 h-[92%] w-[44%] sm:-right-3 sm:w-[48%]"
            fill="#7EB6D9"
            rotate={5}
            clip="polygon(0% 6%, 96% 0%, 100% 90%, 82% 100%, 4% 96%)"
          />
          <ScrapLayer
            className="top-6 left-[10%] h-[86%] w-[74%] sm:left-[6%] sm:w-[78%]"
            fill="#5B9BC8"
            rotate={-2}
            clip="polygon(0% 3%, 100% 0%, 98% 97%, 5% 100%, 0% 30%)"
          />
          <ScrapLayer
            className="-bottom-1 left-[14%] h-14 w-[58%] sm:-bottom-2 sm:left-[10%] sm:h-20 sm:w-[62%]"
            fill="repeating-linear-gradient(0deg, transparent 0 11px, rgba(90,140,180,0.22) 11px 12px), #F0F6FB"
            rotate={-3}
            clip="polygon(0% 22%, 100% 0%, 98% 100%, 3% 90%)"
          />

          {/* Felt stars — sit on the letter edge, clear of viewport */}
          <motion.div
            className="pointer-events-none absolute -top-2 -left-1 z-[8] sm:-top-3 sm:-left-2"
            initial={reduceMotion ? false : { scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{
              delay: pace(0.28),
              type: "spring",
              stiffness: 160,
              duration: reduceMotion ? MOTION_DURATION.instant : undefined,
            }}
          >
            <FeltStar
              className="h-8 w-8 drop-shadow-md sm:h-12 sm:w-12"
              fill="#4A8FBF"
            />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute top-[18%] -left-2 z-[8] sm:-left-3"
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: pace(0.38),
              type: "spring",
              stiffness: 160,
              duration: reduceMotion ? MOTION_DURATION.instant : undefined,
            }}
          >
            <FeltStar
              className="h-6 w-6 drop-shadow sm:h-8 sm:w-8"
              fill="#7EB6D9"
            />
          </motion.div>
          <SoftStarOutline className="pointer-events-none absolute -top-1 left-[28%] z-[8] h-5 w-5 opacity-80 sm:h-6 sm:w-6" />
          <motion.div
            className="pointer-events-none absolute top-[54%] -right-2 z-[8] sm:-right-3"
            initial={reduceMotion ? false : { scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 8 }}
            transition={{
              delay: pace(0.42),
              type: "spring",
              stiffness: 160,
              duration: reduceMotion ? MOTION_DURATION.instant : undefined,
            }}
          >
            <FeltStar
              className="h-7 w-7 drop-shadow-md sm:h-9 sm:w-9"
              fill="#5B9BC8"
            />
          </motion.div>
          <SoftStarOutline className="pointer-events-none absolute -right-1 bottom-[22%] z-[8] h-5 w-5 opacity-75" />

          {/* Paperclips — fully on the paper stack */}
          <PaperClip className="pointer-events-none absolute -top-1 right-[22%] z-30 h-8 w-3.5 rotate-[18deg] drop-shadow-sm sm:top-0 sm:h-10 sm:w-5" />
          <PaperClip className="pointer-events-none absolute bottom-[16%] -left-1 z-30 h-7 w-3 -rotate-[28deg] drop-shadow-sm sm:h-9 sm:w-4" />

          {/* Mini flower accent */}
          <MiniFlower className="pointer-events-none absolute -top-3 left-[34%] z-[8] h-6 w-6 opacity-90 sm:-top-4 sm:h-8 sm:w-8" />

          {/* Main letter */}
          <motion.article
            className="relative z-10 px-8 pt-10 pb-9 sm:px-12 sm:pt-12 sm:pb-11"
            style={{
              background: PAPER,
              boxShadow:
                "0 30px 60px -18px rgba(30,58,95,0.38), 0 0 0 1px rgba(184,212,234,0.5)",
              clipPath:
                "polygon(1.5% 1%, 38% 0%, 70% 2%, 98.5% 0.5%, 100% 30%, 99% 68%, 100% 97%, 70% 100%, 28% 98.5%, 0% 100%, 1% 68%, 0% 28%)",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduceMotion
                ? MOTION_DURATION.instant
                : MOTION_DURATION.base,
              ease: MOTION_EASE.out,
            }}
          >
            {/* Soft crumple wash */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 55% 40% at 22% 18%, rgba(184,212,234,0.35) 0%, transparent 55%),
                  radial-gradient(ellipse 45% 35% at 82% 22%, rgba(214,234,248,0.3) 0%, transparent 50%),
                  radial-gradient(ellipse 50% 40% at 70% 85%, rgba(168,208,234,0.28) 0%, transparent 55%)
                `,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(30,58,95,0.045) 0.6px, transparent 0.6px)",
                backgroundSize: "4px 4px",
              }}
            />

            <div className="relative text-center">
              <Reveal delay={pace(0.22)} reduceMotion={reduceMotion}>
                <p
                  className="font-serif text-[1.4rem] italic sm:text-[1.55rem]"
                  style={{ color: HAND }}
                >
                  Dear {toName},
                </p>
              </Reveal>

              <div className="mt-6 text-left sm:mt-7">
                <LetterTypewriterBody
                  chunks={bodyChunks}
                  startDelayMs={reduceMotion ? 0 : 480}
                  reduceMotion={reduceMotion}
                  onDone={finishBody}
                  ink={INK}
                  caretColor={HAND}
                />
              </div>

              <motion.div
                className="mt-8 sm:mt-9"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  delay: signOff && !reduceMotion ? 0.35 : 0,
                  ease: MOTION_EASE.out,
                }}
              >
                <p
                  className="font-serif text-base italic sm:text-lg"
                  style={{ color: HAND }}
                >
                  {closing}
                </p>
              </motion.div>

              <motion.div
                className="mt-1"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  delay: signOff && !reduceMotion ? 0.7 : 0,
                  ease: MOTION_EASE.out,
                }}
              >
                <p
                  className="font-serif text-lg sm:text-xl"
                  style={{ color: HAND }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {fromName}
                    <motion.span
                      style={{ color: "#6BA3C9" }}
                      animate={
                        ambient && signOff ? { scale: [1, 1.18, 1] } : undefined
                      }
                      transition={
                        ambient && signOff
                          ? {
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                          : undefined
                      }
                    >
                      <HeartMark className="h-3.5 w-3.5" />
                    </motion.span>
                  </span>
                </p>
              </motion.div>

              <motion.div
                className="relative mt-9 sm:mt-10"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  delay: signOff && !reduceMotion ? 1.15 : 0,
                  ease: MOTION_EASE.out,
                }}
              >
                <SoftStar
                  className="pointer-events-none absolute -top-3.5 right-[18%] h-5 w-5 opacity-90"
                  fill="#8EBFDE"
                />
                <motion.button
                  type="button"
                  aria-label="Unlock Memories"
                  onClick={onComplete}
                  disabled={!signOff}
                  className="w-full rounded-full px-6 py-3.5 text-sm font-bold tracking-[0.1em] text-white uppercase focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none disabled:pointer-events-none sm:text-[15px]"
                  style={{
                    background: `linear-gradient(180deg, ${CTA_FROM} 0%, ${CTA_TO} 100%)`,
                    boxShadow:
                      "0 14px 32px -10px rgba(30,58,95,0.5), 0 0 0 2px rgba(255,255,255,0.45)",
                  }}
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Unlock Memories
                </motion.button>
              </motion.div>
            </div>
          </motion.article>

          {/* Soft swirl doodle — keep inset */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-[42%] -right-1 z-[8] text-lg opacity-50 sm:right-0"
            style={{ color: "#5B9BC8" }}
          >
            ～
          </span>
        </div>
      </div>
    </div>
  );
}
