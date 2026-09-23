"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";

const ASSETS = {
  roseBouquet: "/themes/warm/moments/scene-02-rose-bouquet.png",
} as const;

/** Warm crimson field */
const BG = "#6B0F16";
const INK_LIGHT = "#F5E6D8";
const INK_SOFT = "rgba(232, 180, 168, 0.92)";
const CARD_BORDER = "#C9A227";
const CARD_TITLE = "#8B1A22";
const CARD_BODY = "#5C3A3A";
const CTA = "#A51C28";

type Bubble = {
  side: "left" | "right";
  text: string;
  icon: string;
  top: string;
  delay: number;
  hideOnMobile?: boolean;
};

const BUBBLES: Bubble[] = [
  {
    side: "left",
    icon: "🎁",
    text: "I have a surprise!",
    top: "14%",
    delay: 0.5,
  },
  {
    side: "left",
    icon: "💖",
    text: "Made with love...",
    top: "40%",
    delay: 0.7,
  },
  {
    side: "left",
    icon: "💐",
    text: "A special gift is waiting...",
    top: "66%",
    delay: 0.9,
    hideOnMobile: true,
  },
  {
    side: "right",
    icon: "✨",
    text: "I have a surprise for you!",
    top: "18%",
    delay: 0.6,
  },
  {
    side: "right",
    icon: "🎀",
    text: "A sweet surprise for you!",
    top: "44%",
    delay: 0.8,
    hideOnMobile: true,
  },
  {
    side: "right",
    icon: "🌹",
    text: "Tap to unwrap your surprise...",
    top: "70%",
    delay: 1.0,
  },
];

const DRIFT_PETALS = [
  { left: "8%", top: "18%", size: 22, delay: 0, duration: 7 },
  { left: "78%", top: "12%", size: 18, delay: 1.2, duration: 8 },
  { left: "14%", top: "72%", size: 16, delay: 0.6, duration: 6.5 },
  { left: "88%", top: "58%", size: 20, delay: 1.8, duration: 7.5 },
  { left: "42%", top: "8%", size: 14, delay: 2.2, duration: 9 },
] as const;

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
 * Warm Moments Scene 2 — Gift Box / gift introduction.
 * Founder reference living recreation; tap roses advances to Scene 3 hold.
 */
export function WarmGiftBoxScene({ payload, onComplete }: MomentsSceneProps) {
  const name = payload.experience.greeting_name;
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className={cn(SCENE_VIEWPORT_SCROLL)} style={{ backgroundColor: BG }}>
      {/* Soft vignette + depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 42%, rgba(120,24,32,0.55) 0%, transparent 70%), radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(30,4,8,0.55) 100%)",
        }}
      />

      {/* Paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Drift petals */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {DRIFT_PETALS.map((petal, i) => (
            <motion.div
              key={i}
              className={i > 2 ? "absolute hidden sm:block" : "absolute"}
              style={{
                left: petal.left,
                top: petal.top,
                width: petal.size,
                height: petal.size * 1.3,
              }}
              animate={{
                opacity: [0.25, 0.7, 0.25],
                y: [0, -14, 0],
                x: [0, i % 2 === 0 ? 8 : -8, 0],
                rotate: [0, 12, -8, 0],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <motion.header
          className="mb-5 text-center sm:mb-6"
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1
            className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: INK_LIGHT }}
          >
            For {name}
          </h1>
          <p
            className="mt-3 font-serif text-sm sm:text-base"
            style={{ color: INK_SOFT }}
          >
            — a sweet surprise is waiting for you —
          </p>
        </motion.header>

        <div className="relative mx-auto w-full max-w-md">
          {/* Desktop side bubbles */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            aria-hidden
          >
            {BUBBLES.map((bubble) => (
              <motion.div
                key={`${bubble.side}-${bubble.text}`}
                className={cn(
                  "absolute rounded-full border border-[#E8D4C0]/35 bg-white px-3 py-2 text-xs shadow-[0_8px_20px_-10px_rgba(40,0,0,0.45)]",
                  bubble.side === "left"
                    ? "right-[calc(100%+0.75rem)]"
                    : "left-[calc(100%+0.75rem)]",
                )}
                style={{ top: bubble.top }}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: bubble.side === "left" ? -16 : 16 }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                  y: reduceMotion ? 0 : [0, -5, 0],
                }}
                transition={{
                  opacity: { delay: bubble.delay, duration: 0.4 },
                  x: { delay: bubble.delay, duration: 0.45 },
                  y: {
                    delay: bubble.delay + 0.5,
                    duration: 4 + bubble.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <span className="whitespace-nowrap font-serif text-[#5C3A3A]">
                  {bubble.text} <span aria-hidden>{bubble.icon}</span>
                </span>
              </motion.div>
            ))}
          </div>

          <motion.article
            className="relative flex flex-col overflow-visible rounded-2xl bg-white px-5 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-5"
            style={{
              border: `2px solid ${CARD_BORDER}`,
              boxShadow: `0 22px 55px -18px rgba(40,0,0,0.55), 0 0 0 1px rgba(201,162,39,0.35), inset 0 0 0 1px rgba(201,162,39,0.2)`,
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex flex-col items-center px-1 text-center">
              <p
                className="text-[10px] font-semibold tracking-[0.22em] uppercase"
                style={{ color: "#C45B6A" }}
              >
                {"// A special gift for you"}
              </p>
              <h2
                className="mt-2 font-serif text-2xl font-semibold sm:text-3xl"
                style={{ color: CARD_TITLE }}
              >
                A Special Surprise!
              </h2>
              <p
                className="mt-4 max-w-xs font-serif text-sm leading-relaxed italic sm:text-[15px]"
                style={{ color: CARD_BODY }}
              >
                &ldquo;A beautiful moment captured just for you. Open this
                envelope to reveal a sweet message of warmth and love…&rdquo;
              </p>
            </div>

            {/* CTA + roses — same mid-height, no dead space */}
            <div className="mt-5 flex items-center justify-between gap-2 pl-[12%] sm:mt-6 sm:gap-3 sm:pl-[14%]">
              <p
                className="max-w-[14rem] text-left text-xs leading-snug font-bold tracking-[0.08em] uppercase sm:max-w-[16rem] sm:text-sm sm:tracking-[0.1em]"
                style={{ color: CTA }}
              >
                Tap the red roses to unwrap{" "}
                <motion.span
                  aria-hidden
                  className="inline-block text-base leading-none sm:text-lg"
                  animate={reduceMotion ? undefined : { x: [0, 5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  👉
                </motion.span>{" "}
                <span aria-hidden className="text-base sm:text-lg">
                  🌹
                </span>
              </p>

              <motion.button
                type="button"
                aria-label="Tap the red roses to unwrap"
                onClick={onComplete}
                className="-mr-1 shrink-0 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:outline-none sm:-mr-2"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ opacity: { duration: 0.45, delay: 0.3 } }}
              >
                <motion.span
                  className="block drop-shadow-[0_10px_18px_rgba(40,0,0,0.4)]"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, -4, 0],
                          rotate: [0, -1.5, 1.5, 0],
                        }
                  }
                  transition={{
                    duration: 3.2,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ASSETS.roseBouquet}
                    alt=""
                    className="h-[6.5rem] w-auto sm:h-28"
                    width={140}
                    height={150}
                    draggable={false}
                  />
                </motion.span>
              </motion.button>
            </div>
          </motion.article>
        </div>

        {/* Mobile bubbles — in-flow so short viewports can scroll to them */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 px-1 lg:hidden">
          {BUBBLES.filter((b) => !b.hideOnMobile).map((bubble, i) => (
            <motion.span
              key={bubble.text}
              className="rounded-full border border-[#E8D4C0]/40 bg-white px-3 py-1.5 text-[11px] font-serif text-[#5C3A3A] shadow-sm"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
            >
              {bubble.text} <span aria-hidden>{bubble.icon}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
