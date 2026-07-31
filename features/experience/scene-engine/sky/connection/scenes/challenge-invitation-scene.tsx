"use client";

import type { CSSProperties } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const CREAM = "#FFFEFB";
const EASE = [0.22, 1, 0.36, 1] as const;

const FALLING_STARS = [
  { left: "12%", delay: 0.3, duration: 9, size: 10, x: 10 },
  { left: "52%", delay: 1.4, duration: 8.2, size: 9, x: -8 },
  { left: "78%", delay: 0.8, duration: 8.8, size: 11, x: 12 },
] as const;

const STATIC_DECOR = [
  {
    kind: "cloud-lg" as const,
    top: "2%",
    left: "-6%",
    opacity: 0.88,
    flip: false,
  },
  {
    kind: "cloud-md" as const,
    top: "6%",
    right: "-4%",
    opacity: 0.72,
    flip: true,
  },
  {
    kind: "cloud-sm" as const,
    bottom: "8%",
    left: "4%",
    opacity: 0.62,
    flip: false,
  },
  {
    kind: "cloud-sm" as const,
    bottom: "5%",
    right: "2%",
    opacity: 0.68,
    flip: true,
  },
  {
    kind: "cloud-md" as const,
    top: "38%",
    left: "-8%",
    opacity: 0.45,
    flip: false,
  },
  { kind: "heart" as const, top: "11%", right: "7%", opacity: 0.9, rotate: 12 },
  {
    kind: "heart" as const,
    bottom: "18%",
    left: "10%",
    opacity: 0.55,
    rotate: -18,
    scale: 0.72,
  },
  {
    kind: "star" as const,
    top: "20%",
    left: "8%",
    size: 16,
    fill: "#FFE8A0",
    opacity: 0.85,
  },
  {
    kind: "star" as const,
    top: "14%",
    left: "22%",
    size: 11,
    fill: SKY,
    opacity: 0.7,
  },
  {
    kind: "star" as const,
    top: "32%",
    right: "16%",
    size: 13,
    fill: "#FFE8A0",
    opacity: 0.75,
  },
  {
    kind: "star" as const,
    bottom: "22%",
    right: "12%",
    size: 14,
    fill: SKY,
    opacity: 0.65,
  },
  {
    kind: "star" as const,
    bottom: "30%",
    left: "16%",
    size: 10,
    fill: "#FFE8A0",
    opacity: 0.6,
  },
  {
    kind: "star" as const,
    top: "44%",
    right: "6%",
    size: 9,
    fill: "#FFFFFF",
    opacity: 0.55,
  },
  { kind: "daisy" as const, bottom: "4%", left: "46%", opacity: 0.8 },
] as const;

const BURST = [
  { x: -78, y: -32, rotate: -24, delay: 0.2, size: 14 },
  { x: 82, y: -40, rotate: 28, delay: 0.24, size: 12 },
  { x: -52, y: 44, rotate: -16, delay: 0.3, size: 11 },
  { x: 58, y: 52, rotate: 20, delay: 0.34, size: 13 },
  { x: 0, y: -70, rotate: 6, delay: 0.22, size: 15 },
  { x: -30, y: -58, rotate: -12, delay: 0.28, size: 10 },
  { x: 36, y: -54, rotate: 14, delay: 0.26, size: 10 },
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

function PaperStitchCloud({
  className,
  flip,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 72"
      className={`${className ?? ""}${flip ? " -scale-x-100" : ""}`}
      aria-hidden
      fill="none"
    >
      <ellipse cx="44" cy="42" rx="34" ry="18" fill="white" opacity="0.92" />
      <ellipse cx="78" cy="34" rx="30" ry="22" fill="white" opacity="0.96" />
      <ellipse cx="112" cy="40" rx="28" ry="17" fill="white" opacity="0.88" />
      <ellipse cx="62" cy="48" rx="22" ry="12" fill="white" opacity="0.85" />
      <path
        d="M18 44 C24 28 38 22 58 24 C68 14 88 14 102 24 C118 20 138 28 144 42 C148 52 138 58 120 56 C108 64 88 66 72 60 C52 66 32 62 22 52 Z"
        stroke={SKY}
        strokeWidth="1.4"
        strokeDasharray="4 3"
        opacity="0.55"
      />
    </svg>
  );
}

function SoftDaisy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="16"
          cy="9"
          rx="4.5"
          ry="7"
          fill="white"
          opacity="0.95"
          transform={`rotate(${deg} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="5" fill="#FFE8A0" />
      <circle cx="16" cy="16" r="2.2" fill="#F0D060" opacity="0.85" />
    </svg>
  );
}

function SoftHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 28" className={className} aria-hidden>
      <path
        d="M16 25C16 25 3 16 3 9.5C3 5.5 6 3 9.5 3C12.2 3 14.4 4.6 16 7C17.6 4.6 19.8 3 22.5 3C26 3 29 5.5 29 9.5C29 16 16 25 16 25Z"
        fill={SKY}
      />
      <circle cx="11" cy="11" r="1.2" fill="white" opacity="0.75" />
      <circle cx="16" cy="9" r="1" fill="white" opacity="0.7" />
      <circle cx="21" cy="12" r="1.1" fill="white" opacity="0.75" />
      <circle cx="14" cy="15" r="0.9" fill="white" opacity="0.65" />
      <circle cx="19" cy="16" r="0.9" fill="white" opacity="0.65" />
    </svg>
  );
}

function SpiralBinding({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={className} aria-hidden fill="none">
      {[8, 16, 24, 32, 40].map((x) => (
        <g key={x}>
          <path
            d={`M${x} 4 C${x + 4} 8 ${x + 4} 16 ${x} 22 C${x - 4} 16 ${x - 4} 8 ${x} 4Z`}
            fill={SKY_DEEP}
            opacity="0.9"
          />
          <ellipse
            cx={x}
            cy="6"
            rx="3.2"
            ry="2.2"
            fill="#A8D0E8"
            opacity="0.85"
          />
        </g>
      ))}
    </svg>
  );
}

/** Founder Scene 3 lock seal — circular scalloped ring + white disc + dashed ring. */
function SkyLockSealBadge({ className }: { className?: string }) {
  const scallopedRing =
    "M 48.00 7.00 Q 59.91 3.57 68.50 12.49 Q 80.53 15.47 83.51 27.50 Q 92.43 36.09 89.00 48.00 Q 92.43 59.91 83.51 68.50 Q 80.53 80.53 68.50 83.51 Q 59.91 92.43 48.00 89.00 Q 36.09 92.43 27.50 83.51 Q 15.47 80.53 12.49 68.50 Q 3.57 59.91 7.00 48.00 Q 3.57 36.09 12.49 27.50 Q 15.47 15.47 27.50 12.49 Q 36.09 3.57 48.00 7.00 Z";

  return (
    <motion.div
      className={className}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 96 96"
        className="h-full w-full drop-shadow-[0_8px_18px_rgba(30,58,95,0.22)]"
        aria-hidden
        fill="none"
      >
        {/* Circular scalloped sky ring */}
        <path
          d={scallopedRing}
          fill="#B8DCF0"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner white disc — perfect circle like reference */}
        <circle cx="48" cy="48" r="31" fill="#FFFFFF" />
        <circle
          cx="48"
          cy="48"
          r="28"
          stroke={INK_SOFT}
          strokeWidth="1.6"
          strokeDasharray="5 4"
          opacity="0.85"
        />

        {/* Sparkles inside disc */}
        <path
          d="M30 36 31.2 39.2 34.5 40.4 31.2 41.6 30 45 28.8 41.6 25.5 40.4 28.8 39.2Z"
          fill={SKY}
        />
        <path
          d="M66 36 67.2 39.2 70.5 40.4 67.2 41.6 66 45 64.8 41.6 61.5 40.4 64.8 39.2Z"
          fill={SKY}
        />
        <path
          d="M28 54 29 56.5 31.5 57.5 29 58.5 28 61 27 58.5 24.5 57.5 27 56.5Z"
          fill={SKY}
        />
        <path
          d="M68 54 69 56.5 71.5 57.5 69 58.5 68 61 67 58.5 64.5 57.5 67 56.5Z"
          fill={SKY}
        />

        {/* Solid navy padlock */}
        <g fill={INK}>
          <path d="M36 50 V36.5 C36 29.5 41.2 24.5 48 24.5 C54.8 24.5 60 29.5 60 36.5 V50 H56 V36.5 C56 31.8 52.6 28.5 48 28.5 C43.4 28.5 40 31.8 40 36.5 V50 Z" />
          <rect x="36" y="48" width="24" height="20" rx="5" />
        </g>
        <circle cx="48" cy="55" r="3.2" fill="#FFFFFF" />
        <rect
          x="46.4"
          y="55"
          width="3.2"
          height="7.5"
          rx="1.2"
          fill="#FFFFFF"
        />
      </svg>
    </motion.div>
  );
}

function StarRule() {
  return (
    <div
      className="flex w-full items-center justify-center gap-2"
      style={{ color: SKY_DEEP }}
      aria-hidden
    >
      <span className="h-px flex-1 max-w-[4.5rem] bg-current opacity-55" />
      <SoftStar className="h-3.5 w-3.5" fill={SKY_DEEP} />
      <span className="h-px flex-1 max-w-[4.5rem] bg-current opacity-55" />
    </div>
  );
}

function SkySceneDecor({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      {/* Static layer — no animation, mobile-safe */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STATIC_DECOR.map((item, i) => {
          const style: CSSProperties = {
            opacity: item.opacity,
            ...("top" in item && item.top ? { top: item.top } : {}),
            ...("bottom" in item && item.bottom ? { bottom: item.bottom } : {}),
            ...("left" in item && item.left ? { left: item.left } : {}),
            ...("right" in item && item.right ? { right: item.right } : {}),
          };

          if (item.kind === "cloud-lg") {
            return (
              <div key={i} className="absolute" style={style}>
                <PaperStitchCloud
                  flip={"flip" in item ? item.flip : false}
                  className="h-[4.5rem] w-[10rem] sm:h-20 sm:w-44"
                />
              </div>
            );
          }
          if (item.kind === "cloud-md") {
            return (
              <div key={i} className="absolute" style={style}>
                <PaperStitchCloud
                  flip={"flip" in item ? item.flip : false}
                  className="h-14 w-32 sm:h-16 sm:w-36"
                />
              </div>
            );
          }
          if (item.kind === "cloud-sm") {
            return (
              <div key={i} className="absolute" style={style}>
                <PaperStitchCloud
                  flip={"flip" in item ? item.flip : false}
                  className="h-11 w-24"
                />
              </div>
            );
          }
          if (item.kind === "heart") {
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  ...style,
                  transform: `rotate(${"rotate" in item ? item.rotate : 0}deg) scale(${"scale" in item ? item.scale : 1})`,
                }}
              >
                <SoftHeart className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
            );
          }
          if (item.kind === "star") {
            return (
              <div
                key={i}
                className="absolute"
                style={{ ...style, width: item.size, height: item.size }}
              >
                <SoftStar
                  className="h-full w-full"
                  fill={"fill" in item ? item.fill : SKY}
                />
              </div>
            );
          }
          return (
            <div key={i} className="absolute -translate-x-1/2" style={style}>
              <SoftDaisy className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
          );
        })}
      </div>

      {/* Two gentle cloud drifts — only animated layer besides falling stars */}
      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[28%] right-[12%] opacity-50"
            animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <PaperStitchCloud className="h-12 w-28" />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[52%] left-[6%] opacity-40"
            animate={{ x: [0, -6, 0], y: [0, 3, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          >
            <PaperStitchCloud flip className="h-10 w-24" />
          </motion.div>
        </>
      ) : null}
    </>
  );
}

const cardReveal = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.38 },
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
 * sky.connection.challenge-invitation — Founder Scene 3 living recreation.
 * Scrapbook sky card · heartbeat lock · entrance bloom + star burst · Start Challenge.
 */
export function SkyConnectionChallengeInvitationScene({
  onComplete,
}: SkyConnectionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ background: "#C5DCEF" }}>
      {/* Sky atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 120% 90% at 30% 8%, rgba(255,255,255,0.75) 0%, transparent 45%)",
            "radial-gradient(ellipse 130% 100% at 50% 42%, #F7FBFE 0%, #E8F2FA 32%, #D4E8F5 62%, #C5DCEF 100%)",
          ].join(", "),
        }}
      />

      {/* Soft paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <SkySceneDecor reduceMotion={reduceMotion} />

      {/* Ambient falling stars — capped at 3 for mobile perf */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALLING_STARS.map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: s.left,
                top: "-6%",
                width: s.size,
                height: s.size,
              }}
              animate={{
                opacity: [0, 0.85, 0.85, 0],
                y: ["0vh", "110vh"],
                x: [0, s.x, s.x * -0.35],
                rotate: [0, 40, -20, 55],
              }}
              transition={{
                duration: s.duration,
                delay: s.delay + 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftStar className="h-full w-full" fill="#FFE8A0" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 py-12 sm:px-8">
        <div className="relative w-full max-w-[21rem] sm:max-w-[23rem]">
          {/* Entrance bloom */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-80 sm:w-80"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(126,182,217,0.45) 38%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={
              reduceMotion
                ? { opacity: 0.4, scale: 1 }
                : { opacity: [0, 0.95, 0], scale: [0.3, 1.2, 1.5] }
            }
            transition={{ duration: 1.05, ease: EASE }}
          />

          {/* One-shot star burst */}
          {!reduceMotion ? (
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 z-0"
            >
              {BURST.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: p.size,
                    height: p.size,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: p.x,
                    y: p.y,
                    scale: [0.3, 1.1, 0.8],
                    rotate: p.rotate,
                  }}
                  transition={{
                    duration: 0.9,
                    delay: p.delay,
                    ease: EASE,
                  }}
                >
                  <SoftStar
                    className="h-full w-full"
                    fill={i % 2 === 0 ? "#FFE8A0" : SKY}
                  />
                </motion.div>
              ))}
            </div>
          ) : null}

          {/* Scrapbook card */}
          <motion.div
            className="relative z-10 overflow-visible rounded-[1.75rem] px-6 pt-10 pb-7 sm:px-8 sm:pt-11 sm:pb-8"
            style={{
              background: `linear-gradient(165deg, ${CREAM} 0%, #F4F9FC 55%, #EEF5FA 100%)`,
              boxShadow:
                "0 28px 50px -22px rgba(30,58,95,0.4), 0 0 0 1px rgba(126,182,217,0.35)",
            }}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 36, scale: 0.88, rotate: -1.5 }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 210,
              damping: 18,
              delay: 0.12,
            }}
          >
            {/* Scalloped edge feel via dashed stitch */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-[1.35rem] border-2 border-dashed opacity-50"
              style={{ borderColor: "rgba(255,255,255,0.95)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[0.85rem] rounded-[1.2rem] border border-dashed opacity-40"
              style={{ borderColor: SKY }}
            />

            {/* Spiral binding */}
            <div className="pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2">
              <SpiralBinding className="h-7 w-14" />
            </div>

            <motion.div
              className="relative flex flex-col items-center text-center"
              variants={cardReveal}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className="relative mb-5">
                <SkyLockSealBadge className="mx-auto flex h-[5rem] w-[5rem] items-center justify-center sm:h-[5.5rem] sm:w-[5.5rem]" />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-[1.85rem]"
                style={{ color: INK }}
              >
                This gift
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-1 font-serif text-[1.55rem] leading-tight italic sm:text-[1.75rem]"
                style={{ color: INK_SOFT }}
              >
                is still locked.
              </motion.p>

              <motion.div variants={fadeUp} className="my-5 w-full">
                <StarRule />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="max-w-[16rem] text-[13.5px] leading-relaxed sm:text-sm"
                style={{ color: INK }}
              >
                Complete the challenge to open your surprise.
              </motion.p>

              <motion.button
                variants={fadeUp}
                type="button"
                aria-label="Start Challenge"
                onClick={onComplete}
                className="relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold tracking-[0.12em] text-white uppercase focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none sm:text-[15px]"
                style={{
                  background: `linear-gradient(180deg, ${SKY} 0%, ${SKY_DEEP} 100%)`,
                  boxShadow:
                    "0 14px 28px -10px rgba(30,58,95,0.45), inset 0 0 0 2px rgba(255,255,255,0.35)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.03, 1],
                        boxShadow: [
                          "0 14px 28px -10px rgba(30,58,95,0.45), inset 0 0 0 2px rgba(255,255,255,0.35)",
                          "0 18px 36px -8px rgba(61,122,173,0.55), inset 0 0 0 2px rgba(255,255,255,0.45)",
                          "0 14px 28px -10px rgba(30,58,95,0.45), inset 0 0 0 2px rgba(255,255,255,0.35)",
                        ],
                      }
                }
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-[5px] rounded-[0.65rem] border border-dashed border-white/70"
                />
                Start Challenge
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
