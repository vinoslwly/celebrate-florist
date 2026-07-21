"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Scattered memory cards — scrapbook energy around the burst. */
const FLOAT_CARDS = [
  {
    className:
      "absolute top-[10%] left-[4%] w-[4.6rem] rotate-[-18deg] sm:left-[8%] sm:w-[5.6rem]",
    delay: 0.18,
    kind: "back" as const,
  },
  {
    className:
      "absolute top-[14%] right-[3%] w-[4.4rem] rotate-[16deg] sm:right-[7%] sm:w-[5.4rem]",
    delay: 0.26,
    kind: "front" as const,
  },
  {
    className:
      "absolute bottom-[16%] left-[6%] w-[4.2rem] rotate-[12deg] sm:bottom-[18%] sm:left-[10%] sm:w-[5.2rem]",
    delay: 0.34,
    kind: "front" as const,
  },
  {
    className:
      "absolute right-[5%] bottom-[14%] w-[4.5rem] rotate-[-14deg] sm:right-[9%] sm:bottom-[16%] sm:w-[5.5rem]",
    delay: 0.3,
    kind: "back" as const,
  },
] as const;

const FALLING_PETALS = [
  { left: "10%", delay: 0.1, duration: 2.4, size: 14, x: 18 },
  { left: "28%", delay: 0.35, duration: 2.1, size: 11, x: -14 },
  { left: "52%", delay: 0.18, duration: 2.6, size: 13, x: 10 },
  { left: "72%", delay: 0.42, duration: 2.2, size: 12, x: -16 },
  { left: "88%", delay: 0.22, duration: 2.5, size: 15, x: 8 },
] as const;

const SPARKLES = [
  { top: "18%", left: "22%", delay: 0.45, size: 10 },
  { top: "24%", right: "20%", delay: 0.58, size: 12 },
  { top: "62%", left: "18%", delay: 0.7, size: 9 },
  { top: "68%", right: "16%", delay: 0.52, size: 11 },
  { top: "42%", left: "8%", delay: 0.65, size: 8 },
  { top: "48%", right: "6%", delay: 0.75, size: 9 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.95"
      />
    </svg>
  );
}

function SoftSakura({ className }: { className?: string }) {
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

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M12 1.5 13.8 9.2 21.5 12 13.8 14.8 12 22.5 10.2 14.8 2.5 12l7.7-2.8L12 1.5Z"
        fill="#E8B86D"
        opacity="0.9"
      />
    </svg>
  );
}

function MemoryCardFace({ kind }: { kind: "back" | "front" }) {
  if (kind === "back") {
    return (
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.65rem] border border-[#D4A574]/70 shadow-[0_10px_24px_-10px_rgba(140,60,90,0.45)]"
        style={{
          background:
            "linear-gradient(160deg, #F3C2CF 0%, #E8A8B8 48%, #D992A8 100%)",
        }}
      >
        <div className="absolute inset-[9%] rounded-[0.4rem] border border-[#E8C9A0]/55" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 48 48"
            className="h-9 w-9 opacity-90 sm:h-11 sm:w-11"
            aria-hidden
          >
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="24"
                cy="14"
                rx="5"
                ry="9"
                fill="#E8C9A0"
                transform={`rotate(${deg} 24 24)`}
              />
            ))}
            <circle cx="24" cy="24" r="3.5" fill="#FFF5F0" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.65rem] border border-[#E8C9A0]/80 shadow-[0_10px_24px_-10px_rgba(140,60,90,0.4)]"
      style={{
        background:
          "linear-gradient(165deg, #FFFCF8 0%, #FFF4EC 55%, #F8E8DE 100%)",
      }}
    >
      <div className="absolute inset-[8%] rounded-[0.35rem] border border-[#E8C9A0]/45" />
      <span className="absolute top-2 left-2 text-[10px] text-[#D4A574]">
        ✦
      </span>
      <span className="absolute right-2 bottom-2 text-[10px] text-[#D4A574]">
        ✦
      </span>
    </div>
  );
}

function FanCards({ className }: { className?: string }) {
  return (
    <div className={`relative h-10 w-24 ${className ?? ""}`} aria-hidden>
      {[-18, -6, 6, 18].map((rot, i) => (
        <div
          key={rot}
          className="absolute bottom-0 left-1/2 h-9 w-6 origin-bottom rounded-sm border border-[#E8C9A0]/70 bg-[#FFF8F2] shadow-sm"
          style={{
            transform: `translateX(-50%) rotate(${rot}deg) translateX(${(i - 1.5) * 4}px)`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * memories.match-transition — scrapbook “MEMORY MATCH!” celebration beat.
 * Auto-advance; no CTA. Excited + tender: cards fly in, burst pops, petals fall.
 */
export function MemoriesMatchTransitionScene(_props: MemoriesSceneProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative flex min-h-full w-full flex-1 overflow-hidden bg-[#F7E6EA]"
      role="status"
      aria-live="polite"
      aria-label="Memory Match"
    >
      {/* Soft scrapbook wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 95% at 50% 40%, #FFFCFB 0%, #FFF3F5 34%, #F8E0E7 68%, #EFC9D4 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          mixBlendMode: "multiply",
        }}
      />

      {/* Torn paper corners + washi */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-2 -left-3 h-28 w-36 -rotate-6 sm:h-36 sm:w-44"
        initial={reduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        <div
          className="h-full w-full bg-[#FFF8F2] shadow-md"
          style={{
            clipPath:
              "polygon(0% 8%, 12% 0%, 34% 6%, 55% 1%, 78% 7%, 100% 2%, 98% 78%, 70% 100%, 40% 88%, 18% 100%, 0% 72%)",
          }}
        />
        <div className="absolute top-6 left-8 h-4 w-14 rotate-[-18deg] rounded-[1px] bg-[#F2A7B5]/75 shadow-sm" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-2 -bottom-3 h-32 w-40 rotate-8 sm:h-40 sm:w-48"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT }}
      >
        <div
          className="h-full w-full bg-[#FFF6F0] shadow-md"
          style={{
            clipPath:
              "polygon(8% 0%, 42% 8%, 70% 0%, 100% 18%, 96% 70%, 100% 100%, 55% 94%, 28% 100%, 0% 78%, 6% 40%)",
          }}
        />
        <div className="absolute top-10 right-10 h-4 w-16 rotate-[22deg] rounded-[1px] bg-[#F2A7B5]/7 shadow-sm" />
      </motion.div>

      {/* Expanding rings — heboh pulse */}
      {!reduceMotion
        ? [0, 1].map((i) => (
            <motion.div
              key={`ring-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-[#F2A7B5]/5"
              style={{
                width: "16vmin",
                height: "16vmin",
                marginLeft: "-8vmin",
                marginTop: "-8vmin",
              }}
              initial={{ opacity: 0.75, scale: 0.35 }}
              animate={{ opacity: 0, scale: 4.4 + i * 0.5 }}
              transition={{
                duration: 1.35,
                delay: 0.06 + i * 0.16,
                ease: EASE_OUT,
              }}
            />
          ))
        : null}

      {/* Falling petals */}
      {!reduceMotion
        ? FALLING_PETALS.map((p, i) => (
            <motion.div
              key={`fall-${i}`}
              aria-hidden
              className="pointer-events-none absolute top-[-8%]"
              style={{ left: p.left, width: p.size, height: p.size * 1.35 }}
              initial={{ opacity: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0.85, 0],
                y: "110vh",
                x: p.x,
                rotate: 40,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))
        : null}

      {/* Corner sakura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-8 right-4 h-24 w-24 sm:top-12 sm:right-10 sm:h-32 sm:w-32"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -12 }}
        animate={{ opacity: 0.95, scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
      >
        <SoftSakura className="h-full w-full drop-shadow-md" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-3 h-28 w-28 sm:bottom-14 sm:left-8 sm:h-36 sm:w-36"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: 10 }}
        animate={{ opacity: 0.92, scale: 1, rotate: 0 }}
        transition={{
          delay: 0.24,
          type: "spring",
          stiffness: 220,
          damping: 16,
        }}
      >
        <SoftSakura className="h-full w-full drop-shadow-md" />
      </motion.div>

      {/* Floating memory cards */}
      {FLOAT_CARDS.map((card, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none z-10 ${card.className}`}
          initial={
            reduceMotion ? false : { opacity: 0, y: 36, scale: 0.7, rotate: 0 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: reduceMotion ? 0 : card.delay,
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
        >
          <MemoryCardFace kind={card.kind} />
        </motion.div>
      ))}

      {/* Sparkles */}
      {!reduceMotion
        ? SPARKLES.map((s, i) => (
            <motion.div
              key={`spark-${i}`}
              aria-hidden
              className="pointer-events-none absolute z-20"
              style={{
                top: s.top,
                left: "left" in s ? s.left : undefined,
                right: "right" in s ? s.right : undefined,
                width: s.size,
                height: s.size,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6], scale: [0, 1.25, 1] }}
              transition={{ delay: s.delay, duration: 0.55, ease: EASE_OUT }}
            >
              <Sparkle className="h-full w-full" />
            </motion.div>
          ))
        : null}

      {/* Hero burst + title */}
      <div className="relative z-30 flex min-h-full flex-1 flex-col items-center justify-center px-4 pb-8 sm:px-6">
        <motion.div
          className="relative flex w-full max-w-lg flex-col items-center sm:max-w-xl"
          initial={
            reduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.55 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { delay: 0.08, type: "spring", stiffness: 280, damping: 16 }
          }
        >
          {/* Washi tape on burst */}
          <div
            aria-hidden
            className="absolute -top-3 left-1/2 z-40 h-5 w-24 -translate-x-1/2 rotate-[-2deg] rounded-[1px] bg-[#F2A7B5]/8 shadow-sm sm:w-28"
          />

          {/* Starburst frame */}
          <div className="relative flex aspect-square w-[min(92vw,22rem)] items-center justify-center sm:w-[min(86vw,26rem)]">
            <div
              aria-hidden
              className="absolute inset-0 bg-[#F9C4D0]/55"
              style={{
                clipPath:
                  "polygon(50% 0%, 61% 14%, 80% 8%, 76% 28%, 100% 35%, 84% 50%, 98% 68%, 74% 70%, 72% 94%, 50% 82%, 28% 94%, 26% 70%, 2% 68%, 16% 50%, 0% 35%, 24% 28%, 20% 8%, 39% 14%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-[6%] bg-[#FFF8F5]"
              style={{
                clipPath:
                  "polygon(50% 2%, 60% 15%, 78% 10%, 74% 30%, 98% 38%, 82% 52%, 96% 70%, 72% 72%, 70% 96%, 50% 84%, 30% 96%, 28% 72%, 4% 70%, 18% 52%, 2% 38%, 26% 30%, 22% 10%, 40% 15%)",
                boxShadow: "0 28px 56px -20px rgba(150,60,95,0.4)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center px-6 text-center">
              <motion.span
                className="mb-1 font-serif text-3xl text-[#E8799A] sm:text-4xl"
                aria-hidden
                initial={
                  reduceMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.3 }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: [0.3, 1.3, 1] }
                }
                transition={{ delay: 0.12, duration: 0.55, ease: EASE_OUT }}
              >
                ♡
              </motion.span>

              <motion.h1
                className="font-sans text-[2.15rem] leading-[0.95] font-black tracking-tight text-[#8B3A4E] uppercase italic sm:text-5xl md:text-[3.35rem]"
                initial={
                  reduceMotion
                    ? { opacity: 1, y: 0, rotate: -2 }
                    : { opacity: 0, y: 22, scale: 0.8, rotate: -8 }
                }
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        delay: 0.2,
                        type: "spring",
                        stiffness: 320,
                        damping: 14,
                      }
                }
              >
                Memory
                <br />
                Match!
              </motion.h1>

              <motion.div
                className="mt-3 flex items-center justify-center"
                aria-hidden
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.42, duration: 0.35 }}
              >
                {/* Decorative ribbon — not a control */}
                <div className="relative flex items-center">
                  <span
                    className="h-0 w-0 border-y-[11px] border-r-[10px] border-y-transparent border-r-[#E8799A]"
                    aria-hidden
                  />
                  <p className="bg-[#F2A7B5] px-3 py-1 font-serif text-[11px] tracking-wide text-[#FFF8F5] sm:text-xs">
                    Let the memories begin
                  </p>
                  <span
                    className="h-0 w-0 border-y-[11px] border-l-[10px] border-y-transparent border-l-[#E8799A]"
                    aria-hidden
                  />
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.55, duration: 0.35 }}
              >
                <FanCards className="mt-3" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
