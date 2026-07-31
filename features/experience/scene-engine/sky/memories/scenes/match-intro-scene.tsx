"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const DENIM = "#3F6F9A";
const DENIM_DEEP = "#2A5278";
const CREAM = "#FFFEFB";
const GOLD = "#F0D878";
const EASE = [0.22, 1, 0.36, 1] as const;

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

function OrnamentRule({ className }: { className?: string }) {
  return (
    <div
      className={`flex w-full max-w-[15rem] items-center gap-2.5 ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${SKY_DEEP})`,
        }}
      />
      <SoftStar className="h-3 w-3 shrink-0" fill={GOLD} />
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${SKY_DEEP}, transparent)`,
        }}
      />
    </div>
  );
}

function DenimStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden>
      <defs>
        <linearGradient id="skyMiDenimStar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6A98C0" />
          <stop offset="45%" stopColor={DENIM} />
          <stop offset="100%" stopColor={DENIM_DEEP} />
        </linearGradient>
        <pattern
          id="skyMiDenimStarWeave"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 2.5 H5 M2.5 0 V5"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.55"
          />
        </pattern>
      </defs>
      <path
        d="M36 4 42.5 24.5 64 26 47.5 40 52.5 62 36 50.5 19.5 62 24.5 40 8 26 29.5 24.5Z"
        fill="url(#skyMiDenimStar)"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
      />
      <path
        d="M36 4 42.5 24.5 64 26 47.5 40 52.5 62 36 50.5 19.5 62 24.5 40 8 26 29.5 24.5Z"
        fill="url(#skyMiDenimStarWeave)"
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

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 40" className={className} aria-hidden fill="none">
      <path
        d="M4 20 L52 6 L32 34 L24 24 Z"
        fill="#B8DCF0"
        stroke={INK_SOFT}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M24 24 L52 6 L30 26 Z"
        fill="#F0F7FC"
        stroke={INK_SOFT}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M24 24 L32 34"
        stroke={INK}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BabyBreathSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 48" className={className} aria-hidden fill="none">
      <path
        d="M10 40 C18 28 22 18 28 8"
        stroke="#7A9A6A"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M28 8 C34 16 40 24 46 34"
        stroke="#7A9A6A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[
        [16, 30],
        [22, 22],
        [28, 12],
        [34, 18],
        [40, 26],
        [24, 28],
        [32, 24],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3.2" fill="#FFFEFB" />
          <circle cx={cx} cy={cy} r="1.4" fill="#E8F2FA" />
        </g>
      ))}
    </svg>
  );
}

/** Empty polaroid — soft mist + mat, no character icons. */
function MemoryFrame({
  rotate,
  accent,
}: {
  rotate: number;
  accent: "mist" | "linen";
}) {
  const isMist = accent === "mist";

  return (
    <div
      className="relative w-[7.1rem] rounded-[0.85rem] p-1.5 pb-4 sm:w-[8.1rem] sm:p-2 sm:pb-5"
      style={{
        transform: `rotate(${rotate}deg)`,
        background: `linear-gradient(168deg, #FFFFFF 0%, ${CREAM} 55%, #F3F8FC 100%)`,
        border: "2px solid rgba(255,255,255,0.98)",
        boxShadow: [
          "0 18px 34px -14px rgba(30,58,95,0.4)",
          "0 2px 0 rgba(126,182,217,0.22)",
          "inset 0 0 0 1px rgba(90,155,196,0.22)",
        ].join(", "),
      }}
    >
      {/* Soft washi or corner pin — scrapbook hold, not cartoon */}
      {isMist ? (
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 z-20 h-2.5 w-11 -translate-x-1/2 rounded-[1px] shadow-sm"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #FFFFFF 0 5px, #7EB6D9 5px 10px)",
            transform: "translateX(-50%) rotate(-3deg)",
          }}
        />
      ) : (
        <span
          aria-hidden
          className="absolute -top-1 left-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #C9A24A 42%, #8F6A14 100%)",
            boxShadow: "0 1px 3px rgba(30,58,95,0.35)",
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-[6px] rounded-[0.55rem] border border-dashed opacity-45"
        style={{ borderColor: SKY_DEEP }}
      />

      {/* Soft empty photo slot */}
      <div
        className="relative aspect-square overflow-hidden rounded-[0.45rem]"
        style={{
          background: isMist
            ? "linear-gradient(155deg, #F4FAFE 0%, #E4F0F8 42%, #D5E8F4 100%)"
            : "linear-gradient(155deg, #FFFEFB 0%, #F2F7FB 48%, #E8F1F7 100%)",
          boxShadow: "inset 0 0 0 1px rgba(90,155,196,0.18)",
        }}
        aria-hidden
      >
        {/* Soft vignette + paper grain */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 70% at 50% 42%, rgba(255,255,255,0.75) 0%, transparent 68%)",
              "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(63,111,154,0.1) 0%, transparent 55%)",
              "repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.18) 3px 4px)",
            ].join(", "),
          }}
        />
        {/* Tiny sparkles — geometric only */}
        <SoftStar
          className={`absolute h-2.5 w-2.5 opacity-70 ${
            isMist ? "top-[18%] left-[22%]" : "top-[20%] right-[20%]"
          }`}
          fill={isMist ? GOLD : SKY_DEEP}
        />
        <SoftStar
          className={`absolute h-2 w-2 opacity-55 ${
            isMist ? "right-[18%] bottom-[22%]" : "bottom-[20%] left-[20%]"
          }`}
          fill={isMist ? SKY_DEEP : GOLD}
        />
      </div>
    </div>
  );
}

function HappyMomentsTag({ className }: { className?: string }) {
  return (
    <div
      className={`relative rounded-[3px] px-3.5 py-2.5 ${className ?? ""}`}
      style={{
        background: `linear-gradient(165deg, ${CREAM} 0%, #F0F6FB 100%)`,
        boxShadow:
          "0 10px 22px -12px rgba(30,58,95,0.4), inset 0 0 0 1px rgba(126,182,217,0.45)",
        transform: "rotate(-7deg)",
      }}
    >
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, #C9A24A 42%, #8F6A14 100%)`,
          boxShadow: "0 1px 3px rgba(30,58,95,0.35)",
        }}
      />
      <p
        className="font-serif text-[10.5px] leading-snug tracking-wide italic sm:text-[11.5px]"
        style={{ color: INK_SOFT }}
      >
        Collect the happy moments.
      </p>
    </div>
  );
}

/**
 * sky.memories.match-intro — Scene 5 (polished).
 * Soft-blue scrapbook gate · blended corners · Start outside clip plate.
 * Mobile-light: CSS/SVG only · one-shot entrance · no infinite loops / blur filters.
 */
export function SkyMemoriesMatchIntroScene({
  onComplete,
}: SkyMemoriesSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{ background: "#8EBFDE" }}
      data-scene="sky.memories.match-intro"
    >
      {/* Soft sky field + paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 95% 75% at 50% 36%, #FFFEFB 0%, #E8F4FC 38%, #C5DCEF 68%, #9EC9E6 100%)",
            "radial-gradient(ellipse 70% 50% at 8% 8%, rgba(126,182,217,0.35) 0%, transparent 55%)",
            "radial-gradient(ellipse 60% 45% at 92% 92%, rgba(63,111,154,0.28) 0%, transparent 50%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.35) 3px 4px), repeating-linear-gradient(90deg, transparent 0 5px, rgba(30,58,95,0.03) 5px 6px)",
        }}
      />

      {/* Soft denim wash — top right (fabric feel, no hard scrap edge) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-8 h-[42%] w-[52%] opacity-[0.55]"
        style={{
          background: [
            "radial-gradient(ellipse 80% 75% at 78% 18%, rgba(42,82,120,0.55) 0%, rgba(63,111,154,0.28) 38%, transparent 70%)",
            "repeating-linear-gradient(0deg, transparent 0 4px, rgba(255,255,255,0.07) 4px 5px)",
            "repeating-linear-gradient(90deg, transparent 0 4px, rgba(255,255,255,0.05) 4px 5px)",
          ].join(", "),
        }}
      />

      {/* Soft gingham wash — bottom left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -left-10 h-[46%] w-[55%] opacity-[0.38]"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.55) 0 10px, rgba(126,182,217,0.55) 10px 20px)",
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 10px, rgba(126,182,217,0.55) 10px 20px)",
            "radial-gradient(ellipse 70% 65% at 20% 85%, rgba(255,255,255,0.35) 0%, transparent 65%)",
          ].join(", "),
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at 18% 88%, #000 0%, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse 75% 70% at 18% 88%, #000 0%, transparent 72%)",
        }}
      />

      {/* Soft lined-paper wash — mid left */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[18%] -left-4 h-[28%] w-[38%] rotate-[-8deg] opacity-[0.28]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 11px, rgba(90,155,196,0.45) 11px 12px)",
          backgroundColor: "rgba(255,254,251,0.55)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 75% at 30% 50%, #000 0%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 80% 75% at 30% 50%, #000 0%, transparent 75%)",
        }}
      />

      {/* Soft corner washes — blend into field */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(circle, rgba(168,208,232,0.85) 0%, rgba(168,208,232,0.35) 42%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 h-52 w-52 rounded-full opacity-75"
        style={{
          background:
            "radial-gradient(circle, rgba(90,155,196,0.55) 0%, rgba(63,111,154,0.25) 45%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(232,242,250,0.9) 0%, rgba(197,220,239,0.4) 50%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -bottom-10 h-52 w-52 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(126,182,217,0.5) 0%, rgba(63,111,154,0.22) 48%, transparent 70%)",
        }}
      />

      {/* Soft washi strip — top left, fully on-canvas */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-6 left-4 z-[2] h-3.5 w-24 rotate-[-16deg] rounded-[1px] shadow-sm sm:top-8 sm:left-8 sm:w-28"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #FFFFFF 0 6px, #7EB6D9 6px 12px)",
        }}
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 0.95, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />

      {/* Soft washi + sprig — top right */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-5 right-4 z-[2] flex items-start gap-1 sm:top-7 sm:right-8"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
      >
        <div
          className="mt-3 h-3.5 w-[4.25rem] rotate-[14deg] rounded-[1px] shadow-sm"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.2px, transparent 1.4px), linear-gradient(90deg, #7EB6D9, #A8D0E8)",
            backgroundSize: "8px 8px, 100% 100%",
          }}
        />
        <BabyBreathSprig className="h-11 w-12 drop-shadow-sm" />
      </motion.div>

      {/* Paper plane */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[14%] right-[10%] z-[2] sm:top-[16%] sm:right-[13%]"
        initial={reduceMotion ? false : { opacity: 0, x: 14, rotate: 12 }}
        animate={{ opacity: 1, x: 0, rotate: 4 }}
        transition={{ delay: 0.22, duration: 0.35, ease: EASE }}
      >
        <svg
          className="absolute -bottom-1 -left-8 h-6 w-12 opacity-50"
          viewBox="0 0 64 24"
          aria-hidden
        >
          <path
            d="M2 18 Q20 4 40 12 Q52 16 62 8"
            fill="none"
            stroke={INK_SOFT}
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
        </svg>
        <PaperPlane className="h-8 w-11 sm:h-9 sm:w-12" />
      </motion.div>

      {/* Denim star — fully visible */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[6%] bottom-[8%] z-[2] h-14 w-14 sm:right-[9%] sm:bottom-[10%] sm:h-16 sm:w-16"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: 14 }}
        animate={{ opacity: 1, scale: 1, rotate: 4 }}
        transition={{
          delay: 0.28,
          type: "spring",
          stiffness: 220,
          damping: 14,
        }}
      >
        <DenimStar className="h-full w-full" />
      </motion.div>

      {/* Tag — bottom left */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[8%] left-[4%] z-[2] sm:bottom-[10%] sm:left-[8%]"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.3, ease: EASE }}
      >
        <HappyMomentsTag />
      </motion.div>

      <SoftStar
        className="pointer-events-none absolute top-[28%] left-[10%] z-[2] h-3.5 w-3.5 opacity-80"
        fill={GOLD}
      />
      <SoftStar
        className="pointer-events-none absolute top-[36%] right-[12%] z-[2] h-3 w-3 opacity-75"
        fill={SKY_DEEP}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-12 sm:px-6">
        <motion.article
          className="relative w-full max-w-[22.5rem] sm:max-w-[26rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.45,
            ease: EASE,
            type: reduceMotion ? undefined : "spring",
            stiffness: 210,
            damping: 18,
          }}
        >
          {/* Soft cream plate — rounded, no clipPath (keeps Start clickable) */}
          <div
            className="relative overflow-visible rounded-[1.5rem] px-5 pt-9 pb-7 sm:rounded-[1.65rem] sm:px-9 sm:pt-11 sm:pb-9"
            style={{
              background: `linear-gradient(168deg, #FFFEFB 0%, #F7FBFE 48%, #EEF5FA 100%)`,
              boxShadow: [
                "0 28px 56px -22px rgba(30,58,95,0.4)",
                "0 0 0 1px rgba(126,182,217,0.3)",
                "inset 0 1px 0 rgba(255,255,255,0.95)",
              ].join(", "),
            }}
          >
            {/* Soft torn-edge feel via dashed stitch only */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-[1.15rem] border border-dashed opacity-40"
              style={{ borderColor: SKY }}
            />

            {/* Checkered washi */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-3 left-1/2 z-20 h-3.5 w-[5.25rem] -translate-x-1/2 rounded-[1px] shadow-sm sm:w-24"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #FFFFFF 0 7px, #7EB6D9 7px 14px)",
                transform: "translateX(-50%) rotate(-2deg)",
              }}
            />

            <div className="relative z-[1] flex flex-col items-center text-center">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.08, duration: 0.3 }}
              >
                <OrnamentRule className="mb-3.5" />
              </motion.div>

              <motion.h1
                className="max-w-[18rem] font-serif text-[1.6rem] leading-[1.28] font-semibold tracking-tight sm:max-w-[20rem] sm:text-[1.9rem]"
                style={{
                  color: INK,
                  textShadow: "0 1px 0 rgba(255,255,255,0.7)",
                }}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.4 }}
              >
                Some memories are waiting to be found.
              </motion.h1>

              {/* Memory card pair — soft empty polaroids */}
              <motion.div
                className="relative mt-7 mb-1 flex items-end justify-center gap-2 sm:mt-8 sm:gap-3"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduceMotion ? 0 : 0.2,
                  type: "spring",
                  stiffness: 230,
                  damping: 16,
                }}
              >
                <motion.div
                  className="relative z-10"
                  initial={reduceMotion ? false : { rotate: -10, x: -12 }}
                  animate={{ rotate: 0, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.24,
                    type: "spring",
                    stiffness: 250,
                    damping: 15,
                  }}
                >
                  <MemoryFrame rotate={-5} accent="mist" />
                </motion.div>

                <motion.div
                  className="relative z-10"
                  initial={reduceMotion ? false : { rotate: 10, x: 12 }}
                  animate={{ rotate: 0, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.28,
                    type: "spring",
                    stiffness: 250,
                    damping: 15,
                  }}
                >
                  <MemoryFrame rotate={5} accent="linen" />
                </motion.div>
              </motion.div>

              <motion.p
                className="mt-5 max-w-[17rem] font-serif text-[1rem] leading-relaxed sm:mt-6 sm:max-w-xs sm:text-[1.08rem]"
                style={{ color: INK_SOFT }}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.38, duration: 0.3 }}
              >
                Match every memory to{" "}
                <span className="font-semibold" style={{ color: DENIM_DEEP }}>
                  unlock your surprise
                </span>
                .
              </motion.p>

              <motion.div
                className="mt-3"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.44, duration: 0.25 }}
              >
                <OrnamentRule />
              </motion.div>

              {/* Start — solid denim, no weave stripes (those looked like white boxes) */}
              <motion.button
                type="button"
                onClick={onComplete}
                aria-label="Start memory match"
                className="relative z-30 mt-5 flex w-full max-w-[16rem] cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-serif text-lg font-semibold text-white focus-visible:ring-2 focus-visible:ring-[#A8D0E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFEFB] focus-visible:outline-none sm:mt-6 sm:max-w-[17rem] sm:py-4 sm:text-xl"
                style={{
                  background: `linear-gradient(165deg, #6A98C0 0%, ${DENIM} 50%, ${DENIM_DEEP} 100%)`,
                  boxShadow:
                    "0 14px 28px -12px rgba(30,58,95,0.5), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 0 1.5px rgba(255,255,255,0.22)",
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.48, duration: 0.3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              >
                <span className="relative z-[1]">Start</span>
                <span className="relative z-[1]" aria-hidden>
                  →
                </span>
              </motion.button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
