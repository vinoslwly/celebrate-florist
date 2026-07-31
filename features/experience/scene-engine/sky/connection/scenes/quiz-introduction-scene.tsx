"use client";

import type { CSSProperties } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const GOLD = "#FFE8A0";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Static sticker placement — density without Framer cost. */
const STATIC_STARS = [
  { top: "12%", left: "22%", size: 10, fill: GOLD, rotate: -12 },
  { top: "18%", right: "24%", size: 8, fill: "#FFFFFF", rotate: 20 },
  { top: "42%", left: "8%", size: 9, fill: SKY, rotate: 8 },
  { top: "48%", right: "10%", size: 11, fill: GOLD, rotate: -18 },
  { top: "68%", left: "28%", size: 7, fill: "#FFFFFF", rotate: 14 },
  { top: "72%", right: "30%", size: 8, fill: SKY, rotate: -8 },
] as const;

const FALL_STARS = [
  { left: "12%", delay: "0s", duration: "9s", size: 11, drift: "12px" },
  { left: "40%", delay: "2.4s", duration: "10s", size: 9, drift: "-10px" },
  { left: "68%", delay: "1.1s", duration: "8.5s", size: 12, drift: "14px" },
  { left: "86%", delay: "3.6s", duration: "9.5s", size: 10, drift: "-12px" },
] as const;

function SoftStar({
  className,
  fill = SKY,
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

function SoftCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 64" className={className} aria-hidden fill="none">
      <ellipse cx="46" cy="40" rx="36" ry="18" fill="white" opacity="0.92" />
      <ellipse cx="84" cy="32" rx="34" ry="24" fill="white" opacity="0.97" />
      <ellipse cx="122" cy="40" rx="30" ry="17" fill="white" opacity="0.9" />
    </svg>
  );
}

function DenimScrap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 56" className={className} aria-hidden fill="none">
      <path
        d="M6 10 C14 4 28 6 36 4 C48 2 62 8 66 16 C70 28 64 42 52 48 C38 54 18 50 10 40 C4 32 2 18 6 10Z"
        fill="#5A8BB8"
      />
      <path
        d="M14 16 C22 12 34 14 42 12 C50 14 58 20 56 28"
        stroke="#A8C8E0"
        strokeWidth="1.2"
        strokeDasharray="3 2"
        opacity="0.7"
      />
      <path
        d="M18 28 C28 24 40 30 48 26"
        stroke="#A8C8E0"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.5"
      />
    </svg>
  );
}

function GlossyHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 36" className={className} aria-hidden>
      <defs>
        <linearGradient id="skyGlossHeart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8D8F0" />
          <stop offset="55%" stopColor="#5A9BC4" />
          <stop offset="100%" stopColor="#3D7AAD" />
        </linearGradient>
      </defs>
      <path
        d="M20 32C20 32 4 20 4 12C4 7 8 4 12.5 4C15.5 4 18 5.8 20 8.5C22 5.8 24.5 4 27.5 4C32 4 36 7 36 12C36 20 20 32 20 32Z"
        fill="url(#skyGlossHeart)"
        stroke="#FFFFFF"
        strokeWidth="1.4"
      />
      <ellipse cx="13" cy="11" rx="4" ry="2.2" fill="white" opacity="0.55" />
    </svg>
  );
}

function GraphStarPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <rect
        x="8"
        y="10"
        width="44"
        height="40"
        rx="3"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1.2"
        transform="rotate(8 30 30)"
      />
      {[18, 26, 34, 42].map((y) => (
        <line
          key={y}
          x1="14"
          y1={y}
          x2="46"
          y2={y}
          stroke="#C5DCEF"
          strokeWidth="0.8"
          transform="rotate(8 30 30)"
        />
      ))}
      {[16, 24, 32, 40].map((x) => (
        <line
          key={x}
          x1={x}
          y1="14"
          x2={x}
          y2="46"
          stroke="#C5DCEF"
          strokeWidth="0.8"
          transform="rotate(8 30 30)"
        />
      ))}
      <path
        d="M32 14 35.2 24.2 46 25 37.6 32 40.4 42.5 32 36.2 23.6 42.5 26.4 32 18 25 28.8 24.2Z"
        fill={SKY_DEEP}
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      <circle cx="48" cy="14" r="3.2" fill="#7EB6D9" opacity="0.85" />
    </svg>
  );
}

function PolaroidSticker({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 80" className={className} aria-hidden fill="none">
      <rect
        x="8"
        y="10"
        width="50"
        height="58"
        rx="3"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1.3"
        transform="rotate(-8 33 39)"
      />
      <rect
        x="13"
        y="15"
        width="40"
        height="36"
        fill="#B8DCF0"
        transform="rotate(-8 33 39)"
      />
      <ellipse
        cx="28"
        cy="28"
        rx="10"
        ry="5"
        fill="white"
        opacity="0.85"
        transform="rotate(-8 33 39)"
      />
      <ellipse
        cx="40"
        cy="32"
        rx="8"
        ry="4"
        fill="white"
        opacity="0.7"
        transform="rotate(-8 33 39)"
      />
      {/* Washi tape */}
      <rect
        x="18"
        y="4"
        width="28"
        height="10"
        rx="1"
        fill="#7EB6D9"
        opacity="0.55"
        transform="rotate(6 32 9)"
      />
      <path
        d="M20 6 H44 M20 10 H44"
        stroke="white"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        opacity="0.6"
        transform="rotate(6 32 9)"
      />
    </svg>
  );
}

function TeddyBear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden fill="none">
      <circle cx="18" cy="18" r="10" fill="#E8D5B8" />
      <circle cx="46" cy="18" r="10" fill="#E8D5B8" />
      <circle cx="18" cy="18" r="5" fill="#D4B896" />
      <circle cx="46" cy="18" r="5" fill="#D4B896" />
      <ellipse cx="32" cy="34" rx="18" ry="16" fill="#E8D5B8" />
      <ellipse cx="32" cy="52" rx="14" ry="12" fill="#E8D5B8" />
      <circle cx="26" cy="32" r="2" fill={INK} />
      <circle cx="38" cy="32" r="2" fill={INK} />
      <ellipse cx="32" cy="38" rx="4" ry="3" fill="#C4A882" />
      <path
        d="M28 42 Q32 45 36 42"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blue bow */}
      <path
        d="M24 22 C20 18 18 22 22 24 L32 26 L42 24 C46 22 44 18 40 22 L32 26 Z"
        fill={SKY_DEEP}
      />
      <circle cx="32" cy="25" r="3" fill={SKY} />
    </svg>
  );
}

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden fill="none">
      <path
        d="M4 24 L60 6 L36 42 L28 28 Z"
        fill="#A8D0E8"
        stroke={INK_SOFT}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M28 28 L60 6 L34 30 Z"
        fill="#E8F4FC"
        stroke={INK_SOFT}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M8 32 C4 36 2 40 1 44"
        stroke={SKY}
        strokeWidth="1.4"
        strokeDasharray="3 3"
        opacity="0.7"
      />
    </svg>
  );
}

function Pinwheel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden fill="none">
      <line
        x1="24"
        y1="28"
        x2="24"
        y2="54"
        stroke={INK_SOFT}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {[0, 90, 180, 270].map((deg) => (
        <path
          key={deg}
          d="M24 28 Q34 18 38 28 Q28 34 24 28Z"
          fill={deg % 180 === 0 ? SKY_DEEP : SKY}
          transform={`rotate(${deg} 24 28)`}
        />
      ))}
      <circle
        cx="24"
        cy="28"
        r="3"
        fill="#FFFEFB"
        stroke={INK}
        strokeWidth="1"
      />
    </svg>
  );
}

function RetroCamera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden fill="none">
      <rect x="6" y="12" width="52" height="30" rx="6" fill={SKY_DEEP} />
      <rect x="10" y="16" width="44" height="22" rx="4" fill="#4A8BB8" />
      <circle
        cx="32"
        cy="27"
        r="10"
        fill="#E8F4FC"
        stroke={INK}
        strokeWidth="1.5"
      />
      <circle cx="32" cy="27" r="6" fill="#7EB6D9" />
      <circle cx="32" cy="27" r="2.5" fill={INK} />
      <rect x="42" y="8" width="10" height="6" rx="2" fill={SKY} />
      <circle cx="14" cy="20" r="2" fill="#FFE8A0" />
    </svg>
  );
}

function LinedScrap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 48" className={className} aria-hidden fill="none">
      <rect
        x="4"
        y="6"
        width="44"
        height="36"
        rx="2"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1"
        transform="rotate(6 26 24)"
      />
      {[14, 22, 30].map((y) => (
        <line
          key={y}
          x1="10"
          y1={y}
          x2="42"
          y2={y}
          stroke="#C5DCEF"
          strokeWidth="1"
          transform="rotate(6 26 24)"
        />
      ))}
      <path
        d="M26 12 27.5 16.5 32 17 28.5 20 29.5 24.5 26 22 22.5 24.5 23.5 20 20 17 24.5 16.5Z"
        fill={SKY}
        transform="rotate(6 26 24)"
      />
    </svg>
  );
}

function SilkRibbon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={className} aria-hidden fill="none">
      <path
        d="M4 14 C12 4 20 4 24 14 C28 24 36 24 44 14"
        stroke={SKY_DEEP}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 14 C12 4 20 4 24 14 C28 24 36 24 44 14"
        stroke="#A8D0E8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * sky.connection.quiz-introduction — Founder Scene 5 living recreation.
 * Scrapbook sky collage · gift float · denim Start · CSS-first motion (mobile-light).
 */
export function SkyConnectionQuizIntroductionScene({
  onComplete,
}: SkyConnectionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ background: "#A8D0E8" }}>
      <style>{`
        @keyframes sqi-star-fall {
          0% { transform: translate3d(0, -8%, 0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.9; }
          88% { opacity: 0.8; }
          100% { transform: translate3d(var(--sqi-drift), 112vh, 0) rotate(50deg); opacity: 0; }
        }
        @keyframes sqi-glow-breathe {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.94); }
          50% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes sqi-gift-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
        }
        @keyframes sqi-sparkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes sqi-bob {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--sqi-rot, 0deg)); }
          50% { transform: translate3d(0, -6px, 0) rotate(var(--sqi-rot, 0deg)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sqi-anim-fall, .sqi-anim-glow, .sqi-anim-float, .sqi-anim-sparkle, .sqi-anim-bob {
            animation: none !important;
          }
        }
      `}</style>

      {/* Soft sky atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 75% 55% at 10% 6%, rgba(255,250,220,0.75) 0%, transparent 50%)",
            "radial-gradient(ellipse 120% 95% at 50% 40%, #FFFFFF 0%, #E8F4FC 32%, #C5DCEF 65%, #A8D0E8 100%)",
          ].join(", "),
        }}
      />

      {/* Cloud band — static */}
      <SoftCloud className="pointer-events-none absolute top-[3%] left-[-8%] h-16 w-44 opacity-85" />
      <SoftCloud className="pointer-events-none absolute top-[5%] right-[-6%] h-14 w-40 opacity-75 -scale-x-100" />
      <SoftCloud className="pointer-events-none absolute bottom-[-2%] left-[-4%] h-20 w-52 opacity-90" />
      <SoftCloud className="pointer-events-none absolute right-[-2%] bottom-[-1%] h-[4.5rem] w-48 opacity-85 -scale-x-100" />

      {/* Soft glow behind gift */}
      <div
        aria-hidden
        className="sqi-anim-glow pointer-events-none absolute top-[44%] left-1/2 h-[56vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(184,220,240,0.5) 40%, transparent 70%)",
          animation: reduceMotion
            ? undefined
            : "sqi-glow-breathe 3.2s ease-in-out infinite",
          willChange: reduceMotion ? undefined : "transform, opacity",
        }}
      />

      {/* Top-left denim + heart */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[4%] left-[2%] z-[5] sm:left-[6%]"
      >
        <DenimScrap className="h-14 w-[4.5rem] drop-shadow-md sm:h-16 sm:w-20" />
        <GlossyHeart className="absolute top-4 left-6 h-9 w-10 drop-shadow-md sm:h-11 sm:w-12" />
      </div>

      {/* Top-right graph star + ribbon */}
      <div
        aria-hidden
        className="sqi-anim-bob pointer-events-none absolute top-[5%] right-[2%] z-[5] sm:right-[6%]"
        style={
          {
            ["--sqi-rot"]: "8deg",
            animation: reduceMotion
              ? undefined
              : "sqi-bob 3.6s ease-in-out 0.4s infinite",
          } as CSSProperties
        }
      >
        <GraphStarPin className="h-16 w-16 drop-shadow-md sm:h-20 sm:w-20" />
        <SilkRibbon className="absolute -bottom-1 left-2 h-6 w-12 opacity-90" />
      </div>

      {/* Left polaroid */}
      <div
        aria-hidden
        className="sqi-anim-bob pointer-events-none absolute top-[28%] left-[1%] z-[5] sm:left-[5%]"
        style={
          {
            ["--sqi-rot"]: "-8deg",
            animation: reduceMotion
              ? undefined
              : "sqi-bob 4s ease-in-out 0.2s infinite",
          } as CSSProperties
        }
      >
        <PolaroidSticker className="h-20 w-[4.5rem] drop-shadow-lg sm:h-24 sm:w-20" />
      </div>

      {/* Right teddy + plane */}
      <div
        aria-hidden
        className="sqi-anim-bob pointer-events-none absolute top-[26%] right-[1%] z-[5] sm:right-[5%]"
        style={
          {
            ["--sqi-rot"]: "6deg",
            animation: reduceMotion
              ? undefined
              : "sqi-bob 3.8s ease-in-out 0.6s infinite",
          } as CSSProperties
        }
      >
        <TeddyBear className="h-16 w-14 drop-shadow-md sm:h-20 sm:w-16" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] right-[8%] z-[5] sm:right-[12%]"
      >
        <PaperPlane className="h-9 w-12 rotate-[-20deg] drop-shadow-md sm:h-11 sm:w-14" />
      </div>

      {/* Bottom accents */}
      <Pinwheel className="pointer-events-none absolute bottom-[10%] left-[6%] z-[5] h-12 w-10 drop-shadow-md sm:left-[10%] sm:h-14 sm:w-12" />
      <GlossyHeart className="pointer-events-none absolute bottom-[14%] left-[18%] z-[5] h-7 w-8 rotate-[-18deg] opacity-90 sm:left-[22%]" />
      <RetroCamera className="pointer-events-none absolute right-[6%] bottom-[10%] z-[5] h-10 w-14 drop-shadow-md sm:right-[10%] sm:h-12 sm:w-16" />
      <LinedScrap className="pointer-events-none absolute right-[20%] bottom-[8%] z-[5] h-10 w-12 rotate-[10deg] drop-shadow-sm sm:right-[24%]" />

      {/* Static sparkle stars */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STATIC_STARS.map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: s.top,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              width: s.size,
              height: s.size,
              transform: `rotate(${s.rotate}deg)`,
              opacity: 0.8,
            }}
          >
            <SoftStar className="h-full w-full" fill={s.fill} />
          </div>
        ))}
      </div>

      {/* CSS falling stars — 4 only */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALL_STARS.map((star, i) => (
            <div
              key={i}
              className="sqi-anim-fall absolute"
              style={
                {
                  left: star.left,
                  top: 0,
                  width: star.size,
                  height: star.size,
                  ["--sqi-drift"]: star.drift,
                  animation: `sqi-star-fall ${star.duration} linear ${star.delay} infinite`,
                  willChange: "transform, opacity",
                } as CSSProperties
              }
            >
              <SoftStar className="h-full w-full" fill={GOLD} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Soft CSS sparkles near gift */}
      {!reduceMotion ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            { top: "38%", left: "24%", size: 5, delay: "0s" },
            { top: "34%", left: "72%", size: 4, delay: "0.6s" },
            { top: "52%", left: "28%", size: 6, delay: "1.1s" },
            { top: "48%", left: "74%", size: 4, delay: "0.3s" },
          ].map((s, i) => (
            <span
              key={i}
              className="sqi-anim-sparkle absolute rounded-full bg-white"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 8px rgba(255,255,255,0.9)",
                animation: `sqi-sparkle 2.4s ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
          {[
            { top: "40%", left: "20%" },
            { top: "46%", left: "78%" },
          ].map((h, i) => (
            <span
              key={`h-${i}`}
              className="sqi-anim-sparkle absolute text-base text-[#7EB6D9] sm:text-lg"
              style={{
                top: h.top,
                left: h.left,
                animation: `sqi-sparkle 2.8s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              ♥
            </span>
          ))}
        </div>
      ) : null}

      {/* Hero content */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center px-5 pt-12 pb-8 sm:px-10 sm:pt-14 sm:pb-10">
        <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-between gap-3">
          <div className="flex w-full flex-col items-center">
            <motion.h1
              className="max-w-[17rem] text-center font-serif leading-[1.12] tracking-tight sm:max-w-md"
              style={{ color: INK }}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="block text-[1.85rem] font-semibold sm:text-[2.55rem]">
                How well do you
              </span>
              <span
                className="mt-1 block text-[2.05rem] font-medium italic sm:mt-1.5 sm:text-[2.75rem]"
                style={{ color: INK_SOFT }}
              >
                know me?
              </span>
            </motion.h1>

            <motion.div
              className="mt-4 flex items-center justify-center gap-3"
              style={{ color: SKY }}
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.45, delay: 0.12, ease: EASE }}
            >
              <span className="h-px w-12 bg-current opacity-70 sm:w-16" />
              <SoftStar className="h-3.5 w-3.5" fill={SKY_DEEP} />
              <span className="h-px w-12 bg-current opacity-70 sm:w-16" />
            </motion.div>
          </div>

          <motion.div
            className="relative my-1 flex shrink-0 items-center justify-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <div
              className="sqi-anim-float"
              style={{
                animation: reduceMotion
                  ? undefined
                  : "sqi-gift-float 3.4s ease-in-out 0.7s infinite",
                willChange: reduceMotion ? undefined : "transform",
              }}
            >
              <SkyGiftBox
                variant="closed"
                className="relative h-44 w-44 drop-shadow-[0_18px_28px_rgba(30,58,95,0.28)] sm:h-56 sm:w-56"
              />
            </div>
          </motion.div>

          <div className="flex w-full flex-col items-center">
            <motion.p
              className="max-w-[18rem] text-center font-serif text-[1.05rem] leading-relaxed italic sm:max-w-sm sm:text-xl"
              style={{ color: INK_SOFT }}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28, ease: EASE }}
            >
              Answer every question to unlock your gift.
            </motion.p>

            <motion.button
              type="button"
              aria-label="Start quiz"
              onClick={onComplete}
              className="relative mt-6 inline-flex w-full max-w-[16rem] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold tracking-wide text-white focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none sm:max-w-[18rem] sm:py-4 sm:text-lg"
              style={{
                background: `linear-gradient(180deg, ${SKY} 0%, ${SKY_DEEP} 55%, #4A8BB8 100%)`,
                boxShadow:
                  "0 14px 28px -10px rgba(30,58,95,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4, ease: EASE }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Denim stitch ring */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[5px] rounded-full border border-dashed border-white/75"
              />
              {/* Soft denim weave hint */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0 2px, rgba(255,255,255,0.25) 2px 3px), repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,40,0.08) 2px 3px)",
                }}
              />
              <span className="relative font-serif">Start</span>
              <span aria-hidden className="relative text-lg leading-none">
                →
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
