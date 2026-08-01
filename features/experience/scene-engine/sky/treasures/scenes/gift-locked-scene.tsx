"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

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

function TreasureGiftMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="stGiftBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8D0E8" />
          <stop offset="55%" stopColor={SKY} />
          <stop offset="100%" stopColor={SKY_DEEP} />
        </linearGradient>
        <linearGradient id="stGiftLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6EAF6" />
          <stop offset="100%" stopColor={SKY} />
        </linearGradient>
      </defs>
      <rect
        x="14"
        y="28"
        width="44"
        height="34"
        rx="4"
        fill="url(#stGiftBody)"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.5"
      />
      <rect
        x="12"
        y="20"
        width="48"
        height="14"
        rx="3.5"
        fill="url(#stGiftLid)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.5"
      />
      <rect x="33" y="20" width="6" height="42" fill="#FFFEFB" opacity="0.92" />
      <rect x="12" y="28" width="48" height="6" fill="#FFFEFB" opacity="0.88" />
      <path
        d="M36 20 C28 8 20 12 22 20 C30 12 36 20 36 20Z"
        fill="#FFFEFB"
        stroke={SKY_DEEP}
        strokeWidth="1.1"
      />
      <path
        d="M36 20 C44 8 52 12 50 20 C42 12 36 20 36 20Z"
        fill="#F4FAFE"
        stroke={SKY_DEEP}
        strokeWidth="1.1"
      />
    </svg>
  );
}

function SmilingCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden fill="none">
      <path
        d="M22 48 C16 34 28 22 44 24 C50 12 72 10 84 24 C98 18 112 30 108 46 C116 54 108 66 90 64 C78 74 52 74 40 64 C28 70 16 60 22 48Z"
        fill="#FFFEFB"
        stroke="rgba(90,155,196,0.4)"
        strokeWidth="1.4"
      />
      <circle cx="48" cy="42" r="2.2" fill={INK} />
      <circle cx="68" cy="42" r="2.2" fill={INK} />
      <path
        d="M52 50 Q58 55 64 50"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="44" cy="48" rx="4" ry="2.2" fill="#FFB6C8" opacity="0.45" />
      <ellipse cx="72" cy="48" rx="4" ry="2.2" fill="#FFB6C8" opacity="0.45" />
    </svg>
  );
}

function SoftBalloon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 110" className={className} aria-hidden fill="none">
      <ellipse
        cx="40"
        cy="38"
        rx="26"
        ry="34"
        fill={SKY}
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.8"
      />
      <path
        d="M20 28 Q40 20 60 28 M18 40 Q40 32 62 40 M22 52 Q40 44 58 52"
        stroke="white"
        strokeWidth="3.2"
        opacity="0.35"
        fill="none"
      />
      <path
        d="M34 70 L30 86 M46 70 L50 86 M40 72 L40 86"
        stroke={INK_SOFT}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <rect
        x="28"
        y="86"
        width="24"
        height="10"
        rx="2"
        fill="#D4A574"
        stroke="#B8894E"
        strokeWidth="0.9"
      />
    </svg>
  );
}

function DenimStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden>
      <path
        d="M36 4 42.5 24.5 64 26 47.5 40 52.5 62 36 50.5 19.5 62 24.5 40 8 26 29.5 24.5Z"
        fill={DENIM}
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.5"
      />
      <path
        d="M36 4 42.5 24.5 64 26 47.5 40 52.5 62 36 50.5 19.5 62 24.5 40 8 26 29.5 24.5Z"
        fill={DENIM_DEEP}
        opacity="0.3"
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

function SoftHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 24" className={className} aria-hidden>
      <path
        d="M14 21.5 C5.5 15.2 2 11 3.5 7.2 C4.5 4.8 7.5 4.2 14 8 C20.5 4.2 23.5 4.8 24.5 7.2 C26 11 22.5 15.2 14 21.5Z"
        fill={SKY}
        stroke={SKY_DEEP}
        strokeWidth="1"
      />
    </svg>
  );
}

function FlowerScrap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 90" className={className} aria-hidden fill="none">
      <path
        d="M24 82 C22 60 18 42 16 18"
        stroke="#7A9A6A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {[
        [16, 22],
        [28, 28],
        [14, 38],
        [30, 44],
        [18, 54],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="#E8F4FC" />
          <circle cx={cx} cy={cy} r="2.2" fill={SKY} opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

function OrnamentRule({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-2.5 ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="h-px w-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${SKY_DEEP})`,
        }}
      />
      <SoftStar className="h-3.5 w-3.5" fill={SKY_DEEP} />
      <span
        className="h-px w-12"
        style={{
          background: `linear-gradient(90deg, ${SKY_DEEP}, transparent)`,
        }}
      />
    </div>
  );
}

const cardContent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE },
  },
};

/**
 * sky.treasures.gift-locked — Scene 3.
 * Soft-blue scrapbook invitation · TREASURE MODE · YES, I'M READY!
 * Yes → gift-explosion (Scenes 4–5 beat).
 * Founder ref: design-references/sky/treasures/scene-03-gift-locked-reference.png
 * Mobile-light: one-shot entrance · no infinite loops / feTurbulence.
 */
export function SkyTreasuresGiftLockedScene({
  onComplete,
}: SkyTreasuresSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{ backgroundColor: "#9EC9E6" }}
      data-scene="sky.treasures.gift-locked"
    >
      {/* Soft sky paper field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 95% 75% at 50% 36%, #FFFEFB 0%, #E8F4FC 40%, #C5DCEF 70%, #9EC9E6 100%)",
            "radial-gradient(ellipse 55% 40% at 12% 10%, rgba(255,248,220,0.55) 0%, transparent 65%)",
            "radial-gradient(ellipse 50% 35% at 90% 88%, rgba(63,111,154,0.28) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.4) 3px 4px)",
        }}
      />

      {/* Soft lined / paper washes — fade out so they never collide with the plate */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[12%] -left-6 z-[1] h-[40%] w-[42%] rotate-[-8deg] opacity-[0.28]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 12px, rgba(90,155,196,0.4) 12px 13px)",
          backgroundColor: "rgba(255,254,251,0.55)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at 25% 45%, #000 0%, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse 75% 70% at 25% 45%, #000 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[20%] -right-4 z-[1] h-[32%] w-[36%] rotate-[7deg] opacity-[0.22]"
        style={{
          background: "linear-gradient(165deg, #FFFEFB 0%, #E8F2FA 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 65% at 75% 40%, #000 0%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 70% 65% at 75% 40%, #000 0%, transparent 70%)",
        }}
      />

      {/* Corner motifs — kept in viewport margins, clear of the plate */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-5 left-3 z-[2] sm:top-8 sm:left-6"
        initial={reduceMotion ? false : { opacity: 0, y: -10, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <SmilingCloud className="h-12 w-[4.5rem] drop-shadow-sm sm:h-14 sm:w-20" />
        <SoftStar className="absolute -top-1 right-0 h-3 w-3" fill={SKY_DEEP} />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-3 z-[2] sm:bottom-12 sm:left-8"
        initial={reduceMotion ? false : { opacity: 0, y: 12, rotate: -10 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ delay: 0.12, duration: 0.4, ease: EASE }}
      >
        <SoftBalloon className="h-14 w-10 drop-shadow-sm sm:h-16 sm:w-12" />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[48%] right-3 z-[2] sm:right-8"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.18,
          type: "spring",
          stiffness: 240,
          damping: 16,
        }}
      >
        <SoftHeart className="h-6 w-7 drop-shadow-sm" />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-6 right-3 z-[2] sm:top-8 sm:right-7"
        initial={reduceMotion ? false : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.35, ease: EASE }}
      >
        <div
          className="rounded-sm px-1 py-1.5"
          style={{
            background: `linear-gradient(165deg, ${CREAM} 0%, #EEF5FA 100%)`,
            boxShadow: "0 8px 18px -12px rgba(30,58,95,0.35)",
            transform: "rotate(6deg)",
          }}
        >
          <FlowerScrap className="h-12 w-7 sm:h-14 sm:w-8" />
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-8 z-[2] sm:right-10 sm:bottom-12"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: 12 }}
        animate={{ opacity: 1, scale: 1, rotate: 4 }}
        transition={{
          delay: 0.24,
          type: "spring",
          stiffness: 220,
          damping: 14,
        }}
      >
        <DenimStar className="h-12 w-12 sm:h-14 sm:w-14" />
        <SoftStar
          className="absolute -top-1.5 -left-2 h-3.5 w-3.5 opacity-80"
          fill="#C8D8E8"
        />
      </motion.div>

      <SoftStar
        className="pointer-events-none absolute top-[16%] left-[22%] z-[2] h-2.5 w-2.5 opacity-60"
        fill={GOLD}
      />
      <SoftStar
        className="pointer-events-none absolute bottom-[18%] right-[24%] z-[2] h-2 w-2 opacity-55"
        fill={SKY_DEEP}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 py-14 sm:px-8 sm:py-16">
        <div className="relative w-full max-w-[21.5rem] sm:max-w-[24rem]">
          {/* Entrance bloom — one-shot */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-72 sm:w-72"
            style={{
              background:
                "radial-gradient(circle, rgba(255,248,220,0.4) 0%, rgba(126,182,217,0.22) 42%, transparent 70%)",
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0.3], scale: [0.4, 1.1, 1.25] }}
            transition={{ duration: 0.95, ease: EASE }}
          />

          {/* Gift crest — clear of washi */}
          <motion.div
            className="relative z-20 mb-2 flex justify-center"
            initial={reduceMotion ? false : { opacity: 0, y: -22, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.16,
              type: "spring",
              stiffness: 260,
              damping: 16,
            }}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-[0.65rem] sm:h-16 sm:w-16"
              style={{
                background: `linear-gradient(145deg, #A8D0E8 0%, ${SKY} 55%, ${SKY_DEEP} 100%)`,
                boxShadow:
                  "0 14px 28px -12px rgba(30,58,95,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.55)",
              }}
            >
              <TreasureGiftMark className="h-10 w-10 sm:h-11 sm:w-11" />
            </div>
          </motion.div>

          {/* Washi sits between crest and plate — solid label for readable type */}
          <motion.div
            className="relative z-20 mb-3 flex justify-center"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.35, ease: EASE }}
          >
            <div
              className="relative overflow-hidden rounded-[2px] px-3.5 py-1.5 shadow-sm"
              style={{
                background: CREAM,
                transform: "rotate(-2deg)",
                boxShadow:
                  "0 4px 10px -6px rgba(30,58,95,0.35), inset 0 0 0 1px rgba(90,155,196,0.35)",
              }}
            >
              {/* Stripe trim only on edges — not behind letters */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-2"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #FFFFFF 0 3px, #A8D0E8 3px 6px)",
                }}
              />
              <span
                aria-hidden
                className="absolute inset-y-0 right-0 w-2"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #FFFFFF 0 3px, #A8D0E8 3px 6px)",
                }}
              />
              <p
                className="relative px-1.5 font-sans text-[10px] font-bold tracking-[0.22em] uppercase sm:text-[11px]"
                style={{ color: INK }}
              >
                Treasure Mode
              </p>
            </div>
          </motion.div>

          <motion.article
            className="relative z-10 overflow-visible rounded-[1.35rem] px-6 pt-8 pb-7 sm:rounded-[1.5rem] sm:px-8 sm:pt-9 sm:pb-8"
            style={{
              background: `linear-gradient(168deg, ${CREAM} 0%, #F7FBFE 48%, #EEF5FA 100%)`,
              boxShadow: [
                "0 28px 56px -20px rgba(30,58,95,0.42)",
                "0 0 0 1px rgba(126,182,217,0.35)",
                "inset 0 1px 0 rgba(255,255,255,0.95)",
              ].join(", "),
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.12,
              type: "spring",
              stiffness: 210,
              damping: 18,
            }}
          >
            {/* Soft stitch border */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-[1.05rem] border border-dashed opacity-40"
              style={{ borderColor: SKY }}
            />

            <motion.div
              className="relative z-[1] flex flex-col items-center text-center"
              variants={cardContent}
              initial="hidden"
              animate="show"
            >
              <motion.h1
                variants={fadeUp}
                className="max-w-[17rem] font-serif text-[1.35rem] leading-[1.35] font-semibold tracking-tight sm:max-w-[19rem] sm:text-[1.55rem]"
                style={{ color: INK }}
              >
                Open all the treasures
                <br />
                and collect every reward.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-4 font-serif text-[1.45rem] leading-none italic sm:mt-5 sm:text-[1.65rem]"
                style={{ color: INK_SOFT }}
              >
                Are you ready?
              </motion.p>

              <motion.div variants={fadeUp} className="mt-3.5">
                <OrnamentRule />
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 w-full sm:mt-7">
                <motion.button
                  type="button"
                  onClick={onComplete}
                  aria-label="Yes, I'm ready"
                  className="relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3.5 font-sans text-[13px] font-bold tracking-[0.12em] text-white uppercase focus-visible:ring-2 focus-visible:ring-[#A8D0E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFEFB] focus-visible:outline-none sm:py-4 sm:text-sm"
                  style={{
                    background: `linear-gradient(165deg, #6A98C0 0%, ${DENIM} 50%, ${DENIM_DEEP} 100%)`,
                    boxShadow: [
                      "0 14px 28px -12px rgba(30,58,95,0.5)",
                      "inset 0 1px 0 rgba(255,255,255,0.3)",
                      "inset 0 0 0 1.5px rgba(255,255,255,0.22)",
                    ].join(", "),
                  }}
                  initial={reduceMotion ? false : { scale: 0.94 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.85, duration: 0.4, ease: EASE }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  {/* Soft dashed stitch ring */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-[5px] rounded-full border border-dashed opacity-50"
                    style={{ borderColor: "rgba(255,255,255,0.7)" }}
                  />
                  <span className="relative z-[1]">Yes, I&apos;m Ready!</span>
                  <SoftStar
                    className="relative z-[1] h-3.5 w-3.5 opacity-95"
                    fill="#FFFEFB"
                  />
                </motion.button>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-[16rem] font-serif text-[11px] leading-relaxed italic sm:text-xs"
                style={{ color: INK_SOFT }}
              >
                Once you open it, there&apos;s no turning back.
              </motion.p>
            </motion.div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
