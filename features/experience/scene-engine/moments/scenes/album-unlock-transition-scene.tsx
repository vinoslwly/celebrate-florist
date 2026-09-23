"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";

/**
 * Scene 7 — continuous 3-keyframe unlock, ~3s total.
 * 0 closed → 1 half-open → 2 fully open + screen-filling light burst.
 */
const PHASE_MS = {
  /** KF1 hold (closed) → start opening */
  toHalf: 850,
  /** KF2 hold → fully open + light burst */
  toFull: 1700,
} as const;

const SNAP = [0.22, 1, 0.36, 1] as const;

type Phase = 0 | 1 | 2;

const FALLING_PETALS = [
  { left: "10%", delay: 0.1, duration: 7, size: 14, x: 12 },
  { left: "28%", delay: 0.5, duration: 6.5, size: 12, x: -10 },
  { left: "55%", delay: 0.2, duration: 7.2, size: 16, x: 8 },
  { left: "78%", delay: 0.7, duration: 6.8, size: 13, x: -12 },
  { left: "90%", delay: 0.35, duration: 7.5, size: 11, x: 6 },
] as const;

function CoverTitle({ compact }: { compact?: boolean }) {
  /** Solid bronze-gold — readable on pink leather, still premium. */
  const foil = {
    color: "#6B4410",
    textShadow:
      "0 1px 0 #F5E6A8, 0 -0.5px 0 rgba(180,130,40,0.55), 0 2px 4px rgba(70,35,8,0.35)",
  };
  return (
    <div className="text-center">
      <p
        className={`font-serif leading-tight font-bold tracking-[0.2em] uppercase ${
          compact ? "text-[0.85rem]" : "text-[1.1rem] sm:text-[1.2rem]"
        }`}
        style={foil}
      >
        Ur Memory
      </p>
      <p
        className={`mt-1.5 font-serif leading-tight font-bold tracking-[0.26em] uppercase ${
          compact ? "text-[1.05rem]" : "text-[1.4rem] sm:text-[1.55rem]"
        }`}
        style={foil}
      >
        Album
      </p>
    </div>
  );
}

function SakuraMark({
  className,
  tone = "#F4A0B8",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="17"
          rx="10"
          ry="15"
          fill={tone}
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="6" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.6" fill="#E07090" />
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.92"
      />
    </svg>
  );
}

function Keyhole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 44" className={className} aria-hidden>
      <circle cx="18" cy="14" r="8" fill="#F0D878" />
      <circle
        cx="18"
        cy="14"
        r="8"
        fill="none"
        stroke="#B8860B"
        strokeWidth="2.5"
      />
      <circle
        cx="18"
        cy="14"
        r="8"
        fill="none"
        stroke="#FFF6D0"
        strokeWidth="1"
        opacity="0.5"
      />
      <path d="M14.5 19.5 V34 Q18 38.5 21.5 34 V19.5 Z" fill="#B8860B" />
      <path
        d="M15.5 20 V33 Q18 36.5 20.5 33 V20 Z"
        fill="#F0D878"
        opacity="0.55"
      />
      <circle cx="18" cy="14" r="3.4" fill="#4A2A06" />
    </svg>
  );
}

/** Chunky gold corner protector (metal plate, not a thin stroke). */
function GoldCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path
        d="M2 2 H31 Q37 2 37 8 V31"
        stroke="#D4AF37"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M2 2 H31 Q37 2 37 8 V31"
        stroke="#FFF0C0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
      />
      <circle cx="2" cy="2" r="3.2" fill="#D4AF37" />
      <circle cx="2" cy="2" r="1.4" fill="#FFF0C0" opacity="0.7" />
    </svg>
  );
}

function CornerFiligree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={className} aria-hidden fill="none">
      <path
        d="M10 78 C12 52 24 28 52 16 C38 30 28 48 26 78"
        stroke="#C9A227"
        strokeWidth="1.35"
        opacity="0.7"
      />
      <path
        d="M18 78 C20 56 32 36 56 26"
        stroke="#C9A227"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M52 16 C58 14 64 18 62 24 C60 20 56 18 52 16Z"
        fill="#C9A227"
        opacity="0.55"
      />
      <circle cx="52" cy="16" r="2" fill="#E8C878" opacity="0.75" />
    </svg>
  );
}

/** Premium leather cover — weighted, textured, Founder-reference look. */
function CoverFace({ compact }: { compact?: boolean }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[0.75rem]"
      style={{
        background:
          "linear-gradient(152deg, #F9D6E2 0%, #F0B8CC 26%, #E49AB4 55%, #D4809C 78%, #C46888 100%)",
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -8px 18px rgba(120,40,70,0.28), inset 4px 0 12px rgba(140,50,80,0.15)",
      }}
    >
      {/* Leather grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Soft directional light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 32% 22%, rgba(255,255,255,0.5) 0%, transparent 55%), linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 45%)",
        }}
      />
      {/* Debossed panel border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[0.7rem] rounded-md"
        style={{
          boxShadow:
            "inset 0 0 0 1.5px rgba(201,162,39,0.45), inset 0 0 0 3px rgba(255,255,255,0.12)",
        }}
      />

      <CornerFiligree className="absolute top-4 left-4 h-[4.25rem] w-[4.25rem] opacity-80" />
      <CornerFiligree className="absolute top-4 right-4 h-[4.25rem] w-[4.25rem] scale-x-[-1] opacity-80" />
      <CornerFiligree className="absolute bottom-4 left-4 h-[4.25rem] w-[4.25rem] scale-y-[-1] opacity-80" />
      <CornerFiligree className="absolute right-4 bottom-4 h-[4.25rem] w-[4.25rem] scale-[-1] opacity-80" />

      {/* Metal corners — right edge weight like Founder art */}
      <GoldCorner className="absolute top-1 right-1 z-[2] h-10 w-10 rotate-90 drop-shadow-md" />
      <GoldCorner className="absolute right-1 bottom-1 z-[2] h-10 w-10 rotate-180 drop-shadow-md" />

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <SakuraMark
          className={`drop-shadow-md ${compact ? "mb-2.5 h-7 w-7" : "mb-5 h-9 w-9 sm:h-10 sm:w-10"}`}
        />
        <CoverTitle compact={compact} />
        <Keyhole
          className={`drop-shadow-sm ${compact ? "mt-3.5 h-8 w-6" : "mt-6 h-10 w-8 sm:mt-7 sm:h-11 sm:w-9"}`}
        />
      </div>
    </div>
  );
}

function ScrapPage({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-sm"
      style={{
        background: "linear-gradient(180deg, #FFF9F4 0%, #F7EDE4 100%)",
        boxShadow: "inset 0 0 0 1px rgba(200,170,150,0.35)",
      }}
    >
      {isLeft ? (
        <>
          <div className="absolute top-3 left-3 rotate-[-4deg]">
            <div className="rounded-sm bg-white p-1 shadow-sm">
              <div
                className="h-14 w-11 rounded-[1px] sm:h-16 sm:w-12"
                style={{
                  background:
                    "linear-gradient(160deg, #C4A8B8 0%, #E8B0C0 50%, #F0D0C8 100%)",
                }}
              />
            </div>
          </div>
          <div
            className="absolute top-2 right-3 rotate-[3deg] rounded-sm px-1.5 py-1"
            style={{ background: "linear-gradient(180deg, #F8C8D8, #F0A8C0)" }}
          >
            <p className="font-serif text-[7px] font-semibold text-[#6B3040]">
              DATE 20.09.22
            </p>
            <p className="font-serif text-[6px] text-[#8B4055]">
              TOGETHER FOREVER
            </p>
          </div>
          <p
            className="absolute bottom-4 left-3 right-8 font-serif text-[9px] leading-snug text-[#7A4050] italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Thank you for being a part of my life
          </p>
          <SakuraMark className="absolute right-3 bottom-3 h-4 w-4 opacity-80" />
        </>
      ) : (
        <>
          <p
            className="absolute top-3 right-3 left-8 text-right font-serif text-[9px] leading-snug text-[#7A4050] italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Every moment with you is my favorite memory
          </p>
          <div className="absolute top-12 right-4 left-4 rotate-[2deg]">
            <div className="rounded-sm bg-white p-1 shadow-sm">
              <div
                className="flex h-12 w-full items-center justify-center rounded-[1px] sm:h-14"
                style={{
                  background:
                    "linear-gradient(180deg, #5B3A6E 0%, #C45B8A 45%, #F0A070 100%)",
                }}
              >
                <svg
                  viewBox="0 0 60 36"
                  className="h-full w-2/3 opacity-70"
                  aria-hidden
                >
                  <circle
                    cx="30"
                    cy="16"
                    r="9"
                    stroke="#1a1020"
                    strokeWidth="1"
                    fill="none"
                  />
                  <line
                    x1="30"
                    y1="7"
                    x2="30"
                    y2="25"
                    stroke="#1a1020"
                    strokeWidth="0.8"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute right-5 bottom-10 rotate-[-3deg]">
            <div className="rounded-sm bg-white p-0.5 shadow-sm">
              <div
                className="h-10 w-9 rounded-[1px]"
                style={{
                  background:
                    "linear-gradient(145deg, #E8C8B8 0%, #C890A0 60%, #8B6070 100%)",
                }}
              />
            </div>
          </div>
          <div
            aria-hidden
            className="absolute right-3 bottom-3 h-5 w-5 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #F0D878, #B8860B 55%, #6B4A10)",
            }}
          />
        </>
      )}
    </div>
  );
}

/** One continuous album: closed → half → fully open. */
function MemoryAlbum({ phase }: { phase: Phase }) {
  const half = phase >= 1;
  const full = phase >= 2;

  return (
    <motion.div
      className="relative"
      style={{ perspective: 1400 }}
      animate={{
        y: full ? 8 : [0, -7, 0],
        scale: full ? 1.06 : 1,
      }}
      transition={
        full
          ? { duration: 0.65, ease: SNAP }
          : {
              y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.5 },
            }
      }
    >
      {/* Heavy contact shadow — book weight */}
      <div
        aria-hidden
        className="absolute -bottom-8 left-1/2 h-7 w-[82%] -translate-x-1/2 rounded-full bg-[#9A4060]/35 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-4 left-1/2 h-3 w-[62%] -translate-x-1/2 rounded-full bg-[#B05070]/25 blur-md"
      />

      {/* Mid glow (KF2) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[15%] left-1/2 z-0 h-[70%] w-[70%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,230,160,0.85) 0%, rgba(255,200,120,0.3) 45%, transparent 70%)",
          filter: "blur(8px)",
        }}
        initial={false}
        animate={{
          opacity: full ? 0.3 : half ? 0.85 : 0,
          scale: half ? 1.05 : 0.9,
        }}
        transition={{ duration: 0.6, ease: SNAP }}
      />

      {/* Bookmark ribbon */}
      <motion.div
        aria-hidden
        className="absolute bottom-[-2.6rem] left-[15%] z-0 flex flex-col items-center"
        initial={false}
        animate={{ opacity: full ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <div
          className="h-14 w-[1.4rem] rounded-b-[3px]"
          style={{
            background:
              "linear-gradient(180deg, #F8B8CC 0%, #E8799A 48%, #C84868 100%)",
            boxShadow: "0 6px 12px rgba(140,40,70,0.35)",
          }}
        />
        <div className="mt-[-3px] rounded-full bg-[#F8B8CC] p-[3px] shadow-sm">
          <SakuraMark className="h-3.5 w-3.5" tone="#FFF5F8" />
        </div>
      </motion.div>

      <motion.div
        className="relative z-[1]"
        initial={false}
        animate={{
          width: full ? "20rem" : half ? "17.5rem" : "15rem",
          height: full ? "13.5rem" : half ? "21rem" : "21.5rem",
          rotate: full ? 0 : half ? -6 : -4,
        }}
        transition={{ duration: 0.7, ease: SNAP }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Thick spine */}
        <motion.div
          aria-hidden
          className="absolute top-1 bottom-1 left-[-0.7rem] z-[2] w-[0.7rem] rounded-l-[0.4rem]"
          initial={false}
          animate={{ opacity: full ? 0 : half ? 0.45 : 1 }}
          transition={{ duration: 0.45 }}
          style={{
            background:
              "linear-gradient(90deg, #B05878 0%, #D890A8 40%, #F0C0D0 100%)",
            boxShadow: "-4px 0 12px rgba(100,30,60,0.35)",
          }}
        />
        {/* —— FULLY OPEN (KF3): flat scrapbook —— */}
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
            {/* Pink bow */}
            <div
              aria-hidden
              className="absolute top-1/2 right-[-0.5rem] h-3 w-8 -translate-y-1/2 rounded-full"
              style={{
                background: "linear-gradient(90deg, #E8799A, #F4A8C0)",
                boxShadow: "0 2px 6px rgba(160,50,80,0.3)",
              }}
            />
          </div>
          {/* Spine crease glow seed */}
          <div
            aria-hidden
            className="absolute top-[10%] bottom-[10%] left-1/2 w-3 -translate-x-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,240,180,0.9), transparent)",
              filter: "blur(2px)",
            }}
          />
        </motion.div>

        {/* —— CLOSED / HALF (KF1–KF2) —— */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: full ? 0 : 1 }}
          transition={{ duration: 0.45, ease: SNAP }}
          style={{ pointerEvents: full ? "none" : "auto" }}
        >
          {/* Interior peek under cover */}
          <motion.div
            className="absolute inset-y-2 right-1 left-6 overflow-hidden rounded-[0.6rem]"
            initial={false}
            animate={{ opacity: half ? 1 : 0.25, x: half ? 0 : 6 }}
            transition={{ duration: 0.65, ease: SNAP }}
            style={{
              background: "linear-gradient(160deg, #FFF8F2 0%, #F5E8DC 100%)",
              boxShadow: "0 14px 28px -12px rgba(120,50,70,0.4)",
            }}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: half ? 1 : 0 }}
              transition={{ duration: 0.5, delay: half ? 0.15 : 0 }}
            >
              <div className="absolute top-4 right-3 left-3 rotate-[-3deg]">
                <div className="rounded-sm bg-white p-1 shadow-md">
                  <div
                    className="h-14 w-full rounded-[1px]"
                    style={{
                      background:
                        "linear-gradient(180deg, #5B3A6E 0%, #C45B8A 45%, #F0A070 100%)",
                    }}
                  />
                </div>
              </div>
              <div
                className="absolute top-[6.5rem] left-4 rounded-sm px-2 py-1"
                style={{
                  background: "linear-gradient(180deg, #F8C8D8, #F0A8C0)",
                }}
              >
                <p className="font-serif text-[8px] font-semibold text-[#6B3040]">
                  TOGETHER FOREVER ♥
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Thick page block — book depth */}
          <motion.div
            aria-hidden
            className="absolute top-2 right-[-0.85rem] bottom-2 z-[2] w-[0.85rem] rounded-r-[2px]"
            initial={false}
            animate={{ opacity: half ? 0 : 1, x: half ? -6 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background:
                "repeating-linear-gradient(180deg, #FFF9F2 0px, #FFF9F2 2px, #F2E2D2 2px, #F2E2D2 3px)",
              boxShadow: "4px 0 10px rgba(100,50,70,0.22)",
            }}
          />

          {/* Cover hinging open */}
          <motion.div
            className="absolute inset-y-0 left-0 z-[3] origin-left"
            initial={false}
            animate={{
              width: half ? "56%" : "100%",
              rotateY: half ? -52 : 0,
            }}
            transition={{ duration: 0.75, ease: SNAP }}
            style={{
              transformStyle: "preserve-3d",
              boxShadow: half
                ? "10px 14px 32px -8px rgba(90,30,55,0.5)"
                : "0 32px 56px -14px rgba(120,40,70,0.58), 0 8px 16px -6px rgba(100,40,60,0.3)",
            }}
          >
            <CoverFace compact={half} />
          </motion.div>

          {/* Gap light (KF2) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[8%] left-[34%] z-[4] h-[84%] w-11"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,235,170,0.75), rgba(255,245,210,0.95), transparent)",
              filter: "blur(2px)",
            }}
            initial={false}
            animate={{ opacity: half && !full ? 0.9 : 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Leather strap + gold snap */}
          <motion.div
            aria-hidden
            className="absolute top-1/2 z-[4] flex -translate-y-1/2 items-center"
            initial={false}
            animate={{
              right: half ? "-0.35rem" : "-0.95rem",
              rotate: half ? 28 : 0,
              x: half ? 12 : 0,
            }}
            transition={{ duration: 0.65, ease: SNAP }}
          >
            <div
              className="h-12 w-8 rounded-r-lg sm:h-[3.25rem] sm:w-9"
              style={{
                background:
                  "linear-gradient(100deg, #C86888 0%, #E8A0B8 35%, #F0B8C8 55%, #D87898 100%)",
                boxShadow:
                  "3px 4px 10px rgba(100,30,55,0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              initial={false}
              animate={{
                right: half ? "-0.4rem" : "-0.15rem",
                opacity: half ? 0 : 1,
                scale: half ? 0.5 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="h-5 w-5 rounded-full sm:h-[1.35rem] sm:w-[1.35rem]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 28%, #FFF3C0, #D4AF37 48%, #7A5610)",
                  boxShadow:
                    "0 2px 5px rgba(70,40,10,0.5), inset 0 1px 0 rgba(255,255,255,0.45)",
                }}
              />
            </motion.div>
            <motion.div
              className="absolute -right-1 -bottom-2"
              initial={false}
              animate={{ opacity: half ? 1 : 0, scale: half ? 1 : 0.5 }}
              transition={{ duration: 0.4, delay: half ? 0.15 : 0 }}
            >
              <SakuraMark className="h-5 w-5 drop-shadow" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** KF3 climax — blinding light fills the screen. */
function LightBurst({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {/* Soft rays */}
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
              rgba(255,245,200,0.55) 8deg,
              transparent 16deg,
              rgba(255,236,170,0.4) 28deg,
              transparent 36deg,
              rgba(255,250,220,0.5) 50deg,
              transparent 58deg,
              rgba(255,230,160,0.45) 72deg,
              transparent 80deg,
              rgba(255,245,200,0.55) 98deg,
              transparent 108deg,
              rgba(255,236,170,0.4) 130deg,
              transparent 140deg,
              rgba(255,250,220,0.5) 165deg,
              transparent 175deg,
              rgba(255,230,160,0.45) 200deg,
              transparent 210deg,
              rgba(255,245,200,0.55) 240deg,
              transparent 250deg,
              rgba(255,236,170,0.4) 280deg,
              transparent 290deg,
              rgba(255,250,220,0.5) 320deg,
              transparent 330deg,
              rgba(255,230,160,0.45) 350deg,
              transparent 360deg
            )
          `,
          filter: "blur(2px)",
        }}
      />

      {/* Core bloom */}
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
            "radial-gradient(circle, #FFFDF5 0%, #FFF3C8 18%, #FFE8A0 38%, rgba(255,220,150,0.55) 58%, transparent 72%)",
        }}
      />

      {/* Final white wash */}
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
            "radial-gradient(circle at 50% 48%, #FFFFFF 0%, #FFF8E8 40%, #FFEFC8 70%, #FFF6E0 100%)",
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
            "radial-gradient(ellipse 130% 100% at 50% 42%, #FFF9F7 0%, #FCEEF1 30%, #F5D4DE 58%, #E8B8C8 100%)",
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
              opacity: [0, 0.8, 0.8, 0],
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
 * moments.album-unlock-transition — Founder 3-keyframe unlock (~3s).
 */
export function AlbumUnlockTransitionScene(_props: MomentsSceneProps) {
  const [phase, setPhase] = useState<Phase>(0);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase(1), PHASE_MS.toHalf);
    const t2 = window.setTimeout(() => setPhase(2), PHASE_MS.toFull);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className={`${SCENE_VIEWPORT_LOCK} bg-[#F8E4E7]`}>
      <SceneAtmosphere />

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: SNAP }}
        >
          <MemoryAlbum phase={phase} />
        </motion.div>
      </div>

      <LightBurst active={phase >= 2} />
    </div>
  );
}
