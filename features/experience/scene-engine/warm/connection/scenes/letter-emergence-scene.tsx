"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";

const BG = "#6B0F16";
const GOLD = "#C9A227";

const SPARKLES = [
  { top: "48%", left: "28%", delay: 0.2, size: 4 },
  { top: "52%", left: "72%", delay: 0.7, size: 3 },
  { top: "58%", left: "24%", delay: 1.1, size: 5 },
  { top: "54%", left: "76%", delay: 0.4, size: 3 },
  { top: "62%", left: "38%", delay: 1.4, size: 4 },
  { top: "60%", left: "62%", delay: 0.9, size: 3 },
  { top: "44%", left: "48%", delay: 0.55, size: 3 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#8B1A22"
        opacity="0.85"
      />
    </svg>
  );
}

/**
 * warm.connection.letter-emergence — Scene 10 transition.
 * Mirrors Warm Moments gift-opening letter stage (open gift + To/From),
 * auto-advance only — no “Tap the letter” CTA.
 */
export function WarmConnectionLetterEmergenceScene({
  payload,
}: WarmConnectionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const toName = payload.experience.greeting_name;
  const fromName = payload.experience.closing_name;

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ backgroundColor: BG }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 8% 18%, rgba(30,4,8,0.55) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 70%, rgba(90,18,24,0.35) 0%, transparent 65%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute right-[18%] bottom-[14%] opacity-80 sm:right-[22%] sm:bottom-[12%]"
      >
        <SoftPetal className="h-8 w-6 rotate-[28deg] sm:h-10 sm:w-7" />
      </div>

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
                backgroundColor: GOLD,
                boxShadow: `0 0 10px ${GOLD}`,
              }}
              animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.3, 0.8] }}
              transition={{
                duration: 2.4,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-10 sm:py-14">
        <div className="relative mx-auto w-full max-w-sm">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[18%] left-1/2 z-0 h-52 w-60 -translate-x-1/2 rounded-full sm:h-60 sm:w-72"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,220,150,0.55) 0%, rgba(180,40,50,0.25) 45%, transparent 70%)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.7 }
                : { opacity: [0.45, 0.9, 0.45], scale: [0.96, 1.05, 0.96] }
            }
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            role="img"
            aria-label={`Letter to ${toName} from ${fromName}`}
            className="relative z-20 mx-auto w-[12rem] sm:w-[13.5rem]"
            initial={reduceMotion ? false : { y: 90, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              ease: [0.22, 1, 0.36, 1],
              delay: reduceMotion ? 0 : 0.12,
            }}
          >
            <div
              className="relative overflow-hidden rounded-md bg-[#FFF8F2] px-4 pt-5 pb-6 shadow-[0_18px_40px_-16px_rgba(40,0,0,0.55)] sm:px-5 sm:pt-6 sm:pb-7"
              style={{ border: `1.5px solid ${GOLD}` }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2 rounded-sm"
                style={{ border: "1px solid rgba(201,162,39,0.45)" }}
              />

              <p
                className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
                style={{ color: "#A51C28" }}
              >
                To:
              </p>
              <p
                className="mt-1 text-center font-serif text-2xl font-semibold sm:text-3xl"
                style={{ color: "#6B0F16" }}
              >
                {toName}
              </p>

              <div
                className="my-4 flex items-center justify-center gap-2"
                style={{ color: GOLD }}
              >
                <span className="h-px w-8 bg-current" aria-hidden />
                <span className="text-xs" aria-hidden>
                  ◆
                </span>
                <span className="h-px w-8 bg-current" aria-hidden />
              </div>

              <p
                className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]"
                style={{ color: "#A51C28" }}
              >
                From:
              </p>
              <p
                className="mt-1 text-center font-serif text-xl font-semibold sm:text-2xl"
                style={{ color: "#6B0F16" }}
              >
                {fromName}
              </p>
            </div>
          </motion.div>

          <div
            className="relative z-10 -mt-8 flex justify-center sm:-mt-10"
            aria-hidden
          >
            <WarmGiftBox
              variant="open"
              animateLid
              reduceMotion={reduceMotion}
              className="h-36 w-[18rem] sm:h-40 sm:w-[20rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
