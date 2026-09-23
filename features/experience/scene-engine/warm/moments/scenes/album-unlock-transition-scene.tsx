"use client";

import { useEffect, useRef, useState } from "react";

import { Cormorant_Garamond } from "next/font/google";

import { motion, useReducedMotion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";

const editorial = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * Warm Moments Scene 7 — album unlock transition (~3.4s).
 * Bloom 3-keyframe unlock motion; Warm crimson velvet + gold tooling.
 */
export const WARM_ALBUM_UNLOCK_MS = 3400;

const PHASE_MS = {
  toHalf: 950,
  toFull: 1900,
} as const;

const SNAP = [0.22, 1, 0.36, 1] as const;

type Phase = 0 | 1 | 2;

const FALLING_PETALS = [
  { left: "8%", delay: 0.1, duration: 7.2, size: 13, x: 10 },
  { left: "26%", delay: 0.55, duration: 6.6, size: 11, x: -9 },
  { left: "52%", delay: 0.25, duration: 7.4, size: 15, x: 7 },
  { left: "74%", delay: 0.7, duration: 6.9, size: 12, x: -11 },
  { left: "88%", delay: 0.4, duration: 7.6, size: 10, x: 5 },
  { left: "40%", delay: 1.1, duration: 8, size: 9, x: -6 },
] as const;

function CoverTitle({ compact }: { compact?: boolean }) {
  return (
    <div className="text-center">
      <p
        className={`${editorial.className} font-medium tracking-[0.38em] uppercase ${
          compact ? "text-[0.58rem]" : "text-[0.68rem] sm:text-[0.74rem]"
        }`}
        style={{
          color: "#D4AF37",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        Our Memory
      </p>
      <p
        className={`${editorial.className} mt-1 font-semibold tracking-[0.2em] uppercase ${
          compact ? "text-[1.25rem]" : "text-[1.55rem] sm:text-[1.7rem]"
        }`}
        style={{
          color: "#E8C96A",
          textShadow:
            "0 1px 0 rgba(255,248,210,0.35), 0 2px 4px rgba(0,0,0,0.45)",
        }}
      >
        Album
      </p>
    </div>
  );
}

/** Embossed rose seal — gold ring + clear bloom. */
function RoseMedallion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      {/* Outer gold ring */}
      <circle cx="40" cy="40" r="37" fill="#8A6A12" />
      <circle cx="40" cy="40" r="34" fill="#E8C96A" />
      <circle cx="40" cy="40" r="31" fill="#C9A227" />
      <circle
        cx="40"
        cy="40"
        r="29"
        fill="none"
        stroke="#FFF8E0"
        strokeWidth="1.1"
        opacity="0.5"
      />
      {/* Inner field */}
      <circle cx="40" cy="40" r="26" fill="#3A080C" />
      {/* Rose petals — outer ring */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={`o-${deg}`}
          cx="40"
          cy="26"
          rx="8"
          ry="13"
          fill="#B82832"
          transform={`rotate(${deg} 40 40)`}
        />
      ))}
      {/* Mid petals */}
      {[30, 90, 150, 210, 270, 330].map((deg) => (
        <ellipse
          key={`m-${deg}`}
          cx="40"
          cy="30"
          rx="6"
          ry="10"
          fill="#8B1A22"
          transform={`rotate(${deg} 40 40)`}
        />
      ))}
      <circle cx="40" cy="40" r="9" fill="#6B1018" />
      <circle cx="40" cy="40" r="4" fill="#2A060A" />
      <circle cx="37" cy="37" r="1.8" fill="#E88888" opacity="0.5" />
      {/* Tiny leaf */}
      <path
        d="M40 52c-3 3-5 6-4 8h8c1-2-1-5-4-8Z"
        fill="#2A4A24"
        opacity="0.85"
      />
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#A81E2C"
        opacity="0.88"
      />
    </svg>
  );
}

/** Ornate gold lock plate with keyhole. */
function LockPlate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 68" className={className} aria-hidden>
      <rect x="6" y="4" width="44" height="60" rx="6" fill="#D4AF37" />
      <rect x="8" y="6" width="40" height="56" rx="5" fill="#E8C96A" />
      <rect
        x="10"
        y="8"
        width="36"
        height="52"
        rx="4"
        fill="none"
        stroke="#6A5010"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <circle cx="28" cy="26" r="9" fill="#3A080C" />
      <circle
        cx="28"
        cy="26"
        r="9"
        fill="none"
        stroke="#FFF6D0"
        strokeWidth="1.4"
        opacity="0.5"
      />
      <path d="M23 32 V50 Q28 56 33 50 V32 Z" fill="#3A080C" />
      <path
        d="M24.5 33 V49 Q28 53.5 31.5 49 V33 Z"
        fill="#6A5010"
        opacity="0.55"
      />
      <circle cx="28" cy="26" r="3.2" fill="#1A0406" />
      <path d="M10 12 H46" stroke="#FFF6D0" strokeWidth="0.8" opacity="0.35" />
    </svg>
  );
}

/** Solid metal corner protector. */
function GoldCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        d="M3 3 H32 Q40 3 40 11 V30"
        stroke="#D4AF37"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M3 3 H32 Q40 3 40 11 V30"
        stroke="#FFF8E0"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
      />
      <circle cx="3" cy="3" r="3.8" fill="#E8C96A" />
      <circle cx="3" cy="3" r="1.6" fill="#FFF6D0" opacity="0.8" />
    </svg>
  );
}

function ToolingFrame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <rect
        x="10"
        y="10"
        width="180"
        height="260"
        rx="8"
        fill="none"
        stroke="#C9A227"
        strokeWidth="1.6"
        opacity="0.7"
      />
      <rect
        x="16"
        y="16"
        width="168"
        height="248"
        rx="5"
        fill="none"
        stroke="#E8C96A"
        strokeWidth="0.7"
        opacity="0.35"
      />
      {/* Corner flourishes */}
      <path
        d="M22 40 C24 28 32 22 44 20"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M178 40 C176 28 168 22 156 20"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M22 240 C24 252 32 258 44 260"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M178 240 C176 252 168 258 156 260"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}

/** Crimson velvet leather cover — embossed plaque + gold tooling. */
function CoverFace({ compact }: { compact?: boolean }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[0.85rem]"
      style={{
        background: [
          "linear-gradient(155deg, #9A222C 0%, #6B1018 24%, #4A0A10 52%, #2E070C 78%, #1A0406 100%)",
        ].join(", "),
        boxShadow: [
          "inset 0 2px 0 rgba(255,220,180,0.22)",
          "inset 0 -10px 22px rgba(0,0,0,0.45)",
          "inset 6px 0 16px rgba(0,0,0,0.28)",
          "inset -3px 0 10px rgba(255,180,140,0.06)",
        ].join(", "),
      }}
    >
      {/* Leather grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.38] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Soft gloss */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 85% 55% at 30% 18%, rgba(255,210,170,0.28) 0%, transparent 55%)",
            "linear-gradient(125deg, rgba(255,230,200,0.14) 0%, transparent 42%)",
            "radial-gradient(ellipse 60% 40% at 78% 82%, rgba(0,0,0,0.35) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      {/* Debossed panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[0.85rem] rounded-lg"
        style={{
          boxShadow: [
            "inset 0 0 0 1px rgba(201,162,39,0.55)",
            "inset 0 0 0 3px rgba(0,0,0,0.25)",
            "inset 0 0 24px rgba(0,0,0,0.2)",
          ].join(", "),
        }}
      />
      <ToolingFrame className="pointer-events-none absolute inset-[0.55rem] h-auto w-[calc(100%-1.1rem)] opacity-90" />

      <GoldCorner className="absolute top-1.5 left-1.5 z-[2] h-9 w-9 drop-shadow-md" />
      <GoldCorner className="absolute top-1.5 right-1.5 z-[2] h-9 w-9 rotate-90 drop-shadow-md" />
      <GoldCorner className="absolute bottom-1.5 left-1.5 z-[2] h-9 w-9 -rotate-90 drop-shadow-md" />
      <GoldCorner className="absolute right-1.5 bottom-1.5 z-[2] h-9 w-9 rotate-180 drop-shadow-md" />

      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
        <RoseMedallion
          className={`drop-shadow-lg ${compact ? "mb-2.5 h-14 w-14" : "mb-4 h-[4.5rem] w-[4.5rem] sm:h-[5rem] sm:w-[5rem]"}`}
        />
        <CoverTitle compact={compact} />
        <LockPlate
          className={`mt-3 drop-shadow-md ${compact ? "h-9 w-7" : "mt-4 h-12 w-10 sm:h-[3.25rem] sm:w-11"}`}
        />
      </div>
    </div>
  );
}

function ScrapPage({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className={`${editorial.className} relative h-full w-full overflow-hidden rounded-sm`}
      style={{
        background:
          "linear-gradient(180deg, #FFFDF8 0%, #F6EDE0 55%, #EDE0CC 100%)",
        boxShadow: "inset 0 0 0 1px rgba(170,130,90,0.28)",
      }}
    >
      {/* Paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {isLeft ? (
        <>
          {/* Soft photo plate */}
          <div className="absolute top-3 left-3 right-8 rotate-[-3.5deg]">
            <div
              className="rounded-[2px] bg-[#FFFBF5] p-1 shadow-md"
              style={{ boxShadow: "0 4px 12px rgba(60,30,20,0.18)" }}
            >
              <div
                className="relative h-16 overflow-hidden rounded-[1px] sm:h-[4.5rem]"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 40% 35%, #8B3A42 0%, #4A0A10 55%, #2A060A 100%)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 70% 20%, rgba(255,200,160,0.35), transparent 50%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[9px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(232,201,106,0.55)" }}
                  >
                    Memory
                  </span>
                </div>
              </div>
            </div>
            {/* Gold tape */}
            <div
              aria-hidden
              className="absolute -top-1 left-6 h-3 w-10 rotate-[-8deg]"
              style={{
                background: "linear-gradient(180deg, #F0D878 0%, #C9A227 100%)",
                opacity: 0.85,
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            />
          </div>
          <p
            className="absolute right-3 bottom-10 left-3 text-[10px] leading-snug italic"
            style={{ color: "#6A4A4E" }}
          >
            Every quiet moment with you feels like home.
          </p>
          {/* Tiny wax seal */}
          <div
            aria-hidden
            className="absolute right-3 bottom-3 h-5 w-5 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #F0D878, #C9A227 50%, #6A5010)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
            }}
          />
        </>
      ) : (
        <>
          <p
            className="absolute top-3 right-3 left-4 text-right text-[10px] leading-snug italic"
            style={{ color: "#6A4A4E" }}
          >
            A chapter written in warmth and gold light.
          </p>
          <div className="absolute top-12 right-3 left-4 rotate-[2.5deg]">
            <div
              className="rounded-[2px] bg-[#FFFBF5] p-1"
              style={{ boxShadow: "0 4px 12px rgba(60,30,20,0.18)" }}
            >
              <div
                className="relative h-14 overflow-hidden rounded-[1px] sm:h-16"
                style={{
                  background:
                    "linear-gradient(160deg, #5C1018 0%, #8B1A22 40%, #C9A227 100%)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 40%, rgba(255,240,200,0.2), transparent 55%)",
                  }}
                />
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -top-1 right-8 h-3 w-9 rotate-[12deg]"
              style={{
                background: "linear-gradient(180deg, #F0D878 0%, #C9A227 100%)",
                opacity: 0.85,
              }}
            />
          </div>
          <div
            aria-hidden
            className="absolute bottom-4 left-4 h-4 w-4 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #E07070, #7A121C 60%, #3A080C)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        </>
      )}
    </div>
  );
}

function MemoryAlbum({ phase }: { phase: Phase }) {
  const half = phase >= 1;
  const full = phase >= 2;

  return (
    <motion.div
      className="relative"
      style={{ perspective: 1400 }}
      animate={{
        y: full ? 8 : [0, -6, 0],
        scale: full ? 1.05 : 1,
      }}
      transition={
        full
          ? { duration: 0.65, ease: SNAP }
          : {
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.5 },
            }
      }
    >
      <div
        aria-hidden
        className="absolute -bottom-9 left-1/2 h-8 w-[86%] -translate-x-1/2 rounded-full bg-black/50 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-4 left-1/2 h-3 w-[64%] -translate-x-1/2 rounded-full bg-[#4A0A10]/4 blur-md"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[12%] left-1/2 z-0 h-[72%] w-[72%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,220,140,0.7) 0%, rgba(201,162,39,0.25) 42%, transparent 70%)",
          filter: "blur(10px)",
        }}
        initial={false}
        animate={{
          opacity: full ? 0.25 : half ? 0.9 : 0,
          scale: half ? 1.08 : 0.88,
        }}
        transition={{ duration: 0.6, ease: SNAP }}
      />

      {/* Bookmark ribbon */}
      <motion.div
        aria-hidden
        className="absolute bottom-[-2.8rem] left-[14%] z-0 flex flex-col items-center"
        initial={false}
        animate={{ opacity: full ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <div
          className="h-16 w-[1.15rem]"
          style={{
            background:
              "linear-gradient(180deg, #E8C96A 0%, #A81E2C 42%, #5C1018 100%)",
            clipPath: "polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)",
            boxShadow: "0 8px 14px rgba(0,0,0,0.4)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-[1]"
        initial={false}
        animate={{
          width: full ? "20.5rem" : half ? "17.75rem" : "15.25rem",
          height: full ? "13.75rem" : half ? "21.25rem" : "22rem",
          rotate: full ? 0 : half ? -5 : -3,
        }}
        transition={{ duration: 0.75, ease: SNAP }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Spine */}
        <motion.div
          aria-hidden
          className="absolute top-1 bottom-1 left-[-0.8rem] z-[2] w-[0.8rem] rounded-l-[0.45rem]"
          initial={false}
          animate={{ opacity: full ? 0 : half ? 0.4 : 1 }}
          transition={{ duration: 0.45 }}
          style={{
            background:
              "linear-gradient(90deg, #1A0406 0%, #5C1018 38%, #8B1A22 100%)",
            boxShadow: "-5px 0 14px rgba(0,0,0,0.45)",
          }}
        />

        {/* Fully open spreads */}
        <motion.div
          className="absolute inset-0 z-[2] flex gap-1"
          initial={false}
          animate={{
            opacity: full ? 1 : 0,
            scale: full ? 1 : 0.92,
          }}
          transition={{ duration: 0.65, ease: SNAP }}
          style={{ pointerEvents: full ? "auto" : "none" }}
        >
          <div className="relative h-full w-1/2 origin-right">
            <ScrapPage side="left" />
            <GoldCorner className="absolute top-1 left-1 h-6 w-6" />
            <GoldCorner className="absolute bottom-1 left-1 h-6 w-6 -rotate-90" />
          </div>
          <div className="relative h-full w-1/2 origin-left">
            <ScrapPage side="right" />
            <GoldCorner className="absolute top-1 right-1 h-6 w-6 rotate-90" />
            <GoldCorner className="absolute right-1 bottom-1 h-6 w-6 rotate-180" />
          </div>
          <div
            aria-hidden
            className="absolute top-[8%] bottom-[8%] left-1/2 w-3 -translate-x-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,230,160,0.85), transparent)",
              filter: "blur(2px)",
            }}
          />
        </motion.div>

        {/* Closed / half */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: full ? 0 : 1 }}
          transition={{ duration: 0.45, ease: SNAP }}
          style={{ pointerEvents: full ? "none" : "auto" }}
        >
          <motion.div
            className="absolute inset-y-2 right-1 left-6 overflow-hidden rounded-[0.65rem]"
            initial={false}
            animate={{ opacity: half ? 1 : 0.2, x: half ? 0 : 6 }}
            transition={{ duration: 0.65, ease: SNAP }}
            style={{
              background: "linear-gradient(160deg, #FFFDF8 0%, #F0E4D4 100%)",
              boxShadow: "0 16px 32px -12px rgba(20,4,6,0.5)",
            }}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: half ? 1 : 0 }}
              transition={{ duration: 0.5, delay: half ? 0.15 : 0 }}
            >
              <div className="absolute top-4 right-3 left-3 rotate-[-2.5deg]">
                <div className="rounded-[2px] bg-white p-1 shadow-md">
                  <div
                    className="h-16 w-full rounded-[1px]"
                    style={{
                      background:
                        "linear-gradient(165deg, #3A080C 0%, #8B1A22 48%, #C9A227 100%)",
                    }}
                  />
                </div>
              </div>
              <p
                className={`${editorial.className} absolute top-[6.75rem] left-4 text-[9px] tracking-[0.14em] uppercase`}
                style={{ color: "#8B1A22" }}
              >
                Together forever
              </p>
            </motion.div>
          </motion.div>

          {/* Page block depth */}
          <motion.div
            aria-hidden
            className="absolute top-2 right-[-0.9rem] bottom-2 z-[2] w-[0.9rem] rounded-r-[2px]"
            initial={false}
            animate={{ opacity: half ? 0 : 1, x: half ? -6 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background:
                "repeating-linear-gradient(180deg, #FFFDF8 0px, #FFFDF8 2px, #E8DCC8 2px, #E8DCC8 3px)",
              boxShadow: "5px 0 12px rgba(20,4,6,0.3)",
            }}
          />

          <motion.div
            className="absolute inset-y-0 left-0 z-[3] origin-left"
            initial={false}
            animate={{
              width: half ? "56%" : "100%",
              rotateY: half ? -52 : 0,
            }}
            transition={{ duration: 0.8, ease: SNAP }}
            style={{
              transformStyle: "preserve-3d",
              boxShadow: half
                ? "12px 16px 36px -8px rgba(10,2,4,0.6)"
                : "0 36px 60px -14px rgba(10,2,4,0.7), 0 10px 20px -6px rgba(0,0,0,0.4)",
            }}
          >
            <CoverFace compact={half} />
          </motion.div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[8%] left-[34%] z-[4] h-[84%] w-12"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,230,160,0.65), rgba(255,245,210,0.95), transparent)",
              filter: "blur(2px)",
            }}
            initial={false}
            animate={{ opacity: half && !full ? 0.95 : 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Leather clasp */}
          <motion.div
            aria-hidden
            className="absolute top-1/2 z-[4] flex -translate-y-1/2 items-center"
            initial={false}
            animate={{
              right: half ? "-0.3rem" : "-1rem",
              rotate: half ? 26 : 0,
              x: half ? 10 : 0,
            }}
            transition={{ duration: 0.65, ease: SNAP }}
          >
            <div
              className="h-14 w-9 rounded-r-lg sm:h-15 sm:w-10"
              style={{
                background:
                  "linear-gradient(105deg, #2A060A 0%, #6B1018 30%, #8B1A22 55%, #4A0A10 100%)",
                boxShadow: [
                  "4px 5px 12px rgba(0,0,0,0.5)",
                  "inset 0 1px 0 rgba(255,220,180,0.18)",
                  "inset 0 0 0 1px rgba(201,162,39,0.25)",
                ].join(", "),
              }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              initial={false}
              animate={{
                right: half ? "-0.45rem" : "-0.2rem",
                opacity: half ? 0 : 1,
                scale: half ? 0.5 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="h-6 w-6 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 28%, #FFF6D0, #D4AF37 48%, #6A5010)",
                  boxShadow:
                    "0 3px 6px rgba(40,20,5,0.55), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function LightBurst({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scale: active ? 1.15 : 0.4,
          rotate: active ? 12 : 0,
        }}
        transition={{ duration: 0.85, ease: SNAP }}
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%,
              transparent 0deg,
              rgba(255,230,160,0.5) 8deg,
              transparent 16deg,
              rgba(232,180,90,0.35) 28deg,
              transparent 36deg,
              rgba(255,245,200,0.45) 50deg,
              transparent 58deg,
              rgba(200,140,50,0.4) 72deg,
              transparent 80deg,
              rgba(255,230,160,0.5) 98deg,
              transparent 108deg,
              rgba(232,180,90,0.35) 130deg,
              transparent 140deg,
              rgba(255,245,200,0.45) 165deg,
              transparent 175deg,
              rgba(200,140,50,0.4) 200deg,
              transparent 210deg,
              rgba(255,230,160,0.5) 240deg,
              transparent 250deg,
              rgba(232,180,90,0.35) 280deg,
              transparent 290deg,
              rgba(255,245,200,0.45) 320deg,
              transparent 330deg,
              rgba(200,140,50,0.4) 350deg,
              transparent 360deg
            )
          `,
          filter: "blur(2px)",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          width: active ? "140vmax" : "8rem",
          height: active ? "140vmax" : "8rem",
        }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            "radial-gradient(circle, #FFFDF5 0%, #FFF3C8 18%, #FFE8A0 38%, rgba(255,200,120,0.5) 58%, transparent 72%)",
        }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{
          duration: 0.65,
          delay: active ? 0.4 : 0,
          ease: "easeOut",
        }}
        style={{
          background:
            "radial-gradient(circle at 50% 48%, #FFFFFF 0%, #FFF8E8 40%, #FFE8C0 70%, #FFF4E0 100%)",
        }}
      />
    </div>
  );
}

function SceneAtmosphere() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 58% at 50% 38%, #7A1820 0%, #4A0A10 48%, #1E0408 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 40% at 50% 42%, rgba(255,220,180,0.09) 0%, transparent 70%)",
            "radial-gradient(ellipse 70% 45% at 14% 16%, rgba(140,30,40,0.32) 0%, transparent 55%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {FALLING_PETALS.map((petal, i) => (
          <motion.div
            key={i}
            className={i > 2 ? "absolute hidden sm:block" : "absolute"}
            style={{
              left: petal.left,
              top: "-6%",
              width: petal.size,
              height: petal.size * 1.3,
            }}
            animate={{
              opacity: [0, 0.7, 0.7, 0],
              y: ["0vh", "110vh"],
              x: [0, petal.x],
              rotate: [0, 40, -15],
            }}
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
    </>
  );
}

/**
 * warm.moments.album-unlock-transition — luxury crimson album unlock.
 */
export function WarmAlbumUnlockTransitionScene({
  onComplete,
}: MomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (reduceMotion) {
      const tPhase = window.setTimeout(() => setPhase(2), 0);
      const t = window.setTimeout(() => onCompleteRef.current(), 500);
      return () => {
        window.clearTimeout(tPhase);
        window.clearTimeout(t);
      };
    }
    const t1 = window.setTimeout(() => setPhase(1), PHASE_MS.toHalf);
    const t2 = window.setTimeout(() => setPhase(2), PHASE_MS.toFull);
    const t3 = window.setTimeout(
      () => onCompleteRef.current(),
      WARM_ALBUM_UNLOCK_MS,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [reduceMotion]);

  return (
    <div
      className={`${editorial.className} ${SCENE_VIEWPORT_LOCK} bg-[#2A060A]`}
    >
      <SceneAtmosphere />

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: SNAP }}
        >
          <MemoryAlbum phase={phase} />
        </motion.div>
      </div>

      <LightBurst active={phase >= 2} />
    </div>
  );
}
