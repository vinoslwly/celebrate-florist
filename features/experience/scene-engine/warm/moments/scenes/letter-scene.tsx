"use client";

import { useCallback, useState, type ReactNode } from "react";

import { Cormorant_Garamond, Outfit } from "next/font/google";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_SCROLL_PANE } from "@/features/experience/scene-engine/scene-viewport";
import { LetterTypewriterBody } from "@/features/experience/scene-engine/shared/letter-typewriter";
import {
  allowAmbientLoop,
  MOTION_DURATION,
  MOTION_EASE,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";

const editorial = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const label = Outfit({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** Warm luxury palette — quiet contrast, velvet field. */
const CREAM = "#FFFBF5";
const CREAM_EDGE = "#F3E8D8";
const INK = "#3A2428";
const INK_SOFT = "#6A4A4E";
const ROSE = "#8B1A22";
const ROSE_SOFT = "#A83A42";
const GOLD = "#C9A227";
const GOLD_SOFT = "#E8C96A";

function splitLetterBody(body: string): string[] {
  const trimmed = body.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/(?<=[.!?…])\s+/).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}

function Reveal({
  children,
  delay,
  className,
  reduceMotion,
  duration = MOTION_DURATION.ceremony,
}: {
  children: ReactNode;
  delay: number;
  className?: string;
  reduceMotion: boolean;
  duration?: number;
}) {
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: MOTION_EASE.out }}
    >
      {children}
    </motion.div>
  );
}

/** Soft petal silhouette — gradient wash, not a sticker. */
function SoftPetal({
  className,
  tone = "mid",
  gradId,
}: {
  className?: string;
  tone?: "deep" | "mid" | "soft";
  gradId: string;
}) {
  const fill =
    tone === "deep" ? "#6B1018" : tone === "soft" ? "#C45A5A" : "#A81E2C";
  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="30%" y1="10%" x2="70%" y2="90%">
          <stop offset="0%" stopColor="#E07070" stopOpacity="0.5" />
          <stop offset="45%" stopColor={fill} />
          <stop offset="100%" stopColor="#3A080C" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M20 3C12 12 5 22 7 34c1.5 9 11 16 13 7 2-7-1-16-6-26 4 2 9 4 13 2 5-3 9-11 5-20-5 5-9 9-12 16Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden>
      <path
        d="M10 16.5S2.8 11.6 1.2 7.8C.2 5.4 1.6 2.8 4.2 2.8c1.5 0 2.7.9 3.3 2 .6-1.1 1.8-2 3.3-2 2.6 0 4 2.6 3 5C17.2 11.6 10 16.5 10 16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Deterministic mix — SSR-safe continuous rain. */
function mix(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type RainPetal = {
  left: string;
  size: number;
  delay: number;
  duration: number;
  x: number;
  rotateFrom: number;
  rotateTo: number;
  blur: number;
  opacity: number;
  tone: "deep" | "mid" | "soft";
};

/** Quiet luxury rain — ~28 small petals, soft + continuous (not Scene 5 heboh). */
function buildRain(): RainPetal[] {
  const tones = ["deep", "mid", "soft"] as const;
  const out: RainPetal[] = [];
  for (let i = 0; i < 28; i++) {
    const m = mix(i + 11);
    const m2 = mix(i + 77);
    out.push({
      left: `${(i * 7.8 + m * 6) % 100}%`,
      size: 12 + m * 16,
      delay: m * 4.5,
      duration: 9 + m2 * 6,
      x: (m - 0.5) * 56,
      rotateFrom: -40 + m * 70,
      rotateTo: 30 + m2 * 80,
      blur: m > 0.6 ? 1.2 + m * 2 : 0.35,
      opacity: 0.32 + m * 0.34,
      tone: tones[i % 3]!,
    });
  }
  return out;
}

const RAIN = buildRain();

/**
 * Warm Moments Scene 6 — Letter.
 *
 * Premium hanging card on velvet mist + soft petal rain.
 * Code-built only (HTML / CSS / SVG / motion).
 * Founder ref: design-references/warm/moments/scene-06-letter-reference.png
 */
export function WarmLetterScene({ payload, onComplete }: MomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);
  const { experience } = payload;
  const toName = experience.greeting_name || "You";
  const fromName = experience.closing_name || "Someone who loves you";
  const closing = experience.letter_closing?.trim() || "With love,";
  const bodyChunks = splitLetterBody(experience.letter_content ?? "");
  const [signOff, setSignOff] = useState(reduceMotion);
  const finishBody = useCallback(() => setSignOff(true), []);

  const pace = (n: number) => (reduceMotion ? 0 : n);

  return (
    <div
      className={`${editorial.className} relative z-30 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden`}
      style={{
        background:
          "radial-gradient(ellipse 72% 58% at 50% 36%, #7A1820 0%, #4A0A10 46%, #1E0408 100%)",
      }}
    >
      {/* Soft velvet wash — fixed field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 40% at 50% 42%, rgba(255,220,200,0.06) 0%, transparent 70%)",
            "radial-gradient(ellipse 80% 50% at 12% 18%, rgba(140,30,40,0.28) 0%, transparent 55%)",
            "radial-gradient(ellipse 70% 45% at 90% 22%, rgba(90,16,24,0.35) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* Soft rising petal rain — behind the card */}
      {ambient ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        >
          {RAIN.map((petal, i) => (
            <motion.div
              key={i}
              className={i > 7 ? "absolute hidden sm:block" : "absolute"}
              style={{
                left: petal.left,
                top: "-8%",
                width: petal.size,
                filter: `blur(${petal.blur}px)`,
              }}
              initial={{ y: "-10vh", opacity: 0, rotate: petal.rotateFrom }}
              animate={{
                y: ["-10vh", "110vh"],
                x: [0, petal.x * 0.5, petal.x],
                rotate: [petal.rotateFrom, petal.rotateTo],
                opacity: [0, petal.opacity, petal.opacity, 0],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.12, 0.82, 1],
              }}
            >
              <SoftPetal
                tone={petal.tone}
                gradId={`warmS6rain-${i}`}
                className="h-auto w-full"
              />
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Scrollable hanging card — sole scrollport (host must not also scroll) */}
      <div className={SCENE_SCROLL_PANE}>
        <div className="mx-auto flex w-full max-w-[22.5rem] flex-col items-center px-5 pt-6 pb-14 sm:max-w-[24rem] sm:px-6 sm:pt-8 sm:pb-16">
          {/* Gold thread */}
          <motion.div
            aria-hidden
            className="relative z-[2] flex h-10 w-px flex-col items-center sm:h-12"
            initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              duration: reduceMotion
                ? MOTION_DURATION.instant
                : MOTION_DURATION.ceremony,
              ease: MOTION_EASE.out,
            }}
            style={{
              transformOrigin: "top",
              background: `linear-gradient(180deg, transparent 0%, ${GOLD_SOFT} 20%, ${GOLD} 100%)`,
            }}
          >
            <span
              className="absolute bottom-0 h-1.5 w-1.5 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${GOLD_SOFT}, ${GOLD})`,
                boxShadow: `0 0 6px ${GOLD}88`,
              }}
            />
          </motion.div>

          <motion.article
            className="relative w-full overflow-hidden rounded-[1.75rem] px-7 pt-9 pb-7 sm:rounded-[2rem] sm:px-9 sm:pt-10 sm:pb-8"
            style={{
              background: `linear-gradient(165deg, ${CREAM} 0%, #FFF8EE 48%, ${CREAM_EDGE} 100%)`,
              boxShadow: [
                "0 28px 56px -24px rgba(0,0,0,0.55)",
                "0 0 0 1px rgba(255,255,255,0.55)",
                "inset 0 0 0 1px rgba(201,162,39,0.22)",
                "inset 0 1px 0 rgba(255,255,255,0.85)",
              ].join(", "),
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion
                ? MOTION_DURATION.instant
                : MOTION_DURATION.ceremony,
              delay: pace(0.1),
              ease: MOTION_EASE.out,
            }}
          >
            {/* Soft paper grain */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            <div className="relative text-center">
              <Reveal delay={pace(0.28)} reduceMotion={reduceMotion}>
                <p
                  className={`${label.className} text-[10px] font-medium tracking-[0.28em] uppercase sm:text-[11px]`}
                  style={{ color: ROSE_SOFT }}
                >
                  To:
                </p>
                <h1
                  className="mt-1.5 text-[2rem] font-semibold tracking-tight sm:text-[2.25rem]"
                  style={{ color: ROSE }}
                >
                  {toName}
                </h1>
              </Reveal>

              {/* Clean gold rule — no flower icon */}
              <Reveal
                delay={pace(0.48)}
                reduceMotion={reduceMotion}
                className="mt-5 mb-5"
              >
                <div className="mx-auto flex max-w-[11rem] items-center gap-2.5">
                  <span
                    className="h-px flex-1"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${GOLD})`,
                    }}
                  />
                  <span
                    className="h-[3px] w-[3px] rotate-45 shrink-0"
                    style={{ background: GOLD }}
                  />
                  <span
                    className="h-px flex-1"
                    style={{
                      background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                    }}
                  />
                </div>
              </Reveal>

              <Reveal delay={pace(0.68)} reduceMotion={reduceMotion}>
                <p
                  className="text-[15px] italic sm:text-base"
                  style={{ color: INK_SOFT }}
                >
                  Dear {toName},
                </p>
              </Reveal>

              <div className="mt-4 text-left sm:mt-5">
                <LetterTypewriterBody
                  chunks={bodyChunks}
                  startDelayMs={reduceMotion ? 0 : 720}
                  reduceMotion={reduceMotion}
                  onDone={finishBody}
                  ink={INK}
                  caretColor={GOLD}
                />
              </div>

              <motion.div
                className="mt-8"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  delay: signOff && !reduceMotion ? 0.35 : 0,
                  ease: MOTION_EASE.out,
                }}
              >
                <p
                  className={`${label.className} text-[10px] font-medium tracking-[0.28em] uppercase sm:text-[11px]`}
                  style={{ color: ROSE_SOFT }}
                >
                  {closing.replace(/,$/, "").toUpperCase()}
                  {closing.endsWith(",") ? "," : ""}
                </p>
              </motion.div>

              <motion.div
                className="mt-1.5"
                initial={false}
                animate={{ opacity: signOff ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  delay: signOff && !reduceMotion ? 0.7 : 0,
                  ease: MOTION_EASE.out,
                }}
              >
                <p
                  className="text-[1.35rem] font-medium tracking-tight sm:text-[1.5rem]"
                  style={{ color: ROSE }}
                >
                  {fromName}
                </p>
              </motion.div>

              <motion.button
                type="button"
                aria-label="Unlock Memory Album"
                onClick={onComplete}
                disabled={!signOff}
                className={`${label.className} relative mt-8 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase sm:mt-9 sm:py-4 sm:text-xs disabled:pointer-events-none`}
                style={{
                  background:
                    "linear-gradient(105deg, #7A121C 0%, #B81E2C 38%, #D4A24A 78%, #E8C96A 100%)",
                  boxShadow: [
                    "0 12px 28px -12px rgba(120,20,30,0.65)",
                    "0 0 24px -8px rgba(212,162,74,0.45)",
                    "inset 0 1px 0 rgba(255,255,255,0.28)",
                  ].join(", "),
                }}
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
                  reduceMotion || !signOff ? undefined : { scale: 1.018 }
                }
                whileTap={{ scale: 0.985 }}
              >
                Unlock Memory Album
                <HeartIcon className="h-3.5 w-3.5 shrink-0 opacity-95" />
              </motion.button>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
