"use client";

import { useCallback, useState, type ReactNode } from "react";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { LetterTypewriterBody } from "@/features/experience/scene-engine/shared/letter-typewriter";
import {
  allowAmbientLoop,
  MOTION_DURATION,
  MOTION_EASE,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";

const FALLING_PETALS = [
  { left: "6%", delay: 0.2, duration: 10, size: 16, x: 18, blur: 0 },
  { left: "18%", delay: 1.4, duration: 9.2, size: 12, x: -14, blur: 1 },
  { left: "34%", delay: 0.6, duration: 11, size: 18, x: 10, blur: 0 },
  { left: "48%", delay: 2.0, duration: 8.6, size: 11, x: -8, blur: 2 },
  { left: "62%", delay: 0.9, duration: 9.8, size: 15, x: 12, blur: 0 },
  { left: "76%", delay: 1.8, duration: 10.4, size: 13, x: -16, blur: 1 },
  { left: "88%", delay: 0.4, duration: 9.0, size: 17, x: 8, blur: 0 },
  { left: "94%", delay: 2.4, duration: 11.2, size: 10, x: -10, blur: 2 },
] as const;

const SCATTERED_PETALS = [
  { top: "14%", left: "10%", size: 22, rotate: -24, opacity: 0.85 },
  { top: "22%", left: "82%", size: 18, rotate: 30, opacity: 0.7 },
  { top: "58%", left: "6%", size: 20, rotate: 18, opacity: 0.8 },
  { top: "68%", left: "88%", size: 24, rotate: -12, opacity: 0.75 },
  { top: "78%", left: "18%", size: 16, rotate: 40, opacity: 0.65 },
  { top: "16%", left: "48%", size: 14, rotate: -8, opacity: 0.55 },
  { top: "84%", left: "72%", size: 19, rotate: 22, opacity: 0.7 },
] as const;

const SPARKLES = [
  { top: "16%", left: "14%", delay: 0.3, size: 3 },
  { top: "24%", left: "76%", delay: 0.9, size: 4 },
  { top: "38%", left: "8%", delay: 1.5, size: 3 },
  { top: "52%", left: "90%", delay: 0.6, size: 4 },
  { top: "66%", left: "12%", delay: 1.2, size: 3 },
  { top: "74%", left: "84%", delay: 0.4, size: 3 },
  { top: "44%", left: "92%", delay: 1.8, size: 5 },
  { top: "80%", left: "28%", delay: 1.0, size: 3 },
] as const;

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="18"
          rx="9"
          ry="14"
          fill="#F7A8BE"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5.5" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.2" fill="#F48CA8" />
    </svg>
  );
}

function Petal({
  className,
  tone = "#F7A8BE",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill={tone}
        opacity="0.95"
      />
      <path
        d="M12 6c-1.5 4-2.5 9-1.5 14"
        stroke="#FFF5F7"
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

function SakuraBloom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="24"
          cy="12"
          rx="7"
          ry="11"
          fill="#F4A0B8"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="4.5" fill="#FFF8F5" />
      <circle cx="24" cy="24" r="2" fill="#E8799A" />
    </svg>
  );
}

/** Curling satin ribbon — filled band with forked tip (not a stroke line). */
function SatinRibbon({
  side,
  ambient,
  reduceMotion,
}: {
  side: "left" | "right";
  ambient: boolean;
  reduceMotion: boolean;
}) {
  const isLeft = side === "left";
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 200 320"
      className={
        isLeft
          ? "pointer-events-none absolute top-[42%] left-[-28%] z-[1] h-[58%] w-[70%] drop-shadow-md sm:left-[-32%] sm:w-[72%]"
          : "pointer-events-none absolute top-[46%] right-[-30%] z-[1] h-[60%] w-[72%] drop-shadow-md sm:right-[-34%] sm:w-[74%]"
      }
      initial={reduceMotion ? false : { opacity: 0, x: isLeft ? -30 : 30 }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: ambient ? (isLeft ? [-1.5, 1.5, -1.5] : [1.5, -1.5, 1.5]) : 0,
      }}
      transition={{
        opacity: {
          delay: reduceMotion ? 0 : 0.2,
          duration: reduceMotion
            ? MOTION_DURATION.instant
            : MOTION_DURATION.ceremony,
        },
        x: {
          delay: reduceMotion ? 0 : 0.2,
          duration: reduceMotion
            ? MOTION_DURATION.instant
            : MOTION_DURATION.ceremony,
        },
        rotate: ambient
          ? { duration: 8, repeat: Infinity, ease: "easeInOut" }
          : { duration: MOTION_DURATION.instant },
      }}
    >
      <defs>
        <linearGradient id={`rb-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD0DE" />
          <stop offset="40%" stopColor="#F090B0" />
          <stop offset="100%" stopColor="#D45A7A" />
        </linearGradient>
        <linearGradient id={`rb-hi-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {isLeft ? (
        <>
          {/* Ribbon body — filled S-curve band */}
          <path
            d="M168 18
               C148 28 132 48 128 78
               C122 118 148 138 138 168
               C124 208 68 214 52 248
               C40 274 58 292 78 306
               L86 298
               C70 286 58 274 68 252
               C82 222 132 218 144 182
               C156 148 136 126 142 92
               C146 66 160 46 178 34 Z"
            fill={`url(#rb-${side})`}
          />
          <path
            d="M168 18
               C148 28 132 48 128 78
               C122 118 148 138 138 168
               C124 208 68 214 52 248
               C40 274 58 292 78 306
               L86 298
               C70 286 58 274 68 252
               C82 222 132 218 144 182
               C156 148 136 126 142 92
               C146 66 160 46 178 34 Z"
            fill={`url(#rb-hi-${side})`}
            opacity="0.55"
          />
          {/* Forked tip */}
          <path d="M78 306 L62 278 L90 292 Z" fill="#E07090" />
          <path d="M78 306 L98 274 L108 300 Z" fill="#C84868" />
        </>
      ) : (
        <>
          <path
            d="M32 22
               C52 32 68 52 72 82
               C78 122 52 142 62 172
               C76 212 132 218 148 252
               C160 278 142 296 122 310
               L114 302
               C130 290 142 278 132 256
               C118 226 68 222 56 186
               C44 152 64 130 58 96
               C54 70 40 50 22 38 Z"
            fill={`url(#rb-${side})`}
          />
          <path
            d="M32 22
               C52 32 68 52 72 82
               C78 122 52 142 62 172
               C76 212 132 218 148 252
               C160 278 142 296 122 310
               L114 302
               C130 290 142 278 132 256
               C118 226 68 222 56 186
               C44 152 64 130 58 96
               C54 70 40 50 22 38 Z"
            fill={`url(#rb-hi-${side})`}
            opacity="0.55"
          />
          <path d="M122 310 L138 282 L110 296 Z" fill="#E07090" />
          <path d="M122 310 L102 278 L92 304 Z" fill="#C84868" />
        </>
      )}
    </motion.svg>
  );
}

/** Open envelope — flap above letter, pocket peeking at sides/bottom. */
function OpenEnvelope({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -inset-x-7 -top-14 bottom-[-1.75rem] -z-10 sm:-inset-x-9 sm:-top-16 sm:bottom-[-2rem]"
      initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion
          ? MOTION_DURATION.instant
          : MOTION_DURATION.ceremony,
        ease: MOTION_EASE.out,
      }}
    >
      {/* Contact shadow */}
      <div className="absolute inset-x-6 bottom-0 h-8 rounded-full bg-[#B05070]/30 blur-2xl" />

      {/* Envelope pocket (behind letter, peeks at sides + bottom) */}
      <div
        className="absolute inset-x-0 top-[28%] bottom-0 overflow-hidden rounded-[3px] shadow-[0_22px_44px_-16px_rgba(150,50,80,0.5)]"
        style={{
          background:
            "linear-gradient(168deg, #FCE8EF 0%, #F5C2D2 38%, #E8A0B6 78%, #DE8AA4 100%)",
        }}
      >
        {/* Inner lining */}
        <div
          className="absolute inset-x-[5%] top-[6%] bottom-[8%] rounded-[2px]"
          style={{
            background:
              "linear-gradient(180deg, #FFF6F8 0%, #F8D0DC 55%, #EFB0C4 100%)",
            boxShadow: "inset 0 3px 12px rgba(170,70,100,0.2)",
          }}
        />
        {/* Left fold */}
        <div
          className="absolute inset-y-0 left-0 w-[22%]"
          style={{
            background:
              "linear-gradient(105deg, rgba(190,90,120,0.28) 0%, transparent 70%)",
            clipPath: "polygon(0 0, 100% 12%, 100% 100%, 0 100%)",
          }}
        />
        {/* Right fold */}
        <div
          className="absolute inset-y-0 right-0 w-[22%]"
          style={{
            background:
              "linear-gradient(255deg, rgba(190,90,120,0.28) 0%, transparent 70%)",
            clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        {/* Bottom lip */}
        <div
          className="absolute inset-x-0 bottom-0 h-[18%]"
          style={{
            background:
              "linear-gradient(0deg, rgba(180,80,110,0.25), transparent)",
          }}
        />
      </div>

      {/* Open triangular flap (clearly above the letter) */}
      <div
        className="absolute top-0 right-[2%] left-[2%] h-[36%]"
        style={{
          background:
            "linear-gradient(180deg, #FFF4F7 0%, #F9D0DE 48%, #EFB0C4 100%)",
          clipPath: "polygon(0 100%, 50% 4%, 100% 100%)",
          filter: "drop-shadow(0 8px 14px rgba(170,60,90,0.22))",
        }}
      />
      {/* Flap seam line */}
      <div
        className="absolute top-[8%] right-[18%] left-[18%] h-[24%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, transparent 85%)",
          clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
        }}
      />
      {/* Flap edge highlight */}
      <div
        className="absolute top-[2%] right-[2%] left-[2%] h-[36%] opacity-40"
        style={{
          background: "transparent",
          clipPath: "polygon(0 100%, 50% 4%, 100% 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
        }}
      />
    </motion.div>
  );
}

/** Split letter body into emotional reveal chunks (sentences). */
function splitLetterBody(body: string): string[] {
  const trimmed = body.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/(?<=[.!?…])\s+/).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}

function RevealText({
  children,
  delay,
  className,
  duration = MOTION_DURATION.ceremony,
  reduceMotion,
}: {
  children: ReactNode;
  delay: number;
  className?: string;
  duration?: number;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M17 10V8A5 5 0 0 0 7 8v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1Zm-8-2a3 3 0 0 1 6 0v2H9V8Zm3 10.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Z" />
    </svg>
  );
}

/**
 * moments.letter — living recreation of Founder Scene 6.
 * Soft luminous reading rhythm (sentence stagger) — presentation only.
 */
export function LetterScene({ payload, onComplete }: MomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);
  const { experience } = payload;
  const toName = experience.greeting_name;
  const fromName = experience.closing_name;
  const closing = experience.letter_closing?.trim() || "With love,";
  const bodyChunks = splitLetterBody(experience.letter_content ?? "");
  const [signOff, setSignOff] = useState(reduceMotion);
  const finishBody = useCallback(() => setSignOff(true), []);

  const pace = (n: number) => (reduceMotion ? 0 : n);

  return (
    <div className={`${SCENE_VIEWPORT_SCROLL} bg-[#F8E4E7]`}>
      {/* Soft peach-pink atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 140% 110% at 50% 38%, #FFF9F7 0%, #FCEEF1 28%, #F6D4DE 58%, #EBB8C8 100%)",
        }}
      />
      {/* Warm side wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[5%] right-[-10%] h-[60%] w-[50%] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220,130,150,0.45), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[5%] left-[-8%] h-[45%] w-[45%] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,200,210,0.55), transparent 70%)",
        }}
      />
      {/* Soft god-rays from top-right */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "conic-gradient(from 210deg at 78% 8%, transparent 0deg, rgba(255,255,255,0.22) 18deg, transparent 36deg, rgba(255,255,255,0.12) 52deg, transparent 70deg)",
          opacity: ambient ? undefined : 0.45,
        }}
        animate={ambient ? { opacity: [0.35, 0.6, 0.35] } : undefined}
        transition={
          ambient
            ? { duration: 7, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
      {/* Center glow behind letter */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 48% at 50% 42%, rgba(255,255,255,0.7) 0%, transparent 70%)",
          opacity: ambient ? undefined : 0.55,
        }}
        animate={ambient ? { opacity: [0.45, 0.75, 0.45] } : undefined}
        transition={
          ambient
            ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
      {/* Leaf dappling (right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[8%] right-[-5%] h-[55%] w-[40%] opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 18% 12% at 30% 20%, #9B4A62 0%, transparent 70%), radial-gradient(ellipse 14% 10% at 60% 35%, #9B4A62 0%, transparent 70%), radial-gradient(ellipse 20% 14% at 45% 55%, #9B4A62 0%, transparent 70%), radial-gradient(ellipse 12% 9% at 70% 70%, #9B4A62 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Scattered petals (depth) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SCATTERED_PETALS.map((p, i) => (
          <motion.div
            key={`scatter-${i}`}
            className={i > 3 ? "absolute hidden sm:block" : "absolute"}
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size * 1.3,
              opacity: p.opacity,
              rotate: p.rotate,
              filter: i % 3 === 0 ? "blur(1.5px)" : undefined,
            }}
            animate={
              ambient
                ? {
                    y: [0, -6, 0],
                    rotate: [p.rotate, p.rotate + 8, p.rotate],
                  }
                : undefined
            }
            transition={
              ambient
                ? {
                    duration: 5 + (i % 3),
                    delay: i * 0.25,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : undefined
            }
          >
            {i % 2 === 0 ? (
              <Petal
                className="h-full w-full"
                tone={i % 4 === 0 ? "#F4B0C4" : "#F7A8BE"}
              />
            ) : (
              <SakuraBloom className="h-full w-full" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Falling petals */}
      {ambient ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALLING_PETALS.map((petal, i) => (
            <motion.div
              key={`fall-${i}`}
              className={i > 3 ? "absolute hidden sm:block" : "absolute"}
              style={{
                left: petal.left,
                top: "-8%",
                width: petal.size,
                height: petal.size * 1.35,
                filter: petal.blur ? `blur(${petal.blur}px)` : undefined,
              }}
              animate={{
                opacity: [0, 0.85, 0.85, 0],
                y: ["0vh", "115vh"],
                x: [0, petal.x],
                rotate: [0, 50, -25],
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
      ) : null}

      {/* Sparkles */}
      {ambient ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              className={
                i > 3
                  ? "absolute hidden rounded-full bg-white sm:block"
                  : "absolute rounded-full bg-white"
              }
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 8px rgba(255,255,255,0.9)",
              }}
              animate={{ opacity: [0.1, 0.95, 0.1], scale: [0.7, 1.35, 0.7] }}
              transition={{
                duration: 2.6,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
        <div className="relative w-full max-w-[20rem] sm:max-w-[22rem]">
          <OpenEnvelope reduceMotion={reduceMotion} />
          {/* Ribbons tucked under the letter, curling out from the envelope */}
          <SatinRibbon
            side="left"
            ambient={ambient}
            reduceMotion={reduceMotion}
          />
          <SatinRibbon
            side="right"
            ambient={ambient}
            reduceMotion={reduceMotion}
          />

          <motion.article
            className="relative z-[2] rounded-sm border border-[#E8D0D6] bg-[#FFFCFB] px-6 pt-8 pb-6 shadow-[0_24px_55px_-18px_rgba(160,70,100,0.5)] sm:px-8 sm:pt-9 sm:pb-7"
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduceMotion
                ? MOTION_DURATION.instant
                : MOTION_DURATION.ceremony,
              delay: reduceMotion ? 0 : 0.08,
              ease: MOTION_EASE.out,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 border border-[#EED8DE]/80"
            />

            <div className="relative">
              <RevealText
                delay={pace(0.28)}
                reduceMotion={reduceMotion}
                className="text-center"
              >
                <SakuraMark className="mx-auto mb-3 h-6 w-6" />
                <p className="font-serif text-sm text-[#C45B7A]">To.</p>
                <p className="mt-0.5 font-serif text-3xl font-semibold tracking-tight text-[#8B2E3E] sm:text-4xl">
                  {toName}
                </p>
                <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#E8B0C0] to-transparent" />
              </RevealText>

              <RevealText
                delay={pace(0.48)}
                reduceMotion={reduceMotion}
                className="mt-5 text-left"
              >
                <p className="font-serif text-[15px] text-[#6B4450] sm:text-base">
                  Dear {toName},
                </p>
              </RevealText>

              <div className="mt-4 text-left sm:mt-5">
                <LetterTypewriterBody
                  chunks={bodyChunks}
                  startDelayMs={reduceMotion ? 0 : 720}
                  reduceMotion={reduceMotion}
                  onDone={finishBody}
                  ink="#6B4450"
                  caretColor="#C45B7A"
                />
              </div>

              <motion.div
                className="mt-6 text-left"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  delay: signOff && !reduceMotion ? 0.35 : 0,
                  ease: MOTION_EASE.out,
                }}
              >
                <p className="font-serif text-lg text-[#C45B7A] italic">
                  {closing}
                </p>
              </motion.div>

              <motion.div
                className="mt-1 text-left"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  delay: signOff && !reduceMotion ? 0.7 : 0,
                  ease: MOTION_EASE.out,
                }}
              >
                <p className="font-serif text-xl font-semibold text-[#8B2E3E] sm:text-2xl">
                  {fromName}
                </p>
              </motion.div>

              <motion.button
                type="button"
                aria-label="Unlock Memories"
                onClick={onComplete}
                disabled={!signOff}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#F7A0B8] to-[#E05A7A] px-5 py-3.5 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-[0_14px_32px_-8px_rgba(196,91,122,0.75)] ring-1 ring-white/45 focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none disabled:pointer-events-none sm:text-[13px]"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0, y: signOff ? 0 : 12 }}
                transition={{
                  delay: signOff && !reduceMotion ? 1.15 : 0,
                  duration: reduceMotion
                    ? MOTION_DURATION.instant
                    : MOTION_DURATION.base,
                  ease: MOTION_EASE.out,
                }}
                whileHover={
                  reduceMotion || !signOff ? undefined : { scale: 1.02 }
                }
                whileTap={{ scale: 0.98 }}
              >
                <LockIcon className="h-3.5 w-3.5 shrink-0 text-white" />
                Unlock Memories
                <SakuraMark className="h-3.5 w-3.5 shrink-0 brightness-[2]" />
              </motion.button>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
