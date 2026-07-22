"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";

const BG = "#2E060A";
const CREAM = "#FFF8F0";
const INK = "#4A1820";
const INK_SOFT = "#6B3038";
const GOLD = "#C9A227";
const GOLD_SOFT = "#F0D878";
const ROSE = "#8B1A22";

const EASE = [0.22, 1, 0.36, 1] as const;

const FALLING = [
  { left: "6%", delay: 0.1, duration: 7.2, size: 14, x: 18 },
  { left: "18%", delay: 1.4, duration: 8.1, size: 11, x: -14 },
  { left: "42%", delay: 0.6, duration: 7.6, size: 13, x: 10 },
  { left: "62%", delay: 2.0, duration: 8.4, size: 12, x: -12 },
  { left: "78%", delay: 0.9, duration: 7.8, size: 15, x: 8 },
  { left: "88%", delay: 1.7, duration: 9.0, size: 10, x: -10 },
] as const;

const SPARKLES = [
  { top: "10%", left: "14%", delay: 0.15, size: 3 },
  { top: "18%", left: "48%", delay: 0.7, size: 4 },
  { top: "28%", left: "78%", delay: 0.35, size: 3 },
  { top: "58%", left: "8%", delay: 1.1, size: 3 },
  { top: "70%", left: "36%", delay: 0.55, size: 2.5 },
  { top: "62%", left: "86%", delay: 0.9, size: 3.5 },
  { top: "42%", left: "58%", delay: 1.3, size: 2.5 },
] as const;

const HEARTS = [
  { top: "16%", left: "72%", delay: 0.4, size: 14 },
  { top: "74%", left: "18%", delay: 0.85, size: 12 },
  { top: "36%", left: "8%", delay: 1.15, size: 11 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#C42838"
        opacity="0.9"
      />
      <path
        d="M12 6C10 12 8 16 10 22"
        stroke="#F0D0D0"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

function GoldFiligree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 20" className={className} aria-hidden fill="none">
      <path
        d="M4 10 C12 4 20 4 32 10 C44 16 52 16 60 10"
        stroke={GOLD}
        strokeWidth="1.2"
        opacity="0.9"
      />
      <path
        d="M18 10 C22 6 26 6 32 10 C38 14 42 14 46 10"
        stroke={GOLD}
        strokeWidth="0.9"
        opacity="0.55"
      />
      <circle cx="32" cy="10" r="2.2" fill={GOLD_SOFT} opacity="0.95" />
    </svg>
  );
}

function LockBadge({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      style={{
        background: `radial-gradient(circle at 40% 30%, #A51C28 0%, ${ROSE} 55%, #5A0E14 100%)`,
        boxShadow:
          "0 10px 22px -8px rgba(40,8,12,0.6), 0 0 0 4px rgba(201,162,39,0.18)",
      }}
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden fill="none">
        <path
          d="M8 18h24v16H8z"
          stroke="#FFF8F0"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 18v-5a6 6 0 0 1 12 0v5"
          stroke="#FFF8F0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="26" r="2.2" fill="#FFF8F0" />
        <path
          d="M6 14l3-3M34 14l-3-3"
          stroke="#F0D878"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

function HeartRule() {
  return (
    <div
      className="mx-auto flex max-w-[12rem] items-center gap-2.5"
      aria-hidden
    >
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
        }}
      />
      <motion.span
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="16" height="14" viewBox="0 0 14 12" fill="none">
          <path
            d="M7 11S1.8 7.5.8 4.8C.1 3.2 1.2 1.4 3 1.4c1.1 0 2 .7 2.4 1.5C5.8 2.1 6.7 1.4 7.8 1.4c1.8 0 2.9 1.8 2.2 3.4C9.2 7.5 7 11 7 11Z"
            fill={GOLD}
          />
        </svg>
      </motion.span>
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }}
      />
    </div>
  );
}

function LockGiftTag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 72" className={className} aria-hidden>
      <defs>
        <linearGradient id="warmLockTagEmote" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3E6D2" />
          <stop offset="100%" stopColor="#D8C4A4" />
        </linearGradient>
      </defs>
      <path
        d="M26 0 C26 6 28 10 28 14"
        stroke="#6B4428"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="8"
        y="12"
        width="40"
        height="54"
        rx="3"
        fill="url(#warmLockTagEmote)"
        stroke="#B89868"
        strokeWidth="1"
      />
      <rect
        x="12"
        y="16"
        width="32"
        height="46"
        rx="2"
        fill="none"
        stroke="rgba(107,68,40,0.25)"
        strokeWidth="0.8"
      />
      <path
        d="M22 36 h12 v14 H22z"
        fill="none"
        stroke="#4A1820"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M25 36 v-4 a3 3 0 0 1 6 0 v4"
        fill="none"
        stroke="#4A1820"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="43" r="1.6" fill="#4A1820" />
    </svg>
  );
}

const cardReveal = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

/**
 * Warm Connection Scene 3 — Challenge Invitation (emotional upgrade).
 * Dramatic velvet field, falling petals, heartbeat lock, spring gift, staged card.
 */
export function WarmConnectionChallengeInvitationScene({
  onComplete,
}: WarmConnectionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ backgroundColor: BG }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 65% at 28% 42%, rgba(180,40,55,0.55) 0%, transparent 62%)",
            "radial-gradient(ellipse 65% 55% at 78% 48%, rgba(120,24,34,0.48) 0%, transparent 58%)",
            "radial-gradient(ellipse 130% 95% at 50% 115%, #0E0204 0%, transparent 50%)",
            "radial-gradient(ellipse 110% 70% at 50% -12%, rgba(100,20,28,0.6) 0%, transparent 50%)",
            "linear-gradient(165deg, #5A121A 0%, #3A080C 38%, #1E0406 100%)",
          ].join(", "),
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(240,216,120,0.12) 0%, transparent 45%)",
        }}
        animate={
          reduceMotion ? { opacity: 0.5 } : { opacity: [0.25, 0.55, 0.25] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Falling rose petals */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALLING.map((p, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: p.left,
                top: "-8%",
                width: p.size,
                height: p.size * 1.35,
              }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                y: ["0vh", "110vh"],
                x: [0, p.x, p.x * -0.4],
                rotate: [0, 40, -25, 55],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      {!reduceMotion ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                backgroundColor: GOLD_SOFT,
                boxShadow: `0 0 12px ${GOLD}`,
              }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.35, 0.8] }}
              transition={{
                duration: 2.4,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          {HEARTS.map((h, i) => (
            <motion.span
              key={`h-${i}`}
              className="absolute"
              style={{
                top: h.top,
                left: h.left,
                fontSize: h.size,
                color: "rgba(232,160,170,0.55)",
              }}
              animate={{ y: [0, -10, 0], opacity: [0.35, 0.75, 0.35] }}
              transition={{
                duration: 3.4,
                delay: h.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ♡
            </motion.span>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center gap-5 px-4 py-10 sm:gap-7 sm:px-8 lg:flex-row lg:items-center lg:gap-10 lg:py-12">
        <motion.div
          className="relative flex w-full max-w-md flex-col items-center justify-center py-4 lg:flex-1"
          initial={reduceMotion ? false : { opacity: 0, x: -28, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 18,
            delay: 0.05,
          }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-[52%] rounded-full sm:h-[30rem] sm:w-[30rem]"
            style={{
              background:
                "radial-gradient(circle, rgba(240,216,120,0.28) 0%, rgba(165,28,40,0.4) 34%, rgba(58,8,12,0) 70%)",
            }}
            animate={
              reduceMotion
                ? undefined
                : { scale: [0.96, 1.06, 0.96], opacity: [0.75, 1, 0.75] }
            }
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="relative z-10"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                    rotate: [0, -1.2, 1.2, 0],
                  }
            }
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <WarmGiftBox
              variant="closed"
              reduceMotion={reduceMotion}
              className="h-[17rem] w-[16rem] sm:h-[19.5rem] sm:w-[18rem] lg:h-[21rem] lg:w-[19.5rem]"
            />
            <motion.div
              className="pointer-events-none absolute top-[36%] right-[4%]"
              animate={
                reduceMotion ? undefined : { y: [0, 4, 0], rotate: [6, 10, 6] }
              }
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <LockGiftTag className="h-[4.25rem] w-[3.25rem] drop-shadow-md sm:h-[4.75rem] sm:w-14" />
            </motion.div>
          </motion.div>

          <motion.p
            className="relative z-10 mt-3 font-serif text-sm tracking-[0.2em] text-[#E8D4C0]/75 uppercase sm:text-[15px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            Still sealed with love
          </motion.p>

          <div
            aria-hidden
            className="pointer-events-none mt-2 h-6 w-52 rounded-[100%] sm:w-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(10,2,4,0.65) 0%, transparent 72%)",
            }}
          />
        </motion.div>

        <motion.article
          className="relative w-full max-w-[21.5rem] shrink-0 sm:max-w-[23rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.18,
            type: "spring",
            stiffness: 210,
            damping: 18,
          }}
        >
          {/* Soft celebration bloom behind card */}
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,248,240,0.35) 0%, rgba(201,162,39,0.2) 40%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.9, 0.35], scale: [0.4, 1.2, 1.35] }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          ) : null}

          <GoldFiligree className="absolute -top-3 left-1/2 z-20 h-5 w-24 -translate-x-1/2 sm:-top-4 sm:h-6 sm:w-28" />

          <div
            className="relative overflow-hidden px-6 pt-11 pb-7 sm:px-8 sm:pt-12 sm:pb-8"
            style={{
              background: CREAM,
              border: `1.5px solid ${GOLD}`,
              boxShadow: [
                "inset 0 0 0 4px #FFF8F0",
                "inset 0 0 0 5px rgba(201,162,39,0.5)",
                "0 32px 60px -22px rgba(20,4,8,0.7)",
                "0 0 40px -10px rgba(201,162,39,0.25)",
              ].join(", "),
              borderRadius: "0.4rem",
            }}
          >
            {(
              [
                "top-2 left-2",
                "top-2 right-2",
                "bottom-2 left-2",
                "bottom-2 right-2",
              ] as const
            ).map((pos) => (
              <span
                key={pos}
                aria-hidden
                className={`pointer-events-none absolute h-3 w-3 ${pos}`}
                style={{
                  borderColor: GOLD,
                  borderWidth: pos.includes("top")
                    ? pos.includes("left")
                      ? "1.5px 0 0 1.5px"
                      : "1.5px 1.5px 0 0"
                    : pos.includes("left")
                      ? "0 0 1.5px 1.5px"
                      : "0 1.5px 1.5px 0",
                  borderStyle: "solid",
                  borderRadius: pos.includes("top")
                    ? pos.includes("left")
                      ? "0.35rem 0 0 0"
                      : "0 0.35rem 0 0"
                    : pos.includes("left")
                      ? "0 0 0 0.35rem"
                      : "0 0 0.35rem 0",
                }}
              />
            ))}

            <motion.div
              className="flex flex-col items-center text-center"
              variants={cardReveal}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp}>
                <LockBadge className="mb-3 flex h-12 w-12 items-center justify-center rounded-full" />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mb-2 font-sans text-[10px] font-semibold tracking-[0.28em] uppercase"
                style={{ color: "#B8903A" }}
              >
                A little pause…
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="font-serif text-[1.7rem] leading-tight font-semibold sm:text-[1.95rem]"
                style={{ color: INK }}
              >
                This gift
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-0.5 font-serif text-[1.6rem] leading-tight italic sm:text-[1.8rem]"
                style={{ color: ROSE }}
              >
                is still locked.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-5 mb-4 w-full">
                <HeartRule />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="max-w-[17rem] font-sans text-[13px] leading-relaxed sm:text-sm"
                style={{ color: INK_SOFT }}
              >
                Complete the challenge to open your surprise — something tender
                is waiting inside.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 w-full">
                <motion.button
                  type="button"
                  onClick={onComplete}
                  aria-label="Start challenge"
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3.5 font-sans text-[11px] font-semibold tracking-[0.16em] text-[#FFF8F0] uppercase sm:text-xs"
                  style={{
                    background: `linear-gradient(105deg, #5A0E14 0%, ${ROSE} 40%, #B81E2C 78%, #C9A227 140%)`,
                    boxShadow: [
                      "0 16px 32px -12px rgba(80,12,20,0.65)",
                      "0 0 28px -8px rgba(201,162,39,0.45)",
                      "inset 0 1px 0 rgba(255,248,240,0.28)",
                    ].join(", "),
                  }}
                  animate={undefined}
                  transition={undefined}
                  whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {!reduceMotion ? (
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      initial={{ left: "-40%" }}
                      animate={{ left: ["-40%", "120%"] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.8,
                      }}
                    />
                  ) : null}
                  <span className="relative">Start Challenge</span>
                  <motion.span
                    aria-hidden
                    className="relative text-sm leading-none"
                    animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
